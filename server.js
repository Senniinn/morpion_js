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
    console.log('link : http://10.8.0.2:3000');
});

io.on('connection', (socket) => {
    socket.broadcast.emit('new_message', {message : "Un nouveau joueur à rejoint le serveur", username : "Serveur"});
    console.log('New user connected');

    //default username
    socket.username = "Anonymous";
    socket.emit('chat', {chat:chat});

    //listen on new_message
    socket.on('new_message', (data) => {
        chat.unshift({username: socket.username, message:data.message});
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, username : socket.username, room : socket.playerRoom});
    });

    //listen on typing
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', {username : socket.username, room : socket.playerRoom})
    });

    socket.on('play', () => {
        socket.broadcast.emit('game', {game: cejeu})
    });
    socket.on('createGame', (data) => {
        console.log("new Game");
        socket.join(`room-${++rooms}`);
        socket.player = "j1";
        socket.playerRoom = `room-${rooms}`;
        var player1 = new Player(data.name, "j1", 'X');
        var game = new Game(`room-${rooms}`,player1);
        socket.username = player1.getPlayerUsername();
        io.sockets.adapter.rooms[`room-${rooms}`].game = game;
        socket.emit('newGame', { name: data.name, room: `room-${rooms}` });
    });
    // Connect the Player 2 to the room he requested. Show error if room full.
    socket.on('joinGame', (data) => {
        console.log("Connexion à la room : " + data.room);
        const room = io.nsps['/'].adapter.rooms[data.room];
        if (room) {
            if(room.length === 1) {
                var game = io.sockets.adapter.rooms[`${data.room}`].game;
                socket.join(data.room);
                socket.playerRoom = data.room;
                socket.player = "j2";
                socket.broadcast.to(data.room).emit('player1', {name:game.player1.username});
                socket.emit('player2', { name: data.name, room: data.room });
                game.player2 = new Player(data.name, "j2", 'O')
                socket.username = game.player2.getPlayerUsername();
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
        var playerTurn = game.findPlayer(socket.player).getCurrentTurn();
        if (playerTurn === false) {
            socket.emit('err', {message: "ce n'est pas votre tour"})
        }else {
            if (game.board[data.buttonId] !== '') {
                socket.emit('err', {message: "case deja cliqué"})
            }
            else {
                game.changeTurn();
                var board = game.updateBoard(game.findPlayer(socket.player).getPlayerType(), game.findPlayer(socket.player).getPLayerImg(),data.buttonId);
                if(board.win !== undefined) {
                    io.sockets.to(game.roomId).emit('update_board', {board: board.board});
                    io.sockets.to(game.roomId).emit('gameEnd', {message: board.win});
                } else {
                    io.sockets.to(game.roomId).emit('update_board', {board: board});
                    socket.broadcast.to(game.roomId).emit('change_turn');
                }
            }
        }
    });

    socket.on('turnPlayed', (data) => {

    });
    socket.on('leave_room', (data) => {
        socket.leave();
    });
});
