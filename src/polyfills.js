// Polyfills for Node.js modules in the browser
import { Buffer } from 'buffer';

// Make Buffer available globally before any other modules load
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

if (typeof global !== 'undefined') {
  global.Buffer = Buffer;
}

console.log('Buffer polyfill loaded successfully:', typeof Buffer); 