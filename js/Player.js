module.exports = class Player {
    constructor(username, name, type) {
        this.username = username;
        this.name = name;
        this.type = type;
        this.currentTurn = name === "j1";
    }

    setCurrentTurn(turn) {
        this.currentTurn = turn;
        const message = turn ? 'Your turn' : 'Waiting for Opponent';
        $('#turn').text(message);
    }

    getPlayerUsername() {
        return this.username;
    }

    getPlayerName() {
        return this.name;
    }

    getPlayerType() {
        return this.type;
    }

    getPLayerImg() {
        return this.type === "X" ? "/img/croix.png" : "/img/cercle.png";
    }

    getCurrentTurn() {
        return this.currentTurn;
    }
};
