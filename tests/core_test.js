// Core functionality tests for EchoMind
const tests = {
  // Test 1: Verify required files exist
  async checkCoreFiles() {
    const requiredFiles = [
      'index.html',
      'scripts/main.js',
      'scripts/fractal.js',
      'manifest.json',
      'service-worker.js'
    ];
    
    for (const file of requiredFiles) {
      try {
        const response = await fetch(file);
        if (!response.ok) {
          console.error(`❌ Missing core file: ${file}`);
          return false;
        }
      } catch (err) {
        console.error(`❌ Error accessing ${file}:`, err);
        return false;
      }
    }
    console.log('✅ All core files present');
    return true;
  },

  // Test 2: Verify main navigation links
  async checkNavigation() {
    const navLinks = [
      'tricks/mentalism.html',
      'tricks/mind_peek.html',
      'tricks/dual_device.html',
      'tricks/phone_effects.html',
      'tricks/puzzles.html',
      'tricks/community.html',
      'tricks/gizmo.html',
      'tricks/settings.html',
      'tricks/dont_click.html'
    ];

    for (const link of navLinks) {
      try {
        const response = await fetch(link);
        if (!response.ok) {
          console.error(`❌ Broken navigation link: ${link}`);
          return false;
        }
      } catch (err) {
        console.error(`❌ Error accessing ${link}:`, err);
        return false;
      }
    }
    console.log('✅ All navigation links working');
    return true;
  },

  // Test 3: Check script loading
  async checkScriptLoading() {
    try {
      // Check if EchoMind namespace exists
      if (typeof window.EchoMind === 'undefined') {
        console.error('❌ EchoMind namespace not initialized');
        return false;
      }

      // Check core functions
      const requiredFunctions = [
        'FractalBackground',
        'addTouchFeedback'
      ];

      for (const func of requiredFunctions) {
        if (typeof window.EchoMind[func] === 'undefined') {
          console.error(`❌ Missing core function: ${func}`);
          return false;
        }
      }
      
      console.log('✅ All core scripts loaded');
      return true;
    } catch (err) {
      console.error('❌ Error checking script loading:', err);
      return false;
    }
  }
};

// Run tests
async function runTests() {
  console.log('🔍 Starting core functionality tests...\n');
  
  const results = [];
  for (const [name, test] of Object.entries(tests)) {
    console.log(`Running test: ${name}`);
    results.push(await test());
    console.log('-------------------\n');
  }

  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`Test Summary: ${passed}/${total} tests passed`);
  if (passed === total) {
    console.log('✅ All core tests passed!');
  } else {
    console.log('❌ Some tests failed. Please check the logs above.');
  }
}

// Auto-run tests when loaded
if (typeof window !== 'undefined') {
  window.addEventListener('load', runTests);
} 