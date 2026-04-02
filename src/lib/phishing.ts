// Règles et logique de détection de phishing — CyberShield

export const phishingRules = {
  urgencyKeywords: [
    'urgent', 'immédiat', 'immédiatement', 'dernière chance', 'expire',
    'suspension', 'bloqué', 'vérifiez maintenant', 'action requise',
    'dans les 24h', 'compte fermé', 'dernier avertissement', 'sans délai'
  ],
  suspiciousDomains: [
    'securite-update.com', 'banque-verify.net', 'paypal-security.org',
    'microsoft-alert.com', 'google-verify.net', 'amazon-security.xyz',
    'support-technique.biz', 'connexion-securisee.info', 'maj-compte.com',
    'verification-identite.net'
  ],
  redFlags: [
    'cliquez ici', 'mot de passe', 'numéro de carte', 'coordonnées bancaires',
    'pièce jointe', 'virement', 'héritage', 'loterie', 'félicitations',
    'vous avez gagné', 'confirmer votre identité', 'mettre à jour vos informations'
  ],
  legitimateSenders: [
    'contact@securenova.fr', 'rh@securenova.fr', 'support@google.com',
    'noreply@microsoft.com', 'service@amazon.fr', 'info@banque-france.fr'
  ]
};

export interface EmailInput {
  sender: string;
  subject: string;
  body: string;
}

export interface PhishingResult {
  score: number;
  reasons: string[];
  verdict: string;
  verdictColor: string;
}

export function analyzeEmail(email: EmailInput): PhishingResult {
  let score = 0;
  const reasons: string[] = [];
  const textFull = `${email.subject} ${email.body}`.toLowerCase();
  const senderLower = email.sender.toLowerCase();

  // Vérifier si l'expéditeur est légitime (every)
  const isLegitimate = phishingRules.legitimateSenders.some(
    s => senderLower === s.toLowerCase()
  );
  if (!isLegitimate) {
    // Domaine suspect ? (find)
    const suspDomain = phishingRules.suspiciousDomains.find(
      d => senderLower.includes(d)
    );
    if (suspDomain) {
      score += 30;
      reasons.push(`Domaine suspect détecté : ${suspDomain}`);
    }

    // Expéditeur inconnu
    if (!senderLower.includes('@')) {
      score += 15;
      reasons.push('Adresse e-mail invalide (pas de @)');
    }
  }

  // Mots d'urgence (filter)
  const foundUrgency = phishingRules.urgencyKeywords.filter(
    kw => textFull.includes(kw.toLowerCase())
  );
  if (foundUrgency.length > 0) {
    score += Math.min(30, foundUrgency.length * 10);
    reasons.push(`Vocabulaire d'urgence : ${foundUrgency.join(', ')}`);
  }

  // Red flags (filter + some)
  const foundFlags = phishingRules.redFlags.filter(
    flag => textFull.includes(flag.toLowerCase())
  );
  if (foundFlags.length > 0) {
    score += Math.min(30, foundFlags.length * 8);
    reasons.push(`Drapeaux rouges détectés : ${foundFlags.join(', ')}`);
  }

  // Vérifier si tous les éléments sont suspects (every)
  const allFlagsSuspicious = foundFlags.every(
    flag => phishingRules.redFlags.includes(flag)
  );

  // Liens dans le corps
  if (textFull.includes('http') || textFull.includes('www.')) {
    score += 10;
    reasons.push('Contient des liens URL');
  }

  score = Math.min(100, score);

  let verdict = 'Sûr';
  let verdictColor = 'success';
  if (score >= 60) { verdict = 'Phishing probable'; verdictColor = 'destructive'; }
  else if (score >= 30) { verdict = 'Douteux'; verdictColor = 'warning'; }

  return { score, reasons, verdict, verdictColor };
}
