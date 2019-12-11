var Player = require('./js/Player.js');
var Game = require('./js/Game.js');
const express = require('express');
const app = express();

const chat = [];
let rooms = 0;




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
    });
    socket.on('createGame', (data) => {
        console.log("new Game");
        socket.join(`room-${++rooms}`);
        socket.player = "j1";
        var player1 = new Player(data.name, "j1", 'X');
        var game = new Game(`room-${rooms}`,player1);
        io.sockets.adapter.rooms[`room-${rooms}`].game = game;
        socket.emit('newGame', { name: data.name, room: `room-${rooms}` });
    });
    // Connect the Player 2 to the room he requested. Show error if room full.
    socket.on('joinGame', (data) => {
        console.log("Connexion à la room : " + data.room);
        const room = io.nsps['/'].adapter.rooms[data.room];
        if (room) {
            if(room.length === 1) {
                var game = io.sockets.adapter.rooms[`room-${rooms}`].game;
                socket.join(data.room);
                socket.player = "j2";
                socket.broadcast.to(data.room).emit('player1', {name:game.player1.name});
                socket.emit('player2', { name: data.name, room: data.room });
                game.player2 = new Player(data.name, "j2", 'O')
            } else {
                socket.emit('err', { message: 'Sorry, The room is full!' });
            }
        }
        else {
            socket.emit('err', { message: 'La salle n\'existe pas'});
        }
    });

    socket.on('case_clicked', (data) => {
        var game = io.sockets.adapter.rooms[`room-${rooms}`].game;
        var  board = game.updateBoard(game.findPlayer(socket.player), data.buttonId);
        if(board.win !== undefined) {
            io.sockets.to(game.roomId).emit('update_board', {board: board.board});
            io.sockets.to(game.roomId).emit('gameEnd', {message: board.win});
        } else {
            io.sockets.to(game.roomId).emit('update_board', {board: board});
        }
    });

    socket.on('turnPlayed', (data) => {

    });
});
