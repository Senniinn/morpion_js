module.exports = class Game {
    constructor(roomId, player1) {
        this.roomId = roomId;
        this.player1 = player1;
        this.player2 = null;
        this.moves = 0;
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.inGameBoard = ['', '', '', '', '', '', '', '', ''];
    }



    changeTurn(){
        if (this.player1.currentTurn === true && this.player2.currentTurn === false){
            this.player1.currentTurn = false;
            this.player2.currentTurn = true;
        } else {
            this.player1.currentTurn = true;
            this.player2.currentTurn = false;
        }
    }

    // Remove the menu from DOM, display the gameboard and greet the player.
    displayBoard() {
        return this.inGameBoard;
    }

    getRoomId() {
        return this.roomId;
    }

    findPlayer(name) {
        if(name === this.player1.getPlayerName())
            return this.player1;
        return this.player2;
    }
    updateBoard(type, img, casee) {
        this.board[casee] = type;
        this.inGameBoard[casee] = "<img src='" + img + "' class='img-fluid'/>";
        this.moves++;
        var winner = this.checkWinner();


        if(winner !== null)
            return {board: this.displayBoard(), win:winner};



        return this.displayBoard();
    }

    checkWinner() {
        for (var i = 0; i<9; i=i+3)
        {
            if ((this.board[i] === "X") && (this.board[i+1] === "X") && (this.board[i+2] === "X"))
            {
                return this.board[i]+" à gagner";
            }
            else if ((this.board[i] === "O") && (this.board[i+1] === "O") && (this.board[i+2] === "O"))
            {
                return this.board[i]+" à gagner";
            }
        }

        for (var i = 0; i<3; i++)
        {
            if ((this.board[i] === "X") && (this.board[i+3] === "X") && (this.board[i+6] === "X"))
            {
                return this.board[i]+" à gagner";
            }
            else if ((this.board[i] === "O") && (this.board[i+3] === "O") && (this.board[i+6] === "O"))
            {
                return this.board[i]+" à gagner";
            }
        }

        if ((this.board[0] === "X") && (this.board[4] === "X") && (this.board[8] === "X"))
        {
            return this.board[O]+" à gagner";
        }
        else if ((this.board[0] === "O") && (this.board[4] === "O") && (this.board[8] === "O"))
        {
            return this.board[0]+" à gagner";
        }
        else if ((this.board[2] === "X") && (this.board[4] === "X") && (this.board[6] === "X"))
        {
            return this.board[2]+" à gagner";
        }
        else if ((this.board[2] === "O") && (this.board[4] === "O") && (this.board[6] === "O"))
        {
            return this.board[2]+" à gagner";
        }
        return null;
    }
};
