Tic-Tac-Toe
========================
Tic-Tac-Toe online project using Socket.IO for playing online and minimax algorithm with alpha-beta pruning for the AI.
More info about the AI algorith: http://en.wikipedia.org/wiki/Minimax#Minimax_algorithm_with_alternate_moves

Requirements
============
node
npm

Install
=======
$ cd tic-tac-toe/
$ npm install

Optional:
If you run the server on a remote server, edit file public/assets/js/api.js

Start the server
================
$ node app.js

Play the game
=============
Go to http://YOUR_SERVER_IP:8080/ and start a game

If only one player is connected, then you play against the AI.
If two players are connected at the same time, you play against each other.
If more than two players are connected, the extra players won't be able to play but they can see the current game.