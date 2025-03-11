$(document).ready(function () {
    let matrix = [];
    let score = 0;
    let highScore = 0; // Điểm cao nhất của người chơi
    let username = ''; // Tên người dùng

    // Hiển thị màn hình nhập tên người dùng
    $('#playGame').click(function () {
        $('.menu-screen').hide();
        $('.username-container').show(); // Hiển thị form nhập tên người dùng
    });

    // Bắt đầu game sau khi nhập tên người dùng
    $('#startGame').click(function () {
        username = $('#username').val().trim();
        if (!username) {
            alert('Vui lòng nhập tên người chơi!');
            return;
        }

        $('.username-container').hide();
        $('.game-container').show();
        startNewGame(); // Bắt đầu trò chơi mới
    });

    // Khởi tạo trò chơi mới
    function startNewGame() {
        $.ajax({
            url: '/new_game',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username: username }), // Gửi tên người chơi đến server
            success: function (data) {
                matrix = data.matrix;
                score = data.score;
                highScore = data.high_score; // Lấy điểm cao nhất từ server
                render();
                $('#highScore').text('Best: ' + highScore);
                $('#gameOverMessage').hide();
            }
        });
    }

    // Hiển thị và cập nhật bảng điểm và các ô trong game
    function render() {
        $('#board').empty();
        matrix.forEach(row => {
            row.forEach(value => {
                const tile = $('<div class="tile"></div>');
                tile.text(value ? value : '');
                if (value) {
                    tile.addClass('tile-' + value);
                }
                $('#board').append(tile);
            });
        });
        $('#score').text('Score: ' + score);
    }

    // Lắng nghe sự kiện phím mũi tên để di chuyển các ô
    $(document).keydown(function (e) {
        switch (e.which) {
            case 37: // Mũi tên trái
                move('left');
                break;
            case 38: // Mũi tên lên
                move('up');
                break;
            case 39: // Mũi tên phải
                move('right');
                break;
            case 40: // Mũi tên xuống
                move('down');
                break;
            default:
                return; // Không làm gì nếu người dùng nhấn phím khác
        }
        e.preventDefault();
    });

    // Hàm di chuyển
    function move(direction) {
        $.get('/move/' + direction, function (data) {
            matrix = data.matrix;
            score = data.score;
            if (data.status === 'win') {
                handleGameWin(score);
            } else if (data.status === 'gameover') {
                handleGameOver(score);
            } else {
                render();
            }
        });
    }

    // Quay lại menu chính khi nhấn nút "Back"
    $('#backToMenu').click(function () {
        $('.game-container').hide();
        $('.menu-screen').show();
    });

    // Chuyển đến bảng xếp hạng
    $('#rank').click(function () {
        window.location.href = '/rank';
    });

    // Xử lý khi người chơi thắng
    function handleGameWin(score) {
        alert("Chúc mừng! Bạn đã thắng với điểm số: " + score);
    }

    // Xử lý khi người chơi thua
    function handleGameOver(score) {
        $('#finalScore').text(score);
        $('#gameOverMessage').show();
        $('.game-container').hide();
    }

    // Khi bấm "Replay", bắt đầu lại trò chơi
    $('#replayButton').click(function () {
        $('#gameOverMessage').hide();
        startNewGame();
    });

    // Khi bấm "New Game", bắt đầu trò chơi mới
    $('#newGame').click(function () {
        startNewGame();
    });
});
