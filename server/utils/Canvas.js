class Game {
    constructor(socket) {
        this.socket = socket;
        this.canvas = document.querySelector("#canvas");
        this.ctx = this.canvas.getContext('2d');
        this.maxUndos = 20;
        this.drawingHistory = [];
        this.maxBrushSize = 64;
        this.minBrushSize = 2;
        this.pointerDown = false;
        this.startPos = null;
        this.gameStarted = false;
        this.tool = this.tools.brush;
        this.tools = {
            brush: 'BRUSH',
            fill: 'FILL',
            eraser: 'ERASER'
        }
    };

    revealGame() {
        const gameContainer = document.querySelector('#game');
        const joinContainer = document.querySelector('.join-container');
        gameContainer.style.display = '';
        joinContainer.style.display = 'none';
    }

    hideGame() {
        const gameContainer = document.querySelector('#game');
        const joinContainer = document.querySelector('.join-container');
        gameContainer.style.display = 'none';
        joinContainer.style.display = '';
    }

    joinRoom(e) {
        const username = document.querySelector('#username').value.trim();
        const roomID = e.target.parentElement.dataset.id;
        if (!roomID) return;
    
        socket.emit('join', username, roomID);
    }

    updatePlayerlist(playerArray) {
        const playerList = document.querySelector('#playerList');
        playerList.innerHTML = '';
    
        playerArray.forEach(player => {
            const playerNode = document.createElement('li');
            playerNode.textContent = player.name || player.username;
            playerList.appendChild(playerNode);
        });
    }

    loadCanvasState(state) {
        if (state) {
            loadDataURL(state);
        } else{
            clearCanvas();
        } 
    }

    loadDataURL(data) {
        const canvasImage = new Image(canvasWidth, canvasHeight);
        canvasImage.src = data;
        canvasImage.onload = () => {
            this.ctx.drawImage(canvasImage, 0, 0);
            this.drawingHistory.push(ctx.getImageData(0, 0, canvasWidth, canvasHeight));
        }
    }

    
}

class gamePlayer{
    constructor(id) {
        this.id = ID;
    }
}