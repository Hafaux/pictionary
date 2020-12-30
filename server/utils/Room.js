const getRandomWords = require('./getRandomWords');
const makeID = require('./makeId');
const generateHint = require('./generateHint');

class Room {
    constructor(io = {}, {
        id = null, 
        name = null, 
        maxPlayers = 8, 
        roundTime = 30, 
        maxRounds = 3
    } = {}) {
        this.id = id || makeID(6);
        this.name = name || `#${this.id}`;
        this.maxPlayers = maxPlayers;
        this.roundTime = roundTime;
        this.maxRounds = maxRounds;
        this.canvasState;
        this.currentDrawer;
        this.drawerIndex = 0;
        this.currentRound = 1;
        this.roundIntermission = false;
        this.gameStarted = false;
        this.players = [];
        this.kickedPlayers = [];
        this.io = io;
        this.seconds;
        this.intermissionTime = 15;
        this.word;
        this.words = []
    }

    get roomData() {
        return {
            id: this.id,
            name: this.name,
            players: this.players,
            canvasState: this.canvasState,
            currentDrawer: this.currentDrawer,
            gameStarted: this.gameStarted
        }
    }

    addPlayer(player) {
        if (this.players.length < this.maxPlayers) {
            this.players.push(player);

            // this.io.to(player.id).emit('roomJoin', this.roomData);
            
            return this.players.length - 1;
        }
        else {
            return -1;
        }
    }

    removePlayer(player) {
        this.players = this.players.filter(p => p.id != player.id);
    }

    startGame() {
        this.gameStarted = true;
        this.currentRound = 1;
        this.currentDrawer = this.players[this.drawerIndex];
        this.canvasState = null;

        this.startGameLoop();
    }

    startGameLoop() {
        this.seconds = 1;

        const gameLoop = setInterval(() => {
            if (!this.gameStarted) clearInterval(gameLoop);

            this.seconds--;

            this.io.to(this.id).emit(
                'seconds',
                this.seconds
            )

            if (this.seconds <= 0 && !this.roundIntermission)
                this.intermission();
            else if (this.seconds <= 0 && this.roundIntermission) 
                this.nextTurn();
        }, 1000);
    }

    resetWords() {
        this.word = null;
        this.words = [];
    }

    resetGuessedPlayers() {
        this.players.forEach(player => (player.guessed = false));
    }

    intermission() {
        this.seconds = this.intermissionTime;
        this.roundIntermission = true;

        this.io.to(this.id).emit(
            'chatMessage',
            `<b style="color: green">${
                this.word ? 'The word was ' + this.word : 
                'Game is starting'
            }</b>`
        );

        this.resetGuessedPlayers();
        this.resetWords();
        
        this.getNextDrawer();

        this.words = getRandomWords();

        this.io.to(this.currentDrawer.id).emit(
            'chooseWord', this.words
        );

        this.io.to(this.id).emit('turnData',
            {
                roundIntermission: true,
            }
        );
    }

    nextTurn() {
        this.seconds = this.roundTime;
        this.roundIntermission = false;
        this.canvasState = null;

        if (!this.word) {
            this.word = this.words[Math.floor(Math.random() * 3)]
        }

        this.io.to(this.id).emit('turnData',
            {
                roundIntermission: false,
                currentDrawerID: this.currentDrawer.id,
                hint: generateHint(this.word),
                round: this.currentRound
            }
        );

        this.io.to(this.id).emit(
            'chatMessage', 
            `<b style="color: purple">${this.currentDrawer.username} is drawing now</b>`
        );

        this.io.to(this.currentDrawer.id).emit(
            'chatMessage',
            `<b style="color: red">Draw ${this.word}</b>`
        );

    }

    endGameScreen() {
        this.currentRound = 1;
        this.resetScore();
    }

    resetScore() {
        this.players.forEach(player => {
            player.resetScore();
        });
    }

    getNextDrawer() {
        this.drawerIndex++;
        if (this.drawerIndex >= this.players.length) {
            this.currentRound++;
            if (this.currentRound > this.maxRounds) {
                this.endGameScreen();
            }
            this.drawerIndex = 0;
            this.currentDrawer = this.players[this.drawerIndex];
        } else {
            this.currentDrawer = this.players[this.drawerIndex];
        }
    }

    stopGame() {
        this.resetRoomState();
        console.log('game stopped');
    }

    resetRoomState() {
        this.canvasState = null;
        this.currentDrawer = null;
        this.currentRound = 1;
        this.roundIntermission = true;
        this.gameStarted = false;
    }
}

module.exports = Room;