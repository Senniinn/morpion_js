$("#chatroom").animate({ scrollTop: $(this).scrollHeight }, "slow");
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
    })
});


