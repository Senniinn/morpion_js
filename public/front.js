$(function(){
    var socket = io.connect('http://127.0.0.1:3000');

    var message = $("#message");
    var username = $("#username");
    var send_message = $("#send_message");
    var send_username = $("#send_username");
    var chatroom = $("#chatroom");
    var feedback = $("#feedback");
    var roomId = $("#roomId").val();

    if(roomId !== null && roomId !== "") {
        socket.emit('join_or_create_game', {room : roomId});
    }

    send_message.submit(e => {
        e.preventDefault();
        socket.emit('new_message', {message : message.val()})
    });

    socket.on("new_message", (data) => {
        feedback.html('');
        message.val('');
        chatroom.append(`<h6 class='message'> ${data.username} <a href="/${data.room}">${data.room}</a>: ${data.message}</h6>`)
    });

    send_username.submit(e =>{
        e.preventDefault();
        socket.emit('change_username', {username : username.val()});
    });

    message.bind("keypress", () => {
        socket.emit('typing')
    });

    socket.on('typing', (data) => {
        feedback.html(`<p><i>${data.username} is typing a message...</i></p>`)
    });

    socket.on('chat', (data) => {
        data.chat.forEach(message => chatroom.append(`<h6 class='message'><strong class="text-muted">${message.username}</strong><a href="/${data.room}">Rejoindre</a> : ${message.message}</h6>`))
    });

    $('#new').on('submit', (e) => {
        e.preventDefault();
        const name = $('#username').val();
        if (!name) {
            alert('Please enter your name.');
            return;
        }
        socket.emit('createGame', { name });
        $('.tile').prop("disabled", true);
    });

    $('#join').on('submit', (e) => {
        e.preventDefault();
        const name = $('#nameJoin').val();
        const roomID = $('#room').val();
        if (!name || !roomID) {
            alert('Entrez votre pseudo et le gameId');
            return;
        }
        socket.emit('joinGame', { name, room: roomID });
        $('.tile').prop("disabled", true);
    });

    $('#morpion').find("button").on('click', (event) => {
        socket.emit('case_clicked', { buttonId: event.target.id.split("_")[1] });
    });

    socket.on('match_null', (data) => {
        alert("match null !");
        window.location = "/";
    });

    socket.on('newGame', (data) => {
        const message =
            `Salut, ${data.name}. Dit à ton pote de rejoindre la room: 
      ${data.room}. En attente d'un nouveau joueur ...`;
        $('.menu').css('display', 'none');
        $('.gameBoard').css('display', 'block');
        $('#userHello').html(message);
    });

    socket.on('player1', (data) => {
        console.log("player 2 connecté");
        const message = `Hello ${data.username}`;
        $('#userHello').html(message);
        $('.tile').prop("disabled", false);
    });

    socket.on('player2', (data) => {
        const message = `Hello, ${data.username}`;

        $('.menu').css('display', 'none');
        $('.gameBoard').css('display', 'block');
        $('#userHello').html(message);
        $('.tile').prop("disabled", true);
    });

    socket.on('change_turn', () => {
        $('.tile').prop("disabled", false);
    });

    socket.on('gameEnd', (data) => {
        alert(data.message);
        socket.emit('leave_room');
        window.location = "/";
    });

    socket.on('update_board', (data) => {
        data.board.forEach((casee, index)=>{
            $('#button_'+index).empty().append(casee);
        });
        $('.tile').prop("disabled", true);
    });

    socket.on('ask_username', (data) => {
        var username = prompt("Quel est votre nom ?");
        socket.emit('change_username', {username: username})
    });

    socket.on('err', data => alert(data.message));
});

