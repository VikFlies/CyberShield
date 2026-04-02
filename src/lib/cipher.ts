// Logique de chiffrement César et Vigenère — CyberShield

export function cesarEncrypt(text: string, shift: number): string {
  let result = '';
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      result += String.fromCharCode(((code - 65 + shift) % 26) + 65);
    } else if (code >= 97 && code <= 122) {
      result += String.fromCharCode(((code - 97 + shift) % 26) + 97);
    } else {
      result += ch;
    }
  }
  return result;
}

export function cesarDecrypt(text: string, shift: number): string {
  return cesarEncrypt(text, 26 - (shift % 26));
}

export function cesarBruteForce(text: string): { shift: number; result: string }[] {
  const results: { shift: number; result: string }[] = [];
  for (let i = 1; i <= 25; i++) {
    results.push({ shift: i, result: cesarDecrypt(text, i) });
  }
  return results;
}

export function vigenereEncrypt(text: string, key: string): string {
  if (!key) return text;
  const keyUpper = key.toUpperCase();
  let result = '';
  let ki = 0;
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    const shift = keyUpper.charCodeAt(ki % keyUpper.length) - 65;
    if (code >= 65 && code <= 90) {
      result += String.fromCharCode(((code - 65 + shift) % 26) + 65);
      ki++;
    } else if (code >= 97 && code <= 122) {
      result += String.fromCharCode(((code - 97 + shift) % 26) + 97);
      ki++;
    } else {
      result += ch;
    }
  }
  return result;
}

export function vigenereDecrypt(text: string, key: string): string {
  if (!key) return text;
  const keyUpper = key.toUpperCase();
  let result = '';
  let ki = 0;
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    const shift = keyUpper.charCodeAt(ki % keyUpper.length) - 65;
    if (code >= 65 && code <= 90) {
      result += String.fromCharCode(((code - 65 + shift + 26) % 26) + 65);
      ki++;
    } else if (code >= 97 && code <= 122) {
      result += String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
      ki++;
    } else {
      result += ch;
    }
  }
  return result;
}
