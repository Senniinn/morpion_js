var Player = require('./js/Player.js');
var Game = require('./js/Game.js');
const express = require('express');
const app = express();

const chat = [];
let rooms = 0;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', { roomId: null })
});
app.get('/:roomId', (req, res) => {
    res.render('index', { roomId: req.params.roomId })
});

server = app.listen(3000);

const io = require("socket.io")(server);

io.clients((error, clients) => {
    if (error) throw error;
    console.log(clients);
    console.log('link : http://10.8.0.2:3000');
});


io.on('connection', (socket) => {
    socket.broadcast.emit('new_message', {message : "Un nouveau joueur à rejoint le serveur", username : "Serveur"});

    socket.username = "Anonymous";
    socket.playerRoom = "NIG";
    socket.emit('chat', {chat:chat});

    socket.on('new_message', (data) => {
        chat.unshift({username: socket.username, message:data.message});
        io.sockets.emit('new_message', {message : data.message, username : socket.username, room : socket.playerRoom});
    });

    socket.on('typing', () => {
        socket.broadcast.emit('typing', {username : socket.username, room : socket.playerRoom})
    });
    socket.on('join_or_create_game', (data) => {
        const room = io.nsps['/'].adapter.rooms[data.room];
        if (room) {
            if(room.length === 1) {
                const game = io.sockets.adapter.rooms[`${data.room}`].game;
                socket.join(data.room);
                socket.broadcast.to(data.room).emit('player1', {name:game.player1.username});
                socket.emit('player2', { name: data.name, room: data.room });
                game.player2 = new Player(data.name, "j2", 'O');
                socket.username = game.player2.getPlayerUsername();
                socket.playerRoom = data.room;
                socket.player = "j2";
                socket.emit('ask_username', {});
            } else {
                socket.emit('err', { message: 'Sorry, The room is full!' });
            }
        } else {
            const player1 = new Player(data.name, "j1", 'X');
            const roomId = data.room;
            socket.join(`${roomId}`);
            const game = new Game(`${roomId}`,player1);
            socket.username = player1.getPlayerUsername();
            socket.player = "j1";
            socket.playerRoom = `${roomId}`;
            io.sockets.adapter.rooms[`${roomId}`].game = game;
            socket.emit('newGame', { name: data.name, room: `${roomId}` });
            socket.emit('ask_username');
        }
    });
    socket.on('createGame', (data) => {
        const player1 = new Player(data.name, "j1", 'X');
        const roomId = ++rooms;
        socket.join(`room-${roomId}`);
        const game = new Game(`room-${roomId}`,player1);
        socket.username = player1.getPlayerUsername();
        socket.player = "j1";
        socket.playerRoom = `room-${roomId}`;
        io.sockets.adapter.rooms[`room-${roomId}`].game = game;
        socket.emit('newGame', { name: data.name, room: `room-${roomId}` });
    });

    socket.on('joinGame', (data) => {
        const room = io.nsps['/'].adapter.rooms[data.room];
        if (room) {
            if(room.length === 1) {
                const game = io.sockets.adapter.rooms[`${data.room}`].game;
                socket.join(data.room);
                socket.broadcast.to(data.room).emit('player1', {name:game.player1.username});
                socket.emit('player2', { name: data.name, room: data.room });
                game.player2 = new Player(data.name, "j2", 'O');
                socket.username = game.player2.getPlayerUsername();
                socket.playerRoom = data.room;
                socket.player = "j2";
            } else {
                socket.emit('err', { message: 'Sorry, The room is full!' });
            }
        } else {
            socket.emit('err', { message: 'La salle n\'existe pas'});
        }
    });

    socket.on('case_clicked', (data) => {
        var game = io.sockets.adapter.rooms[socket.playerRoom].game;
        if(game.player2) {
            var playerTurn = game.findPlayer(socket.player).getCurrentTurn();
            if (playerTurn === false) {
                socket.emit('err', {message: "ce n'est pas votre tour"})
            } else {
                if (game.board[data.buttonId] !== '') {
                    socket.emit('err', {message: "case deja cliqué"})
                }
                else {
                    var board = game.updateBoard(game.findPlayer(socket.player).getPlayerType(), game.findPlayer(socket.player).getPlayerImg(), data.buttonId);
                    if (board.win !== undefined) {
                        io.sockets.to(game.roomId).emit('update_board', {board: board.board});
                        io.sockets.to(game.roomId).emit('gameEnd', {message: board.win});
                    } else {
                        io.sockets.to(game.roomId).emit('update_board', {board: board});
                        socket.broadcast.to(game.roomId).emit('change_turn');
                    }
                    game.changeTurn();
                }
            }
        } else {
            socket.emit('err', {message: "ce n'est pas votre tour"})
        }
    });

    socket.on('turnPlayed', (data) => {

    });

    socket.on('change_username', (data) => {
        socket.username = data.username;
    });

    socket.on('leave_room', (data) => {
        socket.leave();
    });
});
