# EchoMind 1.0 🔮

A modern web-based platform for interactive magic tricks and mentalism effects.

## Features

- 🎭 **Phone Effects**: Collection of interactive phone-based magic tricks
- 🎲 **Gizmo System**: Hardware integration for enhanced magical effects
  - Bluetooth and Serial connectivity
  - Secure random number generation
  - Interactive animations and sound effects
- 🧩 **Puzzles**: Interactive magical puzzles and challenges
- 👥 **Dual Device**: Synchronized effects across multiple devices
- 🤯 **Mind Peek**: Mentalism effects and demonstrations
- 🌟 **Modern UI**: Beautiful, responsive interface with fractal animations

## Getting Started

### Prerequisites

- Modern web browser with Web Bluetooth API support
- Optional: Compatible Gizmo hardware device
- Optional: Web Serial API support for alternative connectivity

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/echomind.git
cd echomind
```

2. Serve the files using a local web server (e.g., using Python):
```bash
python -m http.server 8000
```

3. Open `http://localhost:8000` in your web browser

### Hardware Setup (Optional)

For Gizmo functionality:
1. Ensure your device's Bluetooth is enabled
2. Click the "Connect Device" button in the Gizmo interface
3. Select your Gizmo device from the popup dialog
4. Follow the on-screen instructions for pairing

## Project Structure

```
echomind/
├── index.html          # Main entry point
├── manifest.json       # PWA manifest
├── tricks/            # Magic effects directory
│   ├── gizmo/         # Gizmo system files
│   │   ├── gizmo.js   # Core Gizmo functionality
│   │   ├── coin_flip.html
│   │   └── randomizer.html
│   ├── phone_effects/ # Phone-based effects
│   ├── mentalism/    # Mentalism effects
│   └── puzzles/      # Interactive puzzles
└── assets/           # Media assets
    └── sounds/       # Sound effects
```

## Development

### Adding New Effects

1. Create a new HTML file in the appropriate directory under `tricks/`
2. Use the existing templates and utilities
3. Link the new effect in the corresponding menu
4. Test thoroughly across different devices

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingEffect`)
3. Commit your changes (`git commit -m 'Add some AmazingEffect'`)
4. Push to the branch (`git push origin feature/AmazingEffect`)
5. Open a Pull Request

## Technical Details

- Uses Web Bluetooth API for hardware connectivity
- Implements Web Serial API as fallback
- Cryptographically secure random number generation
- Web Audio API for sound effects
- Modern ES6+ JavaScript
- Responsive CSS Grid layout
- Event-driven architecture

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all contributors and testers
- Special thanks to the magic community for inspiration
- Built with modern web technologies 