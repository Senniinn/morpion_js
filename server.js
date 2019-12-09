// server.js

var express = require('express');

var app = express();

var PORT = 3000;

app.get('/', function(req, res) {
    res.status(200).send('Hello world');
});

app.get('/:message', function (req, res) {
    res.status(200).send(req.params.message);
});

app.listen(PORT, function() {
    console.log('Server is running on PORT:',PORT);
});