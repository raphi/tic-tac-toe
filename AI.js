function TicTacToe() {

	this.board = new Array();

	for (var i = 0; i < 3; i++) {
		this.board[i] = new Array();
		for (var j = 0; j < 3; j++) {
			this.board[i][j] = '-';
		}
	}

};

// Get this instance board
TicTacToe.prototype.getBoard = function() {
	return this.board;
};

// Check if the move is valid
TicTacToe.prototype.moveIsValid = function(i, j, sign) {
	if (!(0 <= i && i <= 2 && 0 <= j && j <= 2) ||
		this.board[i][j] != '-') {
		return false;
	}

	this.board[i][j] = sign.toLowerCase();
	
	return true;
};

// Play AI's turn using minimax algorythm
TicTacToe.prototype.moveAI = function() {
	var bestMove = alphaBeta(this);
	
	this.board[bestMove[0]][bestMove[1]] = 'o';

	return { x: bestMove[0], y: bestMove[1] };
};

// Get all player's possible moves
TicTacToe.prototype.getMoves = function(player) {

	var moves = new Array();

	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			if (this.board[i][j] == '-') {
				moves.push([i, j]);
			}
		}
	}

	return moves;
};

// Check if game is finished
TicTacToe.prototype.isTerminal = function() {

	var noSpaces = true;

	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			if (this.board[i][j] == '-') {
				noSpaces = false;
			}
		}
	}

	return noSpaces || this.getScore() != 0;
};

// Returns -1: X won
// Returns 0 : draw
// Returns 1 : O won
TicTacToe.prototype.getScore = function() {

	var lines = new Array();
	var board = this.board;
	
	lines.push(board[0]);
	lines.push(board[1]);
	lines.push(board[2]);
	lines.push([board[0][0],board[1][0],board[2][0]]);
	lines.push([board[0][1],board[1][1],board[2][1]]);
	lines.push([board[0][2],board[1][2],board[2][2]]);
	lines.push([board[0][0],board[1][1],board[2][2]]);
	lines.push([board[2][0],board[1][1],board[0][2]]);

	for (var i = 0; i < lines.length; i++) {
		if (lines[i][0] == lines[i][1] &&
			lines[i][1] == lines[i][2] &&
			lines[i][0] == 'x') {
			return 1;
		}
		if (lines[i][0] == lines[i][1] &&
			lines[i][1] == lines[i][2] &&
			lines[i][0] == 'o') {
			return -1;
		}
	}

	return 0;
};

// Get the next board move creating a fake board
TicTacToe.prototype.getNext = function(move, player) {
	if (player == "max") {
		player = 'x';
	} else {
		player = 'o';
	}

	var nextState = new TicTacToe();

	nextState.board = copyBoard(this.board);
	nextState.board[move[0]][move[1]] = player;

	return nextState;
};

function alphaBeta(state) {
	return minValue(state, -100000, 100000, true);
};

function maxValue(state, alpha, beta, isFirst) {

	var isFirst = isFirst || false;

	if (state.isTerminal()) {
		return state.getScore();
	}

	var v = -100000, moves = state.getMoves("max"), min, bestMove = moves[0];

	for (var i = 0; i < moves.length; i++) {
		min = minValue(state.getNext(moves[i], "max"), alpha, beta, false);
		if (min > v) {
			v = min;
			bestMove = moves[i];
		}
		if (v >= beta) {
			if (isFirst)
				return moves[i];
			return v;
		}
		if (v > alpha)
			alpha = v;
	}

	if (isFirst) {
		return bestMove;
	} else {
		return v;
	}

};

function minValue(state, alpha, beta, isFirst) {

	var isFirst = isFirst || false;

	if (state.isTerminal()) {
		return state.getScore();
	}

	var v = 100000, moves = state.getMoves("min"), max, bestMove = moves[0];

	for (var i = 0; i < moves.length; i++) {
		max = maxValue(state.getNext(moves[i], "min"), alpha, beta, false);
		if (max < v) v = max, bestMove = moves[i];
		if (v <= alpha) {
			if (isFirst)
				return moves[i];
			return v;
		}
		if (v < beta)
			beta = v;
	}

	if (isFirst) {
		return bestMove;
	} else {
		return v;
	}

};

// Creates a copy of the current board state
function copyBoard(board) {
	var newBoard = Array();
	for (var i = 0; i < board.length; i++) {
		newBoard[i] = board[i].slice(0);
	}
	return newBoard;
};

// Made the Object public
module.exports = TicTacToe;