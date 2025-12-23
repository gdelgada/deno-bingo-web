// ==================== STATE MANAGEMENT ====================
const gameState = {
	drum: [],
	lastBall: null,
	drumSize: 90,
	isGameActive: false,
};

// ==================== DRUM LOGIC (Mirroring drum.ts) ====================
function createDrum(length) {
	return new Array(length).fill(false);
}

function hitDrum(drum, index) {
	const newDrum = [...drum];
	newDrum[index] = true;
	return newDrum;
}

function getFalsePositions(drum) {
	const positions = [];
	for (let i = 0; i < drum.length; i++) {
		if (!drum[i]) {
			positions.push(i);
		}
	}
	return positions;
}

function getRandomIndex(array) {
	return Math.floor(Math.random() * array.length);
}

// ==================== UI ELEMENTS ====================
const elements = {
	setupScreen: document.getElementById('setupScreen'),
	gameScreen: document.getElementById('gameScreen'),
	drumSizeInput: document.getElementById('drumSize'),
	startGameBtn: document.getElementById('startGameBtn'),
	board: document.getElementById('board'),
	latestBallNumber: document.getElementById('latestBallNumber'),
	calledCount: document.getElementById('calledCount'),
	remainingCount: document.getElementById('remainingCount'),
	totalCount: document.getElementById('totalCount'),
	progressFill: document.getElementById('progressFill'),
	progressText: document.getElementById('progressText'),
	nextBallBtn: document.getElementById('nextBallBtn'),
	resetGameBtn: document.getElementById('resetGameBtn'),
	gameOverOverlay: document.getElementById('gameOverOverlay'),
	newGameBtn: document.getElementById('newGameBtn'),
};

// ==================== PARTICLE ANIMATION ====================
function createParticles() {
	const particlesContainer = document.getElementById('particles');
	const particleCount = 30;

	for (let i = 0; i < particleCount; i++) {
		const particle = document.createElement('div');
		particle.className = 'particle';
		particle.style.left = `${Math.random() * 100}%`;
		particle.style.top = `${Math.random() * 100}%`;
		particle.style.animationDelay = `${Math.random() * 20}s`;
		particle.style.animationDuration = `${15 + Math.random() * 10}s`;
		particlesContainer.appendChild(particle);
	}
}

// ==================== BOARD RENDERING ====================
function renderBoard() {
	elements.board.innerHTML = '';

	gameState.drum.forEach((isCalled, index) => {
		const ball = document.createElement('div');
		ball.className = 'ball';
		ball.textContent = index + 1;

		if (isCalled) {
			ball.classList.add('called');
			if (index + 1 === gameState.lastBall) {
				ball.classList.add('latest');
			}
		} else {
			ball.classList.add('uncalled');
		}

		elements.board.appendChild(ball);
	});
}

// ==================== STATS UPDATE ====================
function updateStats() {
	const called = gameState.drum.filter((v) => v).length;
	const remaining = gameState.drum.filter((v) => !v).length;
	const percentage = Math.round((called / gameState.drumSize) * 100);

	elements.calledCount.textContent = called;
	elements.remainingCount.textContent = remaining;
	elements.totalCount.textContent = gameState.drumSize;
	elements.progressFill.style.width = `${percentage}%`;
	elements.progressText.textContent = `${percentage}%`;

	// Update latest ball display
	if (gameState.lastBall !== null) {
		elements.latestBallNumber.textContent = gameState.lastBall;
	} else {
		elements.latestBallNumber.textContent = '--';
	}
}

// ==================== CONFETTI EFFECT ====================
function triggerConfetti() {
	// Simple confetti effect using particles
	for (let i = 0; i < 50; i++) {
		const confetti = document.createElement('div');
		confetti.className = 'confetti-piece';
		confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: hsl(${Math.random() * 360}, 70%, 60%);
            top: 50%;
            left: 50%;
            z-index: 2000;
            pointer-events: none;
            border-radius: 50%;
        `;
		document.body.appendChild(confetti);

		const angle = Math.random() * Math.PI * 2;
		const velocity = 200 + Math.random() * 200;
		const vx = Math.cos(angle) * velocity;
		const vy = Math.sin(angle) * velocity - 200;

		confetti.animate([
			{
				transform: 'translate(0, 0) rotate(0deg)',
				opacity: 1,
			},
			{
				transform: `translate(${vx}px, ${vy + 500}px) rotate(${
					Math.random() * 720
				}deg)`,
				opacity: 0,
			},
		], {
			duration: 2000,
			easing: 'cubic-bezier(0, 0.5, 0.5, 1)',
		}).onfinish = () => confetti.remove();
	}
}

// ==================== GAME LOGIC ====================
function startGame() {
	const drumSize = parseInt(elements.drumSizeInput.value, 10);

	if (isNaN(drumSize) || drumSize < 10 || drumSize > 200) {
		alert('Please enter a valid number between 10 and 200');
		return;
	}

	gameState.drumSize = drumSize;
	gameState.drum = createDrum(drumSize);
	gameState.lastBall = null;
	gameState.isGameActive = true;

	// Switch screens with animation
	elements.setupScreen.style.display = 'none';
	elements.gameScreen.style.display = 'block';

	renderBoard();
	updateStats();
}

function drawNextBall() {
	if (!gameState.isGameActive) return;

	const falsePositions = getFalsePositions(gameState.drum);

	if (falsePositions.length === 0) {
		gameOver();
		return;
	}

	// Disable button during animation
	elements.nextBallBtn.disabled = true;
	elements.nextBallBtn.textContent = '🎲 Drawing...';

	// Simulate rolling animation
	let rollCount = 0;
	const rollInterval = setInterval(() => {
		const randomNum = Math.floor(Math.random() * gameState.drumSize) + 1;
		elements.latestBallNumber.textContent = randomNum;
		rollCount++;

		if (rollCount >= 10) {
			clearInterval(rollInterval);

			// Draw the actual ball
			const randomIndex = getRandomIndex(falsePositions);
			const actualIndex = falsePositions[randomIndex];

			gameState.drum = hitDrum(gameState.drum, actualIndex);
			gameState.lastBall = actualIndex + 1;

			// Update UI
			renderBoard();
			updateStats();

			// Re-enable button
			elements.nextBallBtn.disabled = false;
			elements.nextBallBtn.innerHTML =
				'<span class="btn-icon">🎲</span> Draw Next Ball';

			// Check if game is over
			if (getFalsePositions(gameState.drum).length === 0) {
				setTimeout(gameOver, 500);
			}
		}
	}, 100);
}

function gameOver() {
	gameState.isGameActive = false;
	elements.gameOverOverlay.style.display = 'flex';
	triggerConfetti();
}

function resetGame() {
	gameState.isGameActive = false;
	elements.gameScreen.style.display = 'none';
	elements.setupScreen.style.display = 'block';
	elements.gameOverOverlay.style.display = 'none';
}

// ==================== EVENT LISTENERS ====================
elements.startGameBtn.addEventListener('click', startGame);
elements.nextBallBtn.addEventListener('click', drawNextBall);
elements.resetGameBtn.addEventListener('click', resetGame);
elements.newGameBtn.addEventListener('click', resetGame);

// Allow Enter key to start game from setup screen
elements.drumSizeInput.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') {
		startGame();
	}
});

// Allow spacebar to draw next ball during game
document.addEventListener('keydown', (e) => {
	if (
		gameState.isGameActive && e.code === 'Space' &&
		!elements.nextBallBtn.disabled
	) {
		e.preventDefault();
		drawNextBall();
	}
});

// ==================== INITIALIZATION ====================
createParticles();
console.log('🎱 Bingo Master initialized!');
