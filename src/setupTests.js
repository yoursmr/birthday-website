// Gives the test environment the browser features our code needs
// (the secret word lock uses Web Crypto and TextEncoder).
import { TextDecoder, TextEncoder } from 'util';
import { webcrypto } from 'crypto';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
Object.defineProperty(window, 'crypto', { value: webcrypto, configurable: true });
