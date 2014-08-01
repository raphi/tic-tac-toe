$(document).ready(function() {

    var api = new API();

    $('#start-game-btn').on('click', function() {
        api.start();
    });

    // Detect which row and column index was clicked and send the info to the server
    $('#board td').on('click', function(e) {
        var y = $(this).parent().children().index($(this));
        var x = $(this).parent().parent().children().index($(this).parent());

        api.move(x, y);
    });

});