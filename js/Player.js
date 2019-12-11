module.exports = class Player {
  constructor(username, name, type) {
    this.name = username;
    this.name = name;
    this.type = type;
    if (name === "j1"){
      this.currentTurn = true;
    } else  {
      this.currentTurn = false;
    }
  }

  // Set the bit of the move played by the player
  // tileValue - Bitmask used to set the recently played move.
  updatePlaysArr(tileValue) {
    this.playsArr += tileValue;
  }

  getPlaysArr() {
    return this.playsArr;
  }

  // Set the currentTurn for player to turn and update UI to reflect the same.
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
    if (this.type === "X"){
      return "/img/croix.png";
    } else {
      return "/img/cercle.png";
    }
  }

  getCurrentTurn() {
    return this.currentTurn;
  }
}
