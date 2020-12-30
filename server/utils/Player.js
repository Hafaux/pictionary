class Player {
    constructor(username, id) {
        this.id = id;
        this.username = username;
        this.score = 0;
        this.guessed = false;
    }

    updateScore(bonusScore) {
        this.score += bonusScore;
    }

    resetScore() {
        this.score = 0;
    }

    joinRoom(room) {
        room.addPlayer(this);
        return room;
    }
}

module.exports = Player;