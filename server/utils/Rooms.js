class Rooms {
    constructor() {
        this.rooms = [];
    }

    get roomsData() {
        return this.rooms.map(room => {
            return {
                id: room.id,
                name: room.name,
                maxPlayers: room.maxPlayers,
                maxRounds: room.maxRounds,
                currentRound: room.currentRound,
                players: room.players.map(player => player.username)
            }
        });
    }

    add(room) {
        this.rooms.push(room)
        return room;
    }

    remove(room) {
        this.rooms = this.rooms.filter(r => r.id != room.id);
    }

    find(roomID) {
        const found = this.rooms.find(room => room.id === roomID);
        return found || this.rooms[0]
    }

}

module.exports = Rooms;