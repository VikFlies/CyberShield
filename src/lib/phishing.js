// Moteur de detection de phishing — CyberShield

// Marques connues et leurs domaines legitimes
const KNOWN_BRANDS = {
  'google': ['google.com', 'gmail.com', 'youtube.com', 'googleapis.com'],
  'facebook': ['facebook.com', 'fb.com', 'messenger.com', 'meta.com', 'instagram.com'],
  'microsoft': ['microsoft.com', 'outlook.com', 'live.com', 'hotmail.com', 'office.com', 'windows.com'],
  'apple': ['apple.com', 'icloud.com', 'me.com'],
  'amazon': ['amazon.com', 'amazon.fr', 'amazon.co.uk', 'aws.com'],
  'paypal': ['paypal.com', 'paypal.fr'],
  'netflix': ['netflix.com'],
  'twitter': ['twitter.com', 'x.com'],
  'linkedin': ['linkedin.com'],
  'whatsapp': ['whatsapp.com'],
  'instagram': ['instagram.com'],
  'tiktok': ['tiktok.com'],
  'snapchat': ['snapchat.com'],
  'spotify': ['spotify.com'],
  'dropbox': ['dropbox.com'],
  'adobe': ['adobe.com'],
  'banque': ['banque-france.fr', 'bnpparibas.com', 'societegenerale.fr', 'credit-agricole.fr', 'lcl.fr', 'labanquepostale.fr', 'caisse-epargne.fr', 'creditmutuel.fr'],
  'impots': ['impots.gouv.fr', 'service-public.fr', 'ameli.fr', 'caf.fr'],
  'orange': ['orange.fr', 'sosh.fr'],
  'free': ['free.fr', 'iliad.fr'],
  'sfr': ['sfr.fr'],
};

// Fournisseurs d'email gratuits (utilises pour usurper des marques)
const FREE_EMAIL_PROVIDERS = [
  'gmail.com', 'yahoo.com', 'yahoo.fr', 'hotmail.com', 'hotmail.fr',
  'outlook.com', 'live.com', 'aol.com', 'protonmail.com', 'mail.com',
  'gmx.com', 'gmx.fr', 'zoho.com', 'yandex.com', 'icloud.com',
  'laposte.net', 'orange.fr', 'free.fr', 'sfr.fr', 'wanadoo.fr'
];

// TLDs suspects (souvent utilises pour le phishing)
const SUSPICIOUS_TLDS = [
  '.xyz', '.top', '.club', '.work', '.click', '.link', '.info', '.biz',
  '.online', '.site', '.website', '.space', '.fun', '.icu', '.buzz',
  '.tk', '.ml', '.ga', '.cf', '.gq', '.pw', '.cc', '.ws',
  '.rest', '.cam', '.monster', '.sbs', '.cfd'
];

// Mots d'urgence (FR + EN)
const URGENCY_KEYWORDS = [
  'urgent', 'immediat', 'immediatement', 'derniere chance', 'expire',
  'suspension', 'bloque', 'verifiez maintenant', 'action requise',
  'dans les 24h', 'compte ferme', 'dernier avertissement', 'sans delai',
  'securite compromise', 'acces restreint', 'verifier immediatement',
  'confirmer sous', 'delai de', 'heures pour', 'sera supprime',
  'sera desactive', 'sera bloque', 'sera ferme', 'activite suspecte',
  'connexion inhabituelle', 'tentative de connexion',
  'immediately', 'suspended', 'verify now', 'account locked',
  'account suspicion', 'account suspended', 'account verification',
  'verify your', 'confirm your', 'update your', 'secure your',
  'unusual activity', 'unauthorized access', 'security alert',
  'action required', 'last warning', 'final notice'
];

// Drapeaux rouges dans le contenu
const RED_FLAGS = [
  'cliquez ici', 'mot de passe', 'numero de carte', 'coordonnees bancaires',
  'piece jointe', 'virement', 'heritage', 'loterie', 'felicitations',
  'vous avez gagne', 'confirmer votre identite', 'mettre a jour vos informations',
  'donnees personnelles', 'code de securite', 'code pin', 'rib',
  'carte bancaire', 'compte bloque', 'remboursement', 'credit gratuit',
  'offre exclusive', 'click here', 'verify your account', 'update your information',
  'confirm your identity', 'credit card', 'bank account', 'password',
  'social security', 'wire transfer', 'account_verification',
  'verify account', 'secure account', 'login attempt', 'sign in attempt'
];

// Expediteurs legitimes connus
const LEGITIMATE_SENDERS = [
  'contact@securenova.fr', 'rh@securenova.fr', 'support@google.com',
  'noreply@microsoft.com', 'service@amazon.fr', 'info@banque-france.fr',
  'noreply@github.com', 'no-reply@accounts.google.com'
];

// Noms de marques a verifier dans le username
const BRAND_NAMES = [];
for (const [brand, domains] of Object.entries(KNOWN_BRANDS)) {
  BRAND_NAMES.push(brand);
  for (const d of domains) {
    const name = d.split('.')[0];
    if (!BRAND_NAMES.includes(name)) BRAND_NAMES.push(name);
  }
}

// Distance de Levenshtein
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// Extraire le domaine d'une adresse email
function extractDomain(email) {
  const parts = email.toLowerCase().split('@');
  return parts.length >= 2 ? parts[parts.length - 1].trim() : '';
}

// Extraire le username d'une adresse email
function extractUsername(email) {
  const parts = email.toLowerCase().split('@');
  return parts.length >= 2 ? parts[0].trim() : '';
}

// Extraire le nom de domaine principal (sans sous-domaines)
function getMainDomain(domain) {
  const parts = domain.split('.');
  if (parts.length >= 2) {
    return parts.slice(-2).join('.');
  }
  return domain;
}

// Extraire tous les domaines mentionnes dans un texte
function extractDomainsFromText(text) {
  // Matche les patterns type domain.tld, url, etc.
  const domainPattern = /(?:https?:\/\/)?(?:www\.)?([a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.(?:[a-z]{2,})(?:\.[a-z]{2,})?)/gi;
  const matches = text.match(domainPattern) || [];
  const domains = [];
  for (const m of matches) {
    // Nettoyer : enlever http://, www., et tout apres le premier /
    let d = m.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0].toLowerCase();
    if (d && d.includes('.') && d.length > 3) {
      domains.push(d);
    }
  }
  return [...new Set(domains)];
}

// Verifier si un domaine est du typosquatting
function checkTyposquatting(domain) {
  const mainDomain = getMainDomain(domain);
  const domainName = mainDomain.split('.')[0];
  const results = [];

  for (const [brand, legits] of Object.entries(KNOWN_BRANDS)) {
    for (const legit of legits) {
      const legitMain = getMainDomain(legit);
      const legitName = legitMain.split('.')[0];

      // Domaine exact = legitime
      if (mainDomain === legitMain) return [];

      // Distance de Levenshtein sur le nom (sans TLD)
      const dist = levenshtein(domainName, legitName);
      const maxLen = Math.max(domainName.length, legitName.length);

      // Typosquatting probable si distance 1-2 pour noms courts, 1-3 pour noms longs
      const threshold = maxLen <= 5 ? 1 : maxLen <= 8 ? 2 : 3;
      if (dist > 0 && dist <= threshold) {
        results.push({
          brand,
          fakeDomain: mainDomain,
          realDomain: legitMain,
          distance: dist,
          score: dist === 1 ? 40 : dist === 2 ? 30 : 20
        });
      }

      // Le nom de la marque est contenu dans le domaine mais ce n'est pas le vrai domaine
      if (domainName.includes(legitName) && mainDomain !== legitMain && domainName !== legitName) {
        results.push({
          brand,
          fakeDomain: mainDomain,
          realDomain: legitMain,
          distance: -1,
          score: 35
        });
      }

      // Le domaine contient le nom de la marque avec des ajouts (facebook-security.com, google-verify.net)
      if (domainName.includes(brand) && mainDomain !== legitMain) {
        const alreadyFound = results.some(r => r.brand === brand && r.fakeDomain === mainDomain);
        if (!alreadyFound) {
          results.push({
            brand,
            fakeDomain: mainDomain,
            realDomain: legitMain,
            distance: -2,
            score: 35
          });
        }
      }
    }
  }

  return results;
}

// Verifier si le username imite une marque (ex: googlle@gmail.com, paypal.security@hotmail.com)
function checkUsernameImpersonation(username, domain) {
  const isFreeProvider = FREE_EMAIL_PROVIDERS.includes(domain);
  if (!isFreeProvider) return null;

  // Nettoyer le username (enlever points, tirets, underscores, chiffres en fin)
  const cleanUsername = username.replace(/[._\-]/g, '').replace(/\d+$/g, '').toLowerCase();

  for (const brandName of BRAND_NAMES) {
    if (brandName.length < 3) continue; // ignorer les noms trop courts

    // Match exact du nom de marque dans le username
    if (cleanUsername.includes(brandName) || username.includes(brandName)) {
      return { brand: brandName, username, domain, score: 30, exact: true };
    }

    // Levenshtein sur le username complet vs nom de marque
    const dist = levenshtein(cleanUsername, brandName);
    const threshold = brandName.length <= 5 ? 1 : 2;
    if (dist > 0 && dist <= threshold) {
      return { brand: brandName, username, domain, score: 35, exact: false };
    }
  }

  return null;
}

// Verifier le TLD
function checkSuspiciousTLD(domain) {
  for (const tld of SUSPICIOUS_TLDS) {
    if (domain.endsWith(tld)) {
      return tld;
    }
  }
  return null;
}

// Verifier sous-domaines trompeurs (ex: google.com.evil.xyz)
function checkDeceptiveSubdomain(domain) {
  for (const legits of Object.values(KNOWN_BRANDS)) {
    for (const legit of legits) {
      if (domain.includes(legit + '.') && !domain.endsWith(legit)) {
        return legit;
      }
      const legitName = legit.split('.')[0];
      const parts = domain.split('.');
      if (parts.length > 2 && parts.slice(0, -2).some(p => p === legitName) && getMainDomain(domain) !== legit) {
        return legit;
      }
    }
  }
  return null;
}

export function analyzeEmail(email) {
  let score = 0;
  const reasons = [];
  const textFull = `${email.subject} ${email.body}`.toLowerCase();
  const senderLower = email.sender.toLowerCase().trim();

  // === 1. ANALYSE DE L'EXPEDITEUR ===
  const isLegitimate = LEGITIMATE_SENDERS.some(s => senderLower === s.toLowerCase());

  if (!isLegitimate) {
    const domain = extractDomain(senderLower);
    const username = extractUsername(senderLower);

    if (!senderLower.includes('@')) {
      score += 20;
      reasons.push('Adresse e-mail invalide (pas de @)');
    } else if (domain) {

      // Typosquatting sur le domaine de l'expediteur
      const typos = checkTyposquatting(domain);
      if (typos.length > 0) {
        const best = typos.reduce((a, b) => a.score > b.score ? a : b);
        score += best.score;
        if (best.distance > 0) {
          reasons.push(`Typosquatting detecte sur l'expediteur : "${best.fakeDomain}" ressemble a "${best.realDomain}" (marque ${best.brand})`);
        } else {
          reasons.push(`Domaine expediteur suspect : "${best.fakeDomain}" imite la marque "${best.brand}" (vrai domaine : ${best.realDomain})`);
        }
      }

      // Username qui imite une marque sur un domaine gratuit
      const impersonation = checkUsernameImpersonation(username, domain);
      if (impersonation) {
        score += impersonation.score;
        if (impersonation.exact) {
          reasons.push(`Usurpation d'identite : le nom "${impersonation.username}" imite la marque "${impersonation.brand}" depuis un fournisseur gratuit (${impersonation.domain})`);
        } else {
          reasons.push(`Nom d'expediteur suspect : "${impersonation.username}" ressemble a la marque "${impersonation.brand}" (domaine gratuit ${impersonation.domain})`);
        }
      }

      // TLD suspect
      const suspTLD = checkSuspiciousTLD(domain);
      if (suspTLD) {
        score += 15;
        reasons.push(`Extension de domaine suspecte : ${suspTLD}`);
      }

      // Sous-domaine trompeur
      const deceptive = checkDeceptiveSubdomain(domain);
      if (deceptive) {
        score += 30;
        reasons.push(`Sous-domaine trompeur : le domaine contient "${deceptive}" mais n'est pas le site officiel`);
      }

      // Domaine avec tirets multiples
      const mainDomain = getMainDomain(domain);
      const dashCount = (mainDomain.match(/-/g) || []).length;
      if (dashCount >= 2) {
        score += 15;
        reasons.push(`Domaine avec ${dashCount} tirets : technique courante de phishing`);
      }

      // Domaine tres long
      if (mainDomain.length > 25) {
        score += 10;
        reasons.push('Nom de domaine anormalement long');
      }
    }
  }

  // === 2. ANALYSE DES DOMAINES DANS LE CORPS DU MESSAGE ===
  const bodyDomains = extractDomainsFromText(`${email.subject} ${email.body}`);
  const senderDomain = extractDomain(senderLower);

  for (const bodyDomain of bodyDomains) {
    // Ignorer si c'est le meme domaine que l'expediteur
    if (bodyDomain === senderDomain) continue;

    // Typosquatting sur les domaines dans le corps
    const bodyTypos = checkTyposquatting(bodyDomain);
    if (bodyTypos.length > 0) {
      const best = bodyTypos.reduce((a, b) => a.score > b.score ? a : b);
      score += best.score;
      if (best.distance > 0) {
        reasons.push(`Lien suspect dans le message : "${best.fakeDomain}" ressemble a "${best.realDomain}" (marque ${best.brand})`);
      } else {
        reasons.push(`Lien trompeur dans le message : "${best.fakeDomain}" imite "${best.brand}" (vrai : ${best.realDomain})`);
      }
    }

    // TLD suspect dans les liens
    const bodyTLD = checkSuspiciousTLD(bodyDomain);
    if (bodyTLD) {
      score += 10;
      reasons.push(`Lien avec extension suspecte dans le message : ${bodyDomain}`);
    }

    // Sous-domaine trompeur dans les liens
    const bodyDeceptive = checkDeceptiveSubdomain(bodyDomain);
    if (bodyDeceptive) {
      score += 25;
      reasons.push(`Lien avec sous-domaine trompeur : "${bodyDomain}" imite ${bodyDeceptive}`);
    }

    // Domaine dans le body different du domaine expediteur (mismatch)
    if (senderDomain && getMainDomain(bodyDomain) !== getMainDomain(senderDomain)) {
      // Verifier si le domaine dans le body se fait passer pour une marque
      for (const [brand, legits] of Object.entries(KNOWN_BRANDS)) {
        if (legits.some(l => getMainDomain(l) === getMainDomain(senderDomain))) {
          // L'expediteur pretend etre cette marque mais le lien pointe ailleurs
          if (!legits.some(l => getMainDomain(l) === getMainDomain(bodyDomain))) {
            score += 15;
            reasons.push(`Incoherence : l'expediteur utilise "${senderDomain}" mais le lien pointe vers "${bodyDomain}"`);
            break;
          }
        }
      }
    }
  }

  // === 3. MOTS D'URGENCE ===
  const foundUrgency = URGENCY_KEYWORDS.filter(kw => textFull.includes(kw.toLowerCase()));
  if (foundUrgency.length > 0) {
    score += Math.min(30, foundUrgency.length * 8);
    reasons.push(`Vocabulaire d'urgence detecte (${foundUrgency.length} termes) : ${foundUrgency.slice(0, 4).join(', ')}${foundUrgency.length > 4 ? '...' : ''}`);
  }

  // === 4. RED FLAGS ===
  const foundFlags = RED_FLAGS.filter(flag => textFull.includes(flag.toLowerCase()));
  if (foundFlags.length > 0) {
    score += Math.min(25, foundFlags.length * 6);
    reasons.push(`Contenus suspects (${foundFlags.length}) : ${foundFlags.slice(0, 4).join(', ')}${foundFlags.length > 4 ? '...' : ''}`);
  }

  // === 5. LIENS DANS LE CORPS ===
  const urlPattern = /https?:\/\/|www\./gi;
  const urlCount = (textFull.match(urlPattern) || []).length;
  if (urlCount > 0) {
    score += Math.min(15, urlCount * 5);
    reasons.push(`Contient ${urlCount} lien(s) URL`);
  }

  // === 6. MELANGE DE LANGUES ===
  const frenchWords = textFull.match(/\b(votre|compte|cliquez|verification|securite|identite|connexion)\b/g) || [];
  const englishWords = textFull.match(/\b(your|account|click|verify|security|identity|please|login|suspicious)\b/g) || [];
  if (frenchWords.length > 0 && englishWords.length > 2) {
    score += 10;
    reasons.push('Melange de francais et d\'anglais (possible traduction automatique)');
  }

  // === 7. DEMANDE D'INFO SENSIBLE ===
  if (textFull.includes('repondez') && (textFull.includes('mot de passe') || textFull.includes('carte') || textFull.includes('code'))) {
    score += 15;
    reasons.push('Demande de repondre avec des informations sensibles');
  }

  // === 8. CARACTERES UNICODE TROMPEURS ===
  const homoglyphs = email.sender.match(/[^\x00-\x7F]/g);
  if (homoglyphs) {
    score += 25;
    reasons.push('Caracteres speciaux/unicode dans l\'adresse (tentative d\'usurpation visuelle)');
  }

  // === 9. PATTERNS DE PHISHING DANS LES URLS (paths suspects) ===
  const suspiciousPaths = /\/(secure|login|verify|account|signin|update|confirm|auth|validation|verification)[_\-]?/i;
  if (suspiciousPaths.test(email.body)) {
    score += 10;
    reasons.push('URL avec chemin suspect (login, verify, account...)');
  }

  score = Math.min(100, score);

  let verdict = 'Sur';
  let verdictColor = 'success';
  if (score >= 55) { verdict = 'Phishing probable'; verdictColor = 'destructive'; }
  else if (score >= 25) { verdict = 'Douteux'; verdictColor = 'warning'; }

  return { score, reasons, verdict, verdictColor };
}
