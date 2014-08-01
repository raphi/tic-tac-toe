// Communicate with the server
function API() {
	// Game object implementation to interact with current DOM
	var game = new Game();

	// Establish websocket connection with server
	this.socket = io.connect(SERVER_HOST + ':' + SERVER_PORT);

	// Receive and execute game events/instructions from server's game channel
	this.socket.on('game', function (data) {
		if (data.message) {
			// Display server's message
			game.banner(data.message);
		}
		// Invoke game's function triggered by the server
		game[data.event](data);
	});

	// Ask server to start a new game
	this.start = function() {
		this.socket.emit('start game');
	};

	// Ask server to set up position in (x, y)
	this.move = function(x, y) {
		// Making sure it's this player's turn
		if (!game.board.hasClass('disabled')) {
			this.socket.emit('move', { x: x, y: y });
		}
	};

};