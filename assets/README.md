# Assets Directory

This directory contains all media assets for the EchoMind project.

## Structure

```
assets/
├── icons/     # App icons and favicons
├── images/    # Images used throughout the app
└── sounds/    # Sound effects and audio files
```

## Requirements

### Icons
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)
- Must be optimized PNG format
- Used for PWA installation and app icons

### Images
- Card images for tricks
- UI elements and backgrounds
- All images should be optimized for web
- Prefer WebP format for better compression
- Include fallback PNG/JPG where needed

### Sounds
Required sound effects:
- `coin.mp3` - Coin flip sound (duration: ~1s)
- `success.mp3` - Success chime (duration: ~0.5s)
- `error.mp3` - Error tone (duration: ~0.3s)
- All audio should be:
  - MP3 format
  - 44.1kHz sample rate
  - 128-192kbps bitrate
  - Mono channel for effects 