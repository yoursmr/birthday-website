// Run this on YOUR computer only. It locks a text file with a secret password.
//
// Usage:
//   node scripts/encrypt.mjs path/to/secret-text.txt
//
// It asks for the password (what you type is hidden), then prints a small
// block of scrambled text. Paste that block into your code. Never commit the
// original text file or the password.

import { readFileSync } from 'node:fs';
import { webcrypto as crypto } from 'node:crypto';
import readline from 'node:readline';

const ITERATIONS = 250000; // must match src/lib/crypto.js

const file = process.argv[2];
if (!file) {
  console.error('Please give the text file to lock. Example: node scripts/encrypt.mjs letter.txt');
  process.exit(1);
}

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => {
      if (s.includes(question)) rl.output.write(s);
    };
    rl.question(question, (answer) => {
      rl.output.write('\n');
      rl.close();
      resolve(answer);
    });
  });
}

const toBase64 = (bytes) => Buffer.from(bytes).toString('base64');

const text = readFileSync(file, 'utf8').trim();
const password = (await askHidden('Secret password: ')).trim().toLowerCase();
const again = (await askHidden('Type it again: ')).trim().toLowerCase();

if (!password || password !== again) {
  console.error('Passwords are empty or do not match. Nothing was created.');
  process.exit(1);
}

const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const baseKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
const key = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
  baseKey,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt']
);
const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(text));

console.log('\nPaste this into your code:\n');
console.log(JSON.stringify({ salt: toBase64(salt), iv: toBase64(iv), data: toBase64(new Uint8Array(data)) }, null, 2));
