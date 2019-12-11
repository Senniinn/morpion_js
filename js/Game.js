module.exports = class Game {
    constructor(roomId, player1) {
        this.roomId = roomId;
        this.player1 = player1;
        this.player2 = null;
        this.moves = 0;
        this.board = ['', '', '', '', '', '', '', '', ''];
    }

    // Remove the menu from DOM, display the gameboard and greet the player.
    displayBoard() {
        return this.board;
    }


    updateBoard(type, casee) {
        this.board[casee] = type;
        this.checkWinner();
        this.moves++;

        console.log(this.board);
        return this.displayBoard();
    }

    getRoomId() {
        return this.roomId;
    }

    // Send an update to the opponent to update their UI's tile
    playTurn(tile) {
        const clickedTile = $(tile).attr('id');

        // Emit an event to update other player that you've played your turn.
        socket.emit('playTurn', {
            tile: clickedTile,
            room: this.getRoomId(),
        });
    }



    checkWinner() {
        for (var i = 1; i<9; i=i+3)
        {
            if ((this.board[i] === "X") && (this.board[i+1] === "X") && (this.board[i+2] === "X"))
            {
                return this.board[i]+" à gagner";
            }
            else if ((this.board[i] === "O") && (this.board[i+1] === "0") && (this.board[i+2] === "0"))
            {
                return this.board[i]+" à gagner";
            }
        }

        for (var i = 1; i<3; i++)
        {
            if ((this.board[i] === "X") && (this.board[i+3] === "X") && (this.board[i+6] === "X"))
            {
                return this.board[i]+" à gagner";
            }
            else if ((this.board[i] === "0") && (this.board[i+3] === "0") && (this.board[i+6] === "0"))
            {
                return this.board[i]+" à gagner";
            }
        }

        if ((this.board[1] === "X") && (this.board[5] === "X") && (this.board[9] === "X"))
        {
            return this.board[1]+" à gagner";
        }
        else if ((this.board[1] === "0") && (this.board[5] === "0") && (this.board[9] === "0"))
        {
            return this.board[1]+" à gagner";
        }
        else if ((this.board[3] === "X") && (this.board[5] === "X") && (this.board[7] === "X"))
        {
            return this.board[3]+" à gagner";
        }
        else if ((this.board[3] === "0") && (this.board[5] === "0") && (this.board[7] === "0"))
        {
            return this.board[3]+" à gagner";
        }
    }


};
