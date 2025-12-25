// ==================== STATE MANAGEMENT ====================
const gameState = {
	drum: [],
	lastBall: null,
	drumSize: 90,
	isGameActive: false,
	theme: 'default',
	ws: null,
	roomId: null,
	isHost: false,
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
	welcomeScreen: document.getElementById('welcomeScreen'),
	joinScreen: document.getElementById('joinScreen'),
	setupScreen: document.getElementById('setupScreen'),
	gameScreen: document.getElementById('gameScreen'),

	// Buttons
	hostGameBtn: document.getElementById('hostGameBtn'),
	joinGameMenuBtn: document.getElementById('joinGameMenuBtn'),
	joinRoomBtn: document.getElementById('joinRoomBtn'),
	backToWelcomeBtn: document.getElementById('backToWelcomeBtn'),
	backFromSetupBtn: document.getElementById('backFromSetupBtn'),
	startGameBtn: document.getElementById('startGameBtn'),
	nextBallBtn: document.getElementById('nextBallBtn'),
	resetGameBtn: document.getElementById('resetGameBtn'),
	newGameBtn: document.getElementById('newGameBtn'),

	// Inputs
	languageSelect: document.getElementById('languageSelect'),
	gameThemeSelect: document.getElementById('gameTheme'),
	drumSizeInput: document.getElementById('drumSize'),
	roomCodeInput: document.getElementById('roomCodeInput'),

	// Displays
	board: document.getElementById('board'),
	latestBallNumber: document.getElementById('latestBallNumber'),
	calledCount: document.getElementById('calledCount'),
	remainingCount: document.getElementById('remainingCount'),
	totalCount: document.getElementById('totalCount'),
	progressFill: document.getElementById('progressFill'),
	progressText: document.getElementById('progressText'),
	gameOverOverlay: document.getElementById('gameOverOverlay'),
	roomCodeDisplay: document.getElementById('roomCodeDisplay'),
	currentRoomCode: document.getElementById('currentRoomCode'),
	controls: document.querySelector('.controls'),
};

// ==================== WEBSOCKET LOGIC ====================
function connectWebSocket() {
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const url = `${protocol}//${window.location.host}`;

	gameState.ws = new WebSocket(url);

	gameState.ws.onopen = () => {
		console.log('Connected to WebSocket');
		if (gameState.isHost) {
			gameState.ws.send(JSON.stringify({ type: 'CREATE_ROOM' }));
		} else {
			const code = elements.roomCodeInput.value.toUpperCase();
			gameState.ws.send(
				JSON.stringify({ type: 'JOIN_ROOM', roomId: code }),
			);
		}
	};

	gameState.ws.onmessage = (event) => {
		const data = JSON.parse(event.data);
		handleWebSocketMessage(data);
	};

	gameState.ws.onclose = () => {
		console.log('Disconnected from WebSocket');
		// Handle reconnection or show error?
	};
}

function handleWebSocketMessage(data) {
	switch (data.type) {
		case 'ROOM_CREATED':
			gameState.roomId = data.roomId;
			updateRoomCodeDisplay();
			break;
		case 'JOINED_ROOM':
			gameState.roomId = data.roomId;
			enterSpectatorMode();
			break;
		case 'GAME_UPDATE':
			updateGameStateFromHost(data.payload);
			break;
		case 'PLAYER_JOINED':
			// New player joined, send current state
			broadcastGameState();
			break;
		case 'HOST_DISCONNECTED':
			alert('Host disconnected');
			window.location.reload();
			break;
		case 'ERROR':
			alert(data.message);
			gameState.ws.close();
			break;
	}
}

function broadcastGameState() {
	if (
		gameState.ws && gameState.ws.readyState === WebSocket.OPEN &&
		gameState.isHost
	) {
		gameState.ws.send(JSON.stringify({
			type: 'GAME_UPDATE',
			payload: {
				drum: gameState.drum,
				lastBall: gameState.lastBall,
				drumSize: gameState.drumSize,
				isGameActive: gameState.isGameActive,
				theme: gameState.theme,
			},
		}));
	}
}

function updateGameStateFromHost(payload) {
	gameState.drum = payload.drum;
	gameState.lastBall = payload.lastBall;
	gameState.drumSize = payload.drumSize;
	gameState.isGameActive = payload.isGameActive;

	// If theme changed, update it
	if (gameState.theme !== payload.theme) {
		gameState.theme = payload.theme;
		document.body.setAttribute('data-theme', payload.theme);
	}

	renderBoard();
	updateStats();

	if (!payload.isGameActive && getFalsePositions(payload.drum).length === 0) {
		gameOver();
	}
}

function updateRoomCodeDisplay() {
	if (gameState.roomId) {
		elements.roomCodeDisplay.style.display = 'block';
		elements.currentRoomCode.textContent = gameState.roomId;
	} else {
		elements.roomCodeDisplay.style.display = 'none';
	}
}

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
		// If waiting for host (spectator mode and no ball yet)
		if (!gameState.isHost && gameState.drum.every((v) => !v)) {
			elements.latestBallNumber.innerHTML =
				'<span style="font-size: 1rem; opacity: 0.7;">...</span>';
		} else {
			elements.latestBallNumber.textContent = '--';
		}
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

// ==================== GAME FLOW LOGIC ====================
function showScreen(screenId) {
	['welcomeScreen', 'joinScreen', 'setupScreen', 'gameScreen'].forEach(
		(id) => {
			document.getElementById(id).style.display = 'none';
		},
	);
	document.getElementById(screenId).style.display = screenId === 'gameScreen'
		? 'block'
		: 'flex';
	if (screenId === 'gameScreen') {
		document.getElementById(screenId).style.display = 'block'; // Override flex
	}
}

function startGameHost() {
	const drumSize = parseInt(elements.drumSizeInput.value, 10);
	const selectedTheme = elements.gameThemeSelect.value; // Get theme from select

	if (isNaN(drumSize) || drumSize < 10 || drumSize > 200) {
		const errorMsg = i18n.currentLanguage === 'es'
			? 'Por favor, ingresa un número válido entre 10 y 200'
			: 'Please enter a valid number between 10 and 200';
		alert(errorMsg);
		return;
	}

	gameState.drumSize = drumSize;
	gameState.theme = selectedTheme;
	gameState.drum = createDrum(drumSize);
	gameState.lastBall = null;
	gameState.isGameActive = true;
	gameState.isHost = true;

	// Apply theme to body
	document.body.setAttribute('data-theme', selectedTheme);

	showScreen('gameScreen');
	elements.controls.style.display = 'flex'; // Show controls

	renderBoard();
	updateStats();

	connectWebSocket(); // Connect and create room
}

function enterSpectatorMode() {
	gameState.isHost = false;
	showScreen('gameScreen');
	elements.controls.style.display = 'none'; // Hide controls
	elements.roomCodeDisplay.style.display = 'none'; // Hide room code badge for spectator? Or show it?
	// Let's show it so they can verify they are in the right room, or share it too
	updateRoomCodeDisplay();

	// Initial empty render until update arrives
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
	const drawingText = i18n.t('drawNextBall');
	elements.nextBallBtn.innerHTML =
		`<span class="btn-icon">🎲</span> <span>${drawingText}...</span>`;

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

			// Broadcast update
			broadcastGameState();

			// Re-enable button
			elements.nextBallBtn.disabled = false;
			const drawText = i18n.t('drawNextBall');
			elements.nextBallBtn.innerHTML =
				`<span class="btn-icon">🎲</span> <span data-i18n="drawNextBall">${drawText}</span>`;

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
	if (gameState.isHost) {
		broadcastGameState();
	}
}

function resetGame() {
	// Only Host can reset properly to NEW GAME setup
	// But let's just reload for now, simpler
	if (gameState.ws) gameState.ws.close();
	window.location.reload();
}

// ==================== EVENT LISTENERS ====================
// Navigation
elements.hostGameBtn.addEventListener('click', () => showScreen('setupScreen'));
elements.joinGameMenuBtn.addEventListener(
	'click',
	() => showScreen('joinScreen'),
);
elements.backToWelcomeBtn.addEventListener(
	'click',
	() => showScreen('welcomeScreen'),
);
elements.backFromSetupBtn.addEventListener(
	'click',
	() => showScreen('welcomeScreen'),
);

// Actions
elements.startGameBtn.addEventListener('click', startGameHost);
elements.joinRoomBtn.addEventListener('click', () => {
	if (elements.roomCodeInput.value.length === 4) {
		gameState.isHost = false;
		connectWebSocket();
	}
});

elements.nextBallBtn.addEventListener('click', drawNextBall);
elements.resetGameBtn.addEventListener('click', resetGame);
elements.newGameBtn.addEventListener('click', resetGame);

// Language change handler
elements.languageSelect.addEventListener('change', (e) => {
	i18n.setLanguage(e.target.value);
});

// Allow Enter key to start/join
elements.drumSizeInput.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') startGameHost();
});
elements.roomCodeInput.addEventListener('keypress', (e) => {
	if (e.key === 'Enter' && elements.roomCodeInput.value.length === 4) {
		gameState.isHost = false;
		connectWebSocket();
	}
});

// Allow spacebar to draw next ball during game (HOST ONLY)
document.addEventListener('keydown', (e) => {
	if (
		gameState.isHost &&
		gameState.isGameActive && e.code === 'Space' &&
		!elements.nextBallBtn.disabled
	) {
		e.preventDefault();
		drawNextBall();
	}
});

// ==================== INITIALIZATION ====================
// Initialize i18n system
if (typeof i18n !== 'undefined') {
	i18n.init();
}

createParticles();
console.log('🎱 Bingo Master initialized!');
