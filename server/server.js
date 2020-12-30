const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const sanitizeHtml = require('sanitize-html');
const EmojiMap = require('emoji-name-map');

const Player = require('./utils/Player');
const Rooms = require('./utils/Rooms');
const Room = require('./utils/Room');
const generateName = require('./utils/generateName');
const formatMsg = require('./utils/formatMsg');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*',
    }
});

// app.use(express.static(path.join(__dirname, 'build')));

// app.get('/*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

const gameRooms = new Rooms();

addDefaultRooms(3);

io.on('connection', onConnect);

function onConnect(socket) {
    socket.emit('rooms', gameRooms.roomsData);
    socket.on('join', (username, roomID) => {
        onPlayerJoin(username, roomID, socket);
    });
}

function onPlayerJoin(username, roomID, socket) {
    if (!username) username = generateName();
    const player = new Player(username, socket.id);
    const room = gameRooms.find(roomID);

    socket.join(room.id)
    room.addPlayer(player);

    socket.broadcast.emit('rooms', gameRooms.roomsData);

    socket.emit('roomJoin', socket.id, room.roomData);
    io.to(room.id).emit('playerList', room.players);

    // if (room.players.length >= 2) room.startGame();

    socket.emit(
        'chatMessage', 
        formatMsg('#3498DB', `You joined ${room.name}`)
    );

    io.to(room.id).emit(
        'chatMessage', 
        formatMsg('#2ECC71', `${player.username} joined the game.`)
    );

    socket.on('drawCommand', command => {
        onDrawCommand(command, room, socket);
    });

    socket.on('chatMessage', msg => {
        onChatMessage(msg, room, player);
    });

    socket.on('canvasState', state => {
        saveCanvasState(state, room, socket);
    });

    socket.on('getCanvasState', () => {
        socket.emit('canvasState', room.canvasState);
    });

    socket.on('disconnect', () => {
        onPlayerDisconnect(room, player);
    });

    socket.on('chosenWord', wordIndex => {
        if (player.id !== room.currentDrawer.id) return; 
        handleChosenWord(wordIndex, room);
    });
}

function handleChosenWord(wordIndex, room) {
    if (wordIndex > 2 || wordIndex < 0) 
        wordIndex = Math.floor(Math.random() * 3);

    room.word = room.words[wordIndex];

    room.io.to(room.currentDrawer.id).emit(
        'word', { word: room.word }
    );

    if (room.roundIntermission)
        room.nextTurn();
}

function onPlayerDisconnect(room, player) {
    room.removePlayer(player);
    
    io.to(room.id).emit(
        'chatMessage',
        formatMsg('orange', `${player.username} left the game.`)
    );

    io.to(room.id).emit('playerList', room.players);

    // if (room.players.length < 2 && room.gameStarted) room.stopGame();
}

function saveCanvasState(state, room, socket) {
    if (room.gameStarted === false) {
        room.canvasState = state;
    }
    else if (room.gameStarted === true) {
        if (!room.currentDrawer || socket.id !== room.currentDrawer.id)  {
            return;
        }
        room.canvasState = state;
    }
}

function onChatMessage(msg, room, player) {
    const sanitized = sanitizeHtml(msg);
    const cleanMsg = removeStringHTML(sanitized);

    if (room.gameStarted && player.id !== room.currentDrawer.id
        && !player.guessed) {
        if (cleanMsg.toLowerCase() === room.word.toLowerCase()) {
            io.to(room.id).emit(
                'chatMessage', 
                formatMsg(
                    'blue', 
                    `${player.username} guessed the word!`,
                    true)
            )
            player.updateScore(room.seconds * 5);
            player.guessed = true;

            const guessedPlayers = room.players.filter(player => player.guessed);

            if (guessedPlayers.length >= room.players.length - 1) {
                room.intermission();
            }

            io.to(room.id).emit(
                'playerList',
                room.players
            );
            
            return;
        }
    } 
    
    if (cleanMsg) {
        const emojiRegex = /(:[\w\d]+:)/g;
        const emojiParse = cleanMsg.replace(emojiRegex, match => {
            const emojiFound = EmojiMap.get(match);
            return emojiFound ? emojiFound : match;
        });

        io.to(room.id).emit(
            'chatMessage', 
            formatMsg('white', emojiParse,  false, player.username)
        );
    }
}

function onDrawCommand(command, room, socket) {
    if (room.gameStarted === false) 
        socket.to(room.id).emit('drawCommand', command);
    else if (room.gameStarted === true) {
        if (!room.currentDrawer || socket.id !== room.currentDrawer.id) return;
        socket.to(room.id).emit('drawCommand', command);
    }
}

function addDefaultRooms(amount) {
    for (let i = 0; i < amount; i++) {
        gameRooms.add(new Room(io, {name: `Room ${i + 1}`}));
    }
}

function removeStringHTML(string) {
    return string.replace(/<\/?[^>]+(>|$)/g, "");;
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));