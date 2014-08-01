function Game() {
	this.board = $('#board');
};

Game.prototype = {
	// Reset/empty board cells
	init: function() {
		this.board.find('td').empty();
	},
	// Hides the start button
	start: function(data) {
		// This reset the board for spectators
		this.init();
		$('#start-game-btn').hide();
	},
	// Set a X or O in the correct board cell
	move: function(data) {
		this.board.find('tr').eq(data.x).find('td').eq(data.y).text(data.sign);
	},
	// Display the error message in the current banner
	error: function(data) {
		$('.alert-success').text(message).alert();
	},
	// Disable board while waiting opponent's move
	wait: function(data) {
		this.board.addClass('disabled');
	},
	// Enable board to let the user play
	play: function(data) {
		this.board.removeClass('disabled');
	},
	// Display a message at the top of the window
	banner: function(message) {
		$('.alert-success').text(message).alert();
	},
	// Show the start a game button
	finish: function(data) {
		$('#start-game-btn').show();
	}
};