var test = require('./js/main.js');
const express = require('express');
const app = express();

console.log(new test());
const chat = [];

//set the template engine ejs
app.set('view engine', 'ejs');

//middlewares
app.use(express.static('public'));


//routes
app.get('/', (req, res) => {
    res.render('index')
});

//Listen on port 3000
server = app.listen(3000);



//socket.io instantiation
const io = require("socket.io")(server);

io.clients((error, clients) => {
    if (error) throw error;
    console.log(clients);
});
//listen on every connection
io.on('connection', (socket) => {
    console.log('New user connected');

    //default username
    socket.username = "Anonymous";
    socket.emit('chat', {chat:chat});
    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username
    });

    //listen on new_message
    socket.on('new_message', (data) => {
        chat.unshift({username: socket.username, message:data.message});
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
    });

    //listen on typing
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', {username : socket.username})
    });

    socket.on('play', () => {
        socket.broadcast.emit('game', {game: cejeu})
    })
});
