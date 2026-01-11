// Tennis match scoring system
let player1Score = 0;
let player2Score = 0;

function scorePoint(player) {
    if (player === 'player1') {
        player1Score++;
    } else {
        player2Score++;
    }

    updateScore();
    checkWinner();
}

function updateScore() {
    const scoreDisplay = document.getElementById('score');
    scoreDisplay.textContent = `${player1Score} - ${player2Score}`;

    // Add a little animation
    scoreDisplay.style.transform = 'scale(1.1)';
    setTimeout(() => {
        scoreDisplay.style.transform = 'scale(1)';
    }, 200);
}

function checkWinner() {
    const statusElement = document.getElementById('status');

    if (player1Score >= 11 && player1Score - player2Score >= 2) {
        statusElement.textContent = '🏆 Player 1 Wins!';
        statusElement.style.color = '#28a745';
    } else if (player2Score >= 11 && player2Score - player1Score >= 2) {
        statusElement.textContent = '🏆 Player 2 Wins!';
        statusElement.style.color = '#28a745';
    } else {
        statusElement.textContent = 'Match in progress...';
        statusElement.style.color = '#667eea';
    }
}

function resetMatch() {
    player1Score = 0;
    player2Score = 0;
    updateScore();

    const statusElement = document.getElementById('status');
    statusElement.textContent = 'Match reset! Ready to play.';
    statusElement.style.color = '#667eea';
}

// Display a welcome message when the page loads
window.addEventListener('DOMContentLoaded', () => {
    console.log('🎾 Winter Tennis Tournament Scheduler - Demo Loaded!');
    console.log('GitHub Pages hosting is working correctly.');

    // Add transition effect
    document.querySelector('.container').style.opacity = '0';
    document.querySelector('.container').style.transform = 'translateY(20px)';

    setTimeout(() => {
        document.querySelector('.container').style.transition = 'all 0.5s ease';
        document.querySelector('.container').style.opacity = '1';
        document.querySelector('.container').style.transform = 'translateY(0)';
    }, 100);
});
