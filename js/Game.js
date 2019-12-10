module.exports = class Game {
    constructor(roomId) {
        this.roomId = roomId;
        this.moves = 0;
    }

    // Create the Game board by attaching event listeners to the buttons.
    createGameBoard() {
        function tileClickHandler() {
            const casee = parseInt(this.id.split('_')[1]);
            if (!player.getCurrentTurn() || !game) {
                alert('Its not your turn!');
                return;
            }

            if ($(this).prop('disabled')) {
                alert('This tile has already been played on!');
                return;
            }

            // Update board after your turn.
            game.playTurn(this);
            game.updateBoard(player.getPlayerType(), casee, this.id);

            player.setCurrentTurn(false);
            document.getElementById(this.id).className = player.getPlayerType();

            game.checkWinner();
        }
    }
    // Remove the menu from DOM, display the gameboard and greet the player.
    displayBoard(message) {
        $('.menu').css('display', 'none');
        $('.gameBoard').css('display', 'block');
        $('#userHello').html(message);
        this.createGameBoard();
    }


    updateBoard(type, casee, tile) {
        $(`#${tile}`).text(type).prop('disabled', true);
        this.board[casee] = type;
        this.moves++;
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

    getCase(id) {
        return document.getElementById("button_"+id);
    }

    checkWinner() {
        for (var i = 1; i<9; i=i+3)
        {
            if ((getCase(i).className === "j1") && (getCase(i+1).className === "j1") && (getCase(i+2).className === "j1"))
            {
                alert(getCase(i).className+" à gagner")
            }
            else if ((getCase(i).className === "j2") && (getCase(i+1).className === "j2") && (getCase(i+2).className === "j2"))
            {
                alert(getCase(i).className+" à gagner")
            }
        }

        for (var i = 1; i<3; i++)
        {
            if ((getCase(i).className === "j1") && (getCase(i+3).className === "j1") && (getCase(i+6).className === "j1"))
            {
                alert(getCase(i).className+" à gagner")
            }
            else if ((getCase(i).className === "j2") && (getCase(i+3).className === "j2") && (getCase(i+6).className === "j2"))
            {
                alert(getCase(i).className+" à gagner")
            }
        }

        if ((getCase(1).className === "j1") && (getCase(5).className === "j1") && (getCase(9).className === "j1"))
        {
            alert(getCase(1).className+" à gagner")
        }
        else if ((getCase(1).className === "j2") && (getCase(5).className === "j2") && (getCase(9).className === "j2"))
        {
            alert(getCase(1).className+" à gagner")
        }
        else if ((getCase(3).className === "j1") && (getCase(5).className === "j1") && (getCase(7).className === "j1"))
        {
            alert(getCase(3).className+" à gagner")
        }
        else if ((getCase(3).className === "j2") && (getCase(5).className === "j2") && (getCase(7).className === "j2"))
        {
            alert(getCase(3).className+" à gagner")
        }
    }

    checkTie() {
        return this.moves >= 9;
    }

    // Announce the winner if the current client has won.
    // Broadcast this on the room to let the opponent know.
    announceWinner() {
        const message = `${player.getPlayerName()} wins!`;
        socket.emit('gameEnded', {
            room: this.getRoomId(),
            message,
        });
        alert(message);
        location.reload();
    }

    // End the game if the other player won.
    endGame(message) {
        alert(message);
        location.reload();
    }
}
