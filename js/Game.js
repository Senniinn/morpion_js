module.exports = class Game {
    constructor(roomId, player1) {
        this.roomId = roomId;
        this.player1 = player1;
        this.player2 = null;
        this.move = 0;
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.inGameBoard = ['', '', '', '', '', '', '', '', ''];
    }

    changeTurn(){
        this.player1.currentTurn = !this.player1.currentTurn;
        this.player2.currentTurn = !this.player2.currentTurn;
    }

    displayBoard = () => this.inGameBoard;

    getRoomId = () => this.roomId;

    findPlayer = (name) => name === this.player1.getPlayerName() ? this.player1 : this.player2;

    updateBoard(type, img, casee) {
        this.board[casee] = type;
        this.inGameBoard[casee] = "<img src='" + img + "' class='img-fluid'/>";
        const winner = this.checkWinner();

        if(winner !== null)
            return {board: this.displayBoard(), win:winner};

        const nul = this.checkMove();
        if(nul !== null)
            return nul;

        return this.displayBoard();
    }

    checkMove = () => {
        this.move++;
        if(this.move === 9)
            return {board: this.displayBoard(), win: null}
        return null;
    };
    currentPlayer = () => this.player1.currentTurn === true ? this.player1 : this.player2;

    checkWinner() {
        const currentType = this.currentPlayer().getPlayerType();
        for (let i = 0; i < 9; i = i+3)
        {
            if ((this.board[i] === currentType) && (this.board[i+1] === currentType) && (this.board[i+2] === currentType))
            {
                return this.board[i]+" à gagner";
            }
        }

        for (let i = 0; i<3; i++)
        {
            if ((this.board[i] === currentType) && (this.board[i+3] === currentType) && (this.board[i+6] === currentType))
            {
                return this.board[i]+" à gagner";
            }
        }

        if ((this.board[0] === currentType) && (this.board[4] === currentType) && (this.board[8] === currentType))
        {
            return this.board[0]+" à gagner";
        }
        else if ((this.board[2] === currentType) && (this.board[4] === currentType) && (this.board[6] === currentType))
        {
            return this.board[2]+" à gagner";
        }
        return null;
    }
};
