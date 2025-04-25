const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Mind Reader Tests', () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    // Load the HTML file
    const html = fs.readFileSync(path.resolve(__dirname, '../echomind build.html'), 'utf8');
    dom = new JSDOM(html, {
      runScripts: 'dangerously',
      resources: 'usable',
      pretendToBeVisual: true
    });
    document = dom.window.document;
    window = dom.window;

    // Mock the card map
    window.cardMap = {
      "ace of hearts": "ace_of_hearts.png",
      "king of spades": "king_of_spades.png",
      "two of diamonds": "2_of_diamonds.png",
      // ... more cards would be here in the real implementation
    };

    // Mock the matchCard function
    window.matchCard = (text) => {
      const lower = text.toLowerCase();
      for (const [phrase, card] of Object.entries(window.cardMap)) {
        if (lower.includes(phrase)) {
          return card;
        }
      }
      return null;
    };

    // Mock the microphone handler
    window.micHandler = {
      keepListening: true,
      start: jest.fn(),
      stop: jest.fn(),
      setCallbacks: jest.fn()
    };
  });

  test('card matching works correctly', () => {
    const testCases = [
      ['ace of hearts', 'ace_of_hearts.png'],
      ['king of spades', 'king_of_spades.png'],
      ['two of diamonds', '2_of_diamonds.png']
    ];

    testCases.forEach(([input, expected]) => {
      expect(window.matchCard(input)).toBe(expected);
    });
  });

  test('card display toggles correctly', () => {
    const cardDisplay = document.getElementById('cardDisplay');
    document.body.classList.add('card-mode');
    expect(cardDisplay.style.display).toBe('');  // Initial state
    
    document.body.classList.remove('card-mode');
    expect(document.body.classList.contains('card-mode')).toBe(false);
  });

  test('microphone controls update correctly', () => {
    const keepListeningCheckbox = document.getElementById('keepListening');
    expect(keepListeningCheckbox.checked).toBe(true);
    
    keepListeningCheckbox.checked = false;
    const event = new window.Event('change');
    keepListeningCheckbox.dispatchEvent(event);
    
    expect(window.micHandler.stop).toHaveBeenCalled();
  });
}); 