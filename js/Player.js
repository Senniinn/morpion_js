module.exports = class Player {
    constructor(username, name, type) {
        this.username = username;
        this.name = name;
        this.type = type;
        this.currentTurn = name === "j1";
    }

    getPlayerUsername = () => this.username;

    getPlayerName = () => this.name;

    getPlayerType = () => this.type;

    getPlayerImg = () => this.getPlayerType() === "X" ? "/img/croix.png" : "/img/cercle.png";

    getCurrentTurn = () => this.currentTurn;
};
