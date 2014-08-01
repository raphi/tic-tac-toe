var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var TicTacToe = require('./AI.js');

var PORT = 8080

var tictactoe = null;
var playerO = null;
var	playerX = null;

// Serve static files
app.use(express.static(__dirname + "/public/"));

// Handle a client's connection
io.on('connection', function (socket) {
	console.log('new user connected: ' + socket.id);

	// Init server session
	initPlayers(socket);

	// User wants to start a game
	socket.on('start game', function (data) {
		// Set a new game
		tictactoe = new TicTacToe();

		// Init user session
		socket.emit('game', { event: 'init' });

		// Send start event to everyone
		io.sockets.emit('game', { event: 'start', message: 'Game is starting' });

		// Ask the X player to play
		socket.emit('game', { event: 'play', message: 'You can play!' });

		console.log('new party started');
	});

	// A user made a move
	socket.on('move', function (data) {
		console.log('player ' + socket.id);
		console.log(data);

		// Detect player's sign
		var sign = socket.id == playerO ? 'O' : 'X';

		// Check if the move is valid
		if (tictactoe.moveIsValid(data.x, data.y, sign)) {

			// Send to everyone the move made (including spectators)
			io.sockets.emit('game', { event: 'move', message: 'Player made his move', x: data.x, y: data.y, sign: sign });

			// Ask player to wait his turn
			socket.emit('game', { event: 'wait', message: 'Please wait your turn' });

			// Check if the game if finished
			if (!isGameTerminal()) {
				var opponent = socket.id == playerO ? playerX : playerO;

				// Human opponent
				if (opponent) {
					// Ask player to play his turn
					socket.to(opponent).emit('game', { event: 'play', message: 'You can play!' });
				} else {
					playAITurn(socket);
				}
			}
		} else {
			// Move is invalid. Ask player to play again
			socket.emit('game', { event: 'error', message: 'This move is not valid. Try again.' });
			console.log('invalid move');
			console.log(data);
		}
		
	});

	// Update player's state if a user disconnect or reload the page
	socket.on('disconnect', function () { 
		if (socket.id == playerO) {
			playerO = null;
		} else if (socket.id == playerX) {
			playerX = null;
		}
	});

});

// If the first player is alone, playerO will be the AI
// Else, if there are two players, the two first players will play against each other
// If there are more than 2 users, new users are spectators
function initPlayers(socket) {

	// Easy set playerO and playerX (first coming, first set)
	playerX = playerX ? playerX : socket.id;
	playerO = playerO ? playerO : (playerX == socket.id ? null : socket.id);

	console.log('pX: ' + playerX);
	if (playerO) {
		console.log('pO: ' + playerO);
	} else {
		console.log('pO: AI');
	}
}

// Check if there is a winner or a draw.
// If so, send an event to all users
function isGameTerminal() {
	if (tictactoe.isTerminal()) {
		var score = tictactoe.getScore();
		var message = '';

		switch(score) {
			case -1:
				message = 'O won!';
				if (!playerO)
					message = 'AI beat you!';
				break;
			case 0:
				message = 'This is a draw...';
				break;
			case 1:
				message = 'X won!';
				break;
		}

		console.log('game is finished');
		io.sockets.emit('game', { event: 'finish', message: message });

		return true;
	}
	return false;
}

// Use minimax algorithm for the AI player
function playAITurn(socket) {
	// AI player turn
	var aiBestMove = tictactoe.moveAI();
	console.log('AI player:');
	console.log(aiBestMove);

	io.sockets.emit('game', { event: 'move', message: 'AI made his move', x: aiBestMove.x, y: aiBestMove.y, sign: 'O' });
	
	if (!isGameTerminal()) {
		socket.emit('game', { event: 'play', message: 'You can play!' });
	}
}

// Start the server
server.listen(PORT);
console.log('TicTacToe server started on port ' + PORT);