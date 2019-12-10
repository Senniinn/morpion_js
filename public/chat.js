// $("#chatroom").animate({ scrollTop: $(this).scrollHeight }, "slow");
$(function(){
    //make connection
    var socket = io.connect('http://10.8.0.4:3000');

    //buttons and inputs
    var message = $("#message");
    var username = $("#username");
    var send_message = $("#send_message");
    var send_username = $("#send_username");
    var chatroom = $("#chatroom");
    var feedback = $("#feedback");

    //Emit message
    send_message.submit(e => {
        e.preventDefault();
        socket.emit('new_message', {message : message.val()})
    });

    //Listen on new_message
    socket.on("new_message", (data) => {
        feedback.html('');
        message.val('');
        chatroom.append(`<h6 class='message'>${data.username}: ${data.message}</h6>`)
    });

    //Emit a username
    send_username.submit(e =>{
        e.preventDefault();
        socket.emit('change_username', {username : username.val()});
    });

    //Emit typing
    message.bind("keypress", () => {
        socket.emit('typing')
    });

    //Listen on typing
    socket.on('typing', (data) => {
        feedback.html(`<p><i>${data.username} is typing a message...</i></p>`)
    });
    //Listen on chat
    socket.on('chat', (data) => {
        data.chat.forEach(message => chatroom.append(`<h6 class='message'>${message.username}: ${message.message}</h6>`))
    });
    // Create a new game. Emit newGame event.
    $('#new').on('submit', (e) => {
        e.preventDefault();
        const name = $('#username').val();
        if (!name) {
            alert('Please enter your name.');
            return;
        }
        socket.emit('createGame', { name });
    });

    // Join an existing game on the entered roomId. Emit the joinGame event.
    $('#join').on('click', () => {
        const name = $('#nameJoin').val();
        const roomID = $('#room').val();
        if (!name || !roomID) {
            alert('Entrez votre pseudo et le gameId');
            return;
        }
        socket.emit('joinGame', { name, room: roomID });
    });

    // New Game created by current client. Update the UI and create new Game var.
    socket.on('newGame', (data) => {
        const message =
            `Hello, ${data.name}. Please ask your friend to enter Game ID: 
      ${data.room}. Waiting for player 2...`;
        $('.menu').css('display', 'none');
        $('.gameBoard').css('display', 'block');
        $('#userHello').html(message);
    });

    /**
     * If player creates the game, he'll be P1(X) and has the first turn.
     * This event is received when opponent connects to the room.
     */
    socket.on('player1', (data) => {
        console.log("player 2 connecté");
        const message = `Hello ${data.name}`;
        $('#userHello').html(message);
    });

    /**
     * Joined the game, so player is P2(O).
     * This event is received when P2 successfully joins the game room.
     */
    socket.on('player2', (data) => {
        const message = `Hello, ${data.name}`;

        $('.menu').css('display', 'none');
        $('.gameBoard').css('display', 'block');
        $('#userHello').html(message);
    });

    /**
     * Opponent played his turn. Update UI.
     * Allow the current player to play now.
     */
    socket.on('turnPlayed', (data) => {
        const row = data.tile.split('_')[1][0];
        const col = data.tile.split('_')[1][1];
        const opponentType = player.getPlayerType() === P1 ? P2 : P1;

        game.updateBoard(opponentType, row, col, data.tile);
        player.setCurrentTurn(true);
    });

    // If the other player wins, this event is received. Notify user game has ended.
    socket.on('gameEnd', (data) => {
        game.endGame(data.message);
        socket.leave(data.room);
    });

    /**
     * End the game on any err event.
     */
    socket.on('err', (data) => {
        game.endGame(data.message);
    });
});


