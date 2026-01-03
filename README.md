# Bingo Master - Web Interface

🎱 A modern and elegant web-based graphical interface for the Bingo drum simulator.

![Deno](https://img.shields.io/badge/deno-v2.0-blue)
![License](https://img.shields.io/badge/license-GPLv3-green)

## ✨ Features

- 🎨 **Premium Interface**: Modern design with vibrant gradients and elegant dark theme
- ✨ **Smooth Animations**: Carefully crafted visual effects and micro-animations
- 📱 **100% Responsive**: Works perfectly on desktop, tablet, and mobile devices
- ⌨️ **Keyboard Shortcuts**: 
  - **Enter**: Start game from setup screen
  - **Space**: Draw next ball during game
- 🎉 **Special Effects**: Celebratory confetti when completing the game
- 🎲 **Rolling Animation**: Visual simulation when drawing each ball
- 🌐 **No Dependencies**: HTML5, CSS3, and vanilla JavaScript
- ⚡ **Deno Server**: Lightweight and efficient backend

## 🚀 Quick Start

### Prerequisites

- [Deno](https://deno.land/) v2.0 or higher

### Installation

Clone the repository:

```bash
git clone https://github.com/gdelgada/deno-bingo-web.git
cd deno-bingo-web
```

### Run in Development Mode

```bash
deno task dev
```

Then open your browser at: **http://localhost:8000**

**💡 Custom Port**: You can customize the port using the `SERVER_PORT` environment variable:

```bash
# Linux/Mac
SERVER_PORT=3000 deno task dev

# Windows (PowerShell)
$env:SERVER_PORT=3000; deno task dev

# Windows (CMD)
set SERVER_PORT=3000 && deno task dev
```

### Compile to Executable

To create a standalone executable with all files included:

```bash
deno task compile
```

The executable will be in `output/bingo-web` (or `bingo-web.exe` on Windows).

> **Note**: The executable includes all HTML, CSS, and JavaScript files. Simply run it and open your browser at http://localhost:8000

### 🐳 Run with Docker

Quick start with Docker:

```bash
# Development (build local)
docker-compose --profile dev up -d

# Production (from registry)
docker-compose --profile prod up -d
```

**💡 Helper Script**: Usa el script interactivo para gestión fácil:

```bash
./docker-helper.sh
```

For detailed instructions on using helper scripts, see [CONTAINER-HELPERS.md](CONTAINER-HELPERS.md).

### 🚀 CI/CD & Deployment

This project includes GitHub Actions workflows for:
- ✅ Automated testing and compilation
- 🐳 Docker image building
- 📦 Deployment to container registry

See [.github/CICD.md](.github/CICD.md) for detailed CI/CD configuration and deployment guides.

## 🎮 How to Play

1. **Setup**: Enter the number of balls (10-200)
2. **Start**: Click "Start Game" or press Enter
3. **Play**: Press "Draw Next Ball" or the Space key
4. **Enjoy**: Watch as balls are marked on the board
5. **Celebrate**: Complete the game and enjoy the confetti!

## 🛠️ Technology

- **Frontend**: HTML5, CSS3, vanilla JavaScript
- **Backend**: Deno with static HTTP server
- **Styles**: Modern CSS with CSS variables, gradients, and animations
- **No heavy frameworks** - lightweight and fast

## 📂 Project Structure

```
deno-bingo-web/
├── public/              # Static files
│   ├── index.html      # Main interface
│   ├── styles.css      # Premium styles
│   └── app.js          # Game logic
├── src/
│   └── server.ts       # Deno server
├── .env.example        # Environment variables template
├── deno.json           # Deno configuration
├── DESIGN.md           # Design documentation
└── README.md           # This documentation
```

## 🎨 Design

The design uses best practices in modern web design:

- **Color Scheme**: Vibrant gradients on an elegant dark background (#0a0e27)
- **Typography**: Outfit from Google Fonts for a modern look
- **Visual Effects**: 
  - Soft shadows and glassmorphism effects
  - Carefully crafted CSS animations
  - Animated background particles
  - Hover effects for better feedback
- **Responsive Design**: Adaptive layout from 320px onwards

For more design details, see [DESIGN.md](DESIGN.md).

## 🔧 Development

### Available Scripts

- `deno task dev` - Start development server
- `deno task dev-fmt` - Watch and format code
- `deno task fmt` - Format code
- `deno task lint` - Check code
- `deno task compile` - Compile to executable

### Making Changes

The server serves static files from the `public/` folder.
To make changes:

1. Edit files in `public/` (HTML, CSS, or JS)
2. Reload the browser
3. That's it! No compilation required

## 📱 Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile devices and tablets

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome. Please:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔗 Links

- CLI Repository: [deno-bingo-cli](https://github.com/gdelgada/deno-bingo-cli)
- Deno Documentation: [deno.land](https://deno.land/)

---

Made with ❤️ and Deno