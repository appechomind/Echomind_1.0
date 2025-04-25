# Mind Reader Implementations

## Main Implementation (mind_reader_main.html)
Located in: `tricks/mentalism/mind_reader.html`
Features:
- Modern UI with gold theme and fractal background
- Uses `../../scripts/mic_handler.js`
- Language selection support
- Debug panel
- Card flipping animations
- Proper navigation with back button
- Consistent with current design system

## Root Implementation (mind_reader_root.html)
Located in: `mind_reader.html`
Features:
- Basic UI with simpler styling
- Uses `scripts/mic_handler.js`
- Simple card display system
- Multiple image path fallbacks
- Triple tap reset
- Swipe up navigation

## Recommendation
The main implementation (`tricks/mentalism/mind_reader.html`) should be used as the primary version because:
1. It follows the current design system
2. Has better UI/UX features
3. Is properly organized in the tricks/mentalism directory
4. Has more robust functionality

The root implementation can be safely removed after verifying all links point to the main version. 