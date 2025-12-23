// i18n.js - Internationalization Module
const translations = {
	en: {
		// Header
		title: 'BINGO MASTER',
		subtitle: 'Professional Drum Simulator',

		// Setup Screen
		setupTitle: 'Setup New Game',
		languageLabel: 'Language',
		gameThemeLabel: 'Game Theme',
		defaultTheme: '🎱 Default Theme',
		christmasTheme: '🎄 Christmas Theme',
		summerTheme: '🏖️ Summer Theme',
		themeHint: 'Choose your favorite theme',
		numberOfBallsLabel: 'Number of Balls',
		ballsHint: 'Choose between 10 and 200 balls',
		startGame: 'Start Game',

		// Game Screen - Stats
		called: 'Called',
		remaining: 'Remaining',
		total: 'Total',

		// Game Screen - Latest Ball
		latestBall: 'Latest Ball',

		// Game Screen - Board
		numberBoard: 'Number Board',

		// Game Screen - Controls
		drawNextBall: 'Draw Next Ball',
		newGame: 'New Game',

		// Game Over
		gameCompleted: '🎉 Game Completed! 🎉',
		allBallsCalled: 'All balls have been called',
		playAgain: 'Play Again',

		// Meta
		metaDescription: 'Bingo Master - A modern bingo drum simulator',
		pageTitle: 'Bingo Master - Drum Simulator',
	},
	es: {
		// Header
		title: 'BINGO MASTER',
		subtitle: 'Simulador Profesional de Bombo',

		// Setup Screen
		setupTitle: 'Configurar Nueva Partida',
		languageLabel: 'Idioma',
		gameThemeLabel: 'Tema del Juego',
		defaultTheme: '🎱 Tema por Defecto',
		christmasTheme: '🎄 Tema Navideño',
		summerTheme: '🏖️ Tema Veraniego',
		themeHint: 'Elige tu tema favorito',
		numberOfBallsLabel: 'Número de Bolas',
		ballsHint: 'Elige entre 10 y 200 bolas',
		startGame: 'Comenzar Juego',

		// Game Screen - Stats
		called: 'Cantadas',
		remaining: 'Restantes',
		total: 'Total',

		// Game Screen - Latest Ball
		latestBall: 'Última Bola',

		// Game Screen - Board
		numberBoard: 'Tablero de Números',

		// Game Screen - Controls
		drawNextBall: 'Sacar Siguiente Bola',
		newGame: 'Nueva Partida',

		// Game Over
		gameCompleted: '🎉 ¡Partida Completada! 🎉',
		allBallsCalled: 'Todas las bolas han sido cantadas',
		playAgain: 'Jugar de Nuevo',

		// Meta
		metaDescription:
			'Bingo Master - Un simulador moderno de bombo de bingo',
		pageTitle: 'Bingo Master - Simulador de Bombo',
	},
};

// i18n Manager
const i18n = {
	currentLanguage: 'en',

	init() {
		// Load saved language from localStorage or detect browser language
		const savedLang = localStorage.getItem('bingoLanguage');
		const browserLang = navigator.language.split('-')[0]; // Get 'en' from 'en-US'

		if (savedLang && (savedLang === 'en' || savedLang === 'es')) {
			this.currentLanguage = savedLang;
		} else if (browserLang === 'es') {
			this.currentLanguage = 'es';
		} else {
			this.currentLanguage = 'en';
		}

		this.updateLanguage(this.currentLanguage);
	},

	setLanguage(lang) {
		if (lang === 'en' || lang === 'es') {
			this.currentLanguage = lang;
			localStorage.setItem('bingoLanguage', lang);
			this.updateLanguage(lang);
		}
	},

	t(key) {
		return translations[this.currentLanguage][key] || key;
	},

	updateLanguage(lang) {
		this.currentLanguage = lang;

		// Update HTML lang attribute
		document.documentElement.lang = lang;

		// Update meta tags
		document.querySelector('meta[name="description"]').content = this.t(
			'metaDescription',
		);
		document.title = this.t('pageTitle');

		// Update all elements with data-i18n attribute
		document.querySelectorAll('[data-i18n]').forEach((element) => {
			const key = element.getAttribute('data-i18n');
			const text = this.t(key);

			// Check if the element is an input or has a placeholder
			if (element.hasAttribute('data-i18n-placeholder')) {
				element.placeholder = text;
			} else if (
				element.tagName === 'INPUT' || element.tagName === 'TEXTAREA'
			) {
				element.value = text;
			} else {
				// For elements with icons/emojis, preserve them
				const icon = element.querySelector('.btn-icon, .title-icon');
				if (icon) {
					element.innerHTML = '';
					element.appendChild(icon.cloneNode(true));
					const textNode = document.createTextNode(text);
					element.appendChild(textNode);
				} else {
					element.textContent = text;
				}
			}
		});

		// Update language selector
		const langSelect = document.getElementById('languageSelect');
		if (langSelect) {
			langSelect.value = lang;
		}
	},
};

// Export for use in other scripts
if (typeof globalThis !== 'undefined') {
	globalThis.i18n = i18n;
}
