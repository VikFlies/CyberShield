// Logique d'analyse de mot de passe — CyberShield

// Liste noire de 20 mots de passe courants
const BLACKLIST = [
  'password', '123456', '123456789', 'qwerty', 'abc123',
  'monkey', '1234567', 'letmein', 'trustno1', 'dragon',
  'baseball', 'iloveyou', 'master', 'sunshine', 'ashley',
  'football', 'shadow', 'passw0rd', 'admin', 'welcome'
];

export interface PasswordResult {
  score: number;
  level: string;
  levelColor: string;
  criteria: { label: string; met: boolean }[];
  suggestions: string[];
  entropy: number;
}

export function analyzePassword(password: string): PasswordResult {
  let score = 0;
  const criteria: { label: string; met: boolean }[] = [];
  const suggestions: string[] = [];

  // Longueur > 8
  const extraChars = Math.max(0, password.length - 8);
  score += extraChars * 2;
  criteria.push({ label: `Longueur > 8 caractères (${password.length})`, met: password.length > 8 });
  if (password.length <= 8) suggestions.push('Utilisez au moins 9 caractères');

  // Majuscule
  let hasUpper = false;
  for (const ch of password) {
    if (ch >= 'A' && ch <= 'Z') { hasUpper = true; break; }
  }
  if (hasUpper) score += 15;
  criteria.push({ label: 'Contient une majuscule', met: hasUpper });
  if (!hasUpper) suggestions.push('Ajoutez au moins une lettre majuscule');

  // Chiffre
  let hasDigit = false;
  for (const ch of password) {
    if (ch >= '0' && ch <= '9') { hasDigit = true; break; }
  }
  if (hasDigit) score += 15;
  criteria.push({ label: 'Contient un chiffre', met: hasDigit });
  if (!hasDigit) suggestions.push('Ajoutez au moins un chiffre');

  // Symbole
  let hasSymbol = false;
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
  for (const ch of password) {
    if (symbols.includes(ch)) { hasSymbol = true; break; }
  }
  if (hasSymbol) score += 20;
  criteria.push({ label: 'Contient un symbole spécial', met: hasSymbol });
  if (!hasSymbol) suggestions.push('Ajoutez un caractère spécial (!@#$%...)');

  // Liste noire
  const notBlacklisted = !BLACKLIST.includes(password.toLowerCase());
  if (notBlacklisted) score += 20;
  criteria.push({ label: 'N\'est pas un mot de passe courant', met: notBlacklisted });
  if (!notBlacklisted) suggestions.push('Ce mot de passe est trop commun, choisissez-en un autre');

  // Score max = 100
  score = Math.min(100, score);

  // Niveau
  let level = 'Faible';
  let levelColor = 'destructive';
  if (score >= 80) { level = 'Très fort'; levelColor = 'success'; }
  else if (score >= 60) { level = 'Fort'; levelColor = 'accent'; }
  else if (score >= 35) { level = 'Moyen'; levelColor = 'warning'; }

  // Entropie : E = L × log2(R)
  let charsetSize = 0;
  if (hasUpper) charsetSize += 26;
  let hasLower = false;
  for (const ch of password) {
    if (ch >= 'a' && ch <= 'z') { hasLower = true; break; }
  }
  if (hasLower) charsetSize += 26;
  if (hasDigit) charsetSize += 10;
  if (hasSymbol) charsetSize += 32;
  if (charsetSize === 0) charsetSize = 26;
  const entropy = password.length > 0 ? Math.round(password.length * Math.log2(charsetSize) * 10) / 10 : 0;

  return { score, level, levelColor, criteria, suggestions, entropy };
}
