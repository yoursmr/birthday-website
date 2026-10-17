// Browser side decryption helper.
//
// How it works in simple words:
// 1. The secret text (letter, promise) is locked with a password on YOUR computer
//    using scripts/encrypt.mjs. Only the locked (scrambled) text is saved in GitHub.
// 2. When she types the password, this file turns the password into a key
//    (PBKDF2, slowed down on purpose so guessing is hard) and tries to unlock the text (AES-GCM).
// 3. A wrong password cannot unlock it. The password itself is never stored anywhere.

const ITERATIONS = 250000;

const fromBase64 = (b64) =>
  Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

async function makeKey(password, salt) {
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
}

// Returns the secret text, or null if the password is wrong.
export async function decryptText(lockedBox, password) {
  try {
    const key = await makeKey(password.trim().toLowerCase(), fromBase64(lockedBox.salt));
    const plain = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromBase64(lockedBox.iv) },
      key,
      fromBase64(lockedBox.data)
    );
    return new TextDecoder().decode(plain);
  } catch (e) {
    return null;
  }
}
