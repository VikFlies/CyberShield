// Base de 25 questions de quiz cybersécurité — CyberShield

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number; // index de la bonne réponse
  explanation: string;
  category: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Quel est le principal risque d'utiliser le même mot de passe partout ?",
    options: ["Oublier son mot de passe", "Si un compte est compromis, tous le sont", "Le mot de passe devient trop long", "Aucun risque"],
    correct: 1,
    explanation: "Si un attaquant obtient votre mot de passe sur un site, il pourra accéder à tous vos autres comptes utilisant le même mot de passe.",
    category: "Mots de passe",
    difficulty: "facile"
  },
  {
    id: 2,
    question: "Que signifie l'acronyme HTTPS ?",
    options: ["HyperText Transfer Protocol Secure", "High Tech Protection System", "Hybrid Transfer Protocol Standard", "HyperText Transmission Privacy Service"],
    correct: 0,
    explanation: "HTTPS chiffre les communications entre votre navigateur et le serveur web, protégeant vos données en transit.",
    category: "Réseaux",
    difficulty: "facile"
  },
  {
    id: 3,
    question: "Qu'est-ce qu'une attaque par phishing ?",
    options: ["Un virus informatique", "Une tentative d'usurper une identité pour voler des données", "Une attaque sur le réseau Wi-Fi", "Un spam publicitaire"],
    correct: 1,
    explanation: "Le phishing consiste à se faire passer pour une entité légitime afin de tromper la victime et obtenir des informations sensibles.",
    category: "Phishing",
    difficulty: "facile"
  },
  {
    id: 4,
    question: "Quelle est la longueur minimale recommandée pour un mot de passe sécurisé ?",
    options: ["6 caractères", "8 caractères", "12 caractères", "4 caractères"],
    correct: 2,
    explanation: "Les experts recommandent au moins 12 caractères pour résister aux attaques par force brute modernes.",
    category: "Mots de passe",
    difficulty: "facile"
  },
  {
    id: 5,
    question: "Qu'est-ce qu'un VPN ?",
    options: ["Un antivirus", "Un réseau privé virtuel", "Un pare-feu", "Un protocole de messagerie"],
    correct: 1,
    explanation: "Un VPN crée un tunnel chiffré pour vos communications, masquant votre adresse IP et protégeant votre vie privée en ligne.",
    category: "Réseaux",
    difficulty: "facile"
  },
  {
    id: 6,
    question: "Que devez-vous vérifier avant de cliquer sur un lien dans un e-mail ?",
    options: ["La couleur du lien", "L'URL réelle en survolant le lien", "La taille de la police", "Le nombre de destinataires"],
    correct: 1,
    explanation: "Survoler un lien révèle l'URL réelle de destination. Les liens de phishing affichent souvent un texte différent de l'URL réelle.",
    category: "Phishing",
    difficulty: "facile"
  },
  {
    id: 7,
    question: "Qu'est-ce que l'authentification à deux facteurs (2FA) ?",
    options: ["Utiliser deux mots de passe", "Confirmer son identité avec deux méthodes différentes", "Se connecter sur deux appareils", "Changer de mot de passe deux fois"],
    correct: 1,
    explanation: "Le 2FA ajoute une couche de sécurité en demandant une seconde vérification (SMS, application, clé physique) en plus du mot de passe.",
    category: "Authentification",
    difficulty: "moyen"
  },
  {
    id: 8,
    question: "Qu'est-ce qu'un ransomware ?",
    options: ["Un logiciel de sauvegarde", "Un malware qui chiffre vos fichiers et demande une rançon", "Un outil de récupération", "Un antivirus"],
    correct: 1,
    explanation: "Les ransomwares chiffrent vos données et exigent un paiement pour les restaurer. Les sauvegardes régulières sont la meilleure protection.",
    category: "Malwares",
    difficulty: "moyen"
  },
  {
    id: 9,
    question: "Quelle pratique est la plus risquée sur un Wi-Fi public ?",
    options: ["Consulter la météo", "Effectuer des opérations bancaires", "Lire un article", "Regarder une vidéo"],
    correct: 1,
    explanation: "Les Wi-Fi publics ne sont pas chiffrés. Un attaquant peut intercepter vos données sensibles comme les identifiants bancaires.",
    category: "Réseaux",
    difficulty: "moyen"
  },
  {
    id: 10,
    question: "Qu'est-ce que l'ingénierie sociale ?",
    options: ["La conception de logiciels", "La manipulation psychologique pour obtenir des informations", "La gestion de projet informatique", "L'optimisation des réseaux"],
    correct: 1,
    explanation: "L'ingénierie sociale exploite la confiance et les émotions humaines pour contourner les mesures de sécurité techniques.",
    category: "Phishing",
    difficulty: "moyen"
  },
  {
    id: 11,
    question: "Quel type de fichier joint est le plus dangereux dans un e-mail ?",
    options: [".jpg", ".exe", ".txt", ".pdf"],
    correct: 1,
    explanation: "Les fichiers .exe sont des exécutables qui peuvent contenir des malwares. Ne jamais ouvrir un .exe reçu par e-mail non sollicité.",
    category: "Malwares",
    difficulty: "facile"
  },
  {
    id: 12,
    question: "Qu'est-ce qu'une attaque DDoS ?",
    options: ["Un vol de données", "Une surcharge de serveur par un afflux massif de requêtes", "Un virus de messagerie", "Une usurpation d'identité"],
    correct: 1,
    explanation: "L'attaque DDoS submerge un serveur de requêtes simultanées, le rendant indisponible pour les utilisateurs légitimes.",
    category: "Réseaux",
    difficulty: "moyen"
  },
  {
    id: 13,
    question: "Comment reconnaître un site web sécurisé ?",
    options: ["Il a un beau design", "Le cadenas et HTTPS dans la barre d'adresse", "Il charge rapidement", "Il a beaucoup de publicités"],
    correct: 1,
    explanation: "Le cadenas et le protocole HTTPS indiquent que la connexion est chiffrée entre votre navigateur et le serveur.",
    category: "Réseaux",
    difficulty: "facile"
  },
  {
    id: 14,
    question: "Qu'est-ce qu'un gestionnaire de mots de passe ?",
    options: ["Un fichier texte avec vos mots de passe", "Un logiciel sécurisé qui génère et stocke vos mots de passe", "Un post-it sur l'écran", "Le trousseau de clés physiques"],
    correct: 1,
    explanation: "Un gestionnaire de mots de passe chiffre et stocke tous vos identifiants, vous permettant d'utiliser des mots de passe uniques et complexes.",
    category: "Mots de passe",
    difficulty: "facile"
  },
  {
    id: 15,
    question: "Qu'est-ce que le chiffrement de bout en bout ?",
    options: ["Chiffrer uniquement le début du message", "Seuls l'expéditeur et le destinataire peuvent lire le message", "Chiffrer les métadonnées", "Utiliser un VPN"],
    correct: 1,
    explanation: "Le chiffrement de bout en bout garantit que même le fournisseur du service ne peut pas lire le contenu de vos messages.",
    category: "Cryptographie",
    difficulty: "moyen"
  },
  {
    id: 16,
    question: "Qu'est-ce qu'un pare-feu (firewall) ?",
    options: ["Un antivirus", "Un système qui filtre le trafic réseau", "Un logiciel de sauvegarde", "Un protocole de chiffrement"],
    correct: 1,
    explanation: "Le pare-feu contrôle le trafic entrant et sortant de votre réseau selon des règles de sécurité définies.",
    category: "Réseaux",
    difficulty: "moyen"
  },
  {
    id: 17,
    question: "Quelle est la méthode la plus sûre pour partager un mot de passe ?",
    options: ["Par e-mail", "Par SMS", "Via un gestionnaire de mots de passe partagé", "Sur un post-it"],
    correct: 2,
    explanation: "Les gestionnaires de mots de passe permettent un partage sécurisé et chiffré, contrairement aux canaux non protégés.",
    category: "Mots de passe",
    difficulty: "moyen"
  },
  {
    id: 18,
    question: "Qu'est-ce qu'une attaque par force brute ?",
    options: ["Forcer physiquement un ordinateur", "Tester toutes les combinaisons possibles de mot de passe", "Envoyer un virus", "Couper l'électricité du serveur"],
    correct: 1,
    explanation: "L'attaque par force brute teste systématiquement toutes les combinaisons jusqu'à trouver le bon mot de passe. D'où l'importance de mots de passe longs et complexes.",
    category: "Mots de passe",
    difficulty: "difficile"
  },
  {
    id: 19,
    question: "Que faire si vous recevez un e-mail suspect de votre banque ?",
    options: ["Cliquer sur le lien pour vérifier", "Appeler votre banque avec le numéro officiel", "Répondre à l'e-mail", "Transférer l'e-mail à vos collègues"],
    correct: 1,
    explanation: "Ne jamais cliquer sur les liens d'un e-mail suspect. Contactez directement votre banque via les canaux officiels que vous connaissez.",
    category: "Phishing",
    difficulty: "facile"
  },
  {
    id: 20,
    question: "Qu'est-ce qu'un zero-day ?",
    options: ["Une mise à jour système", "Une faille de sécurité inconnue du fabricant", "Un type de virus ancien", "Une sauvegarde quotidienne"],
    correct: 1,
    explanation: "Une vulnérabilité zero-day est une faille qui n'a pas encore été découverte ou corrigée par l'éditeur du logiciel.",
    category: "Malwares",
    difficulty: "difficile"
  },
  {
    id: 21,
    question: "Quel est le principe du moindre privilège ?",
    options: ["Donner tous les accès à tout le monde", "N'accorder que les permissions strictement nécessaires", "Supprimer tous les comptes inutilisés", "Utiliser uniquement des comptes administrateur"],
    correct: 1,
    explanation: "Le principe du moindre privilège limite les risques en ne donnant à chaque utilisateur que les accès dont il a réellement besoin.",
    category: "Authentification",
    difficulty: "difficile"
  },
  {
    id: 22,
    question: "Qu'est-ce que le spoofing d'e-mail ?",
    options: ["Supprimer un e-mail", "Falsifier l'adresse de l'expéditeur", "Chiffrer un e-mail", "Archiver un e-mail"],
    correct: 1,
    explanation: "Le spoofing consiste à falsifier l'en-tête d'un e-mail pour faire croire qu'il provient d'une source légitime.",
    category: "Phishing",
    difficulty: "difficile"
  },
  {
    id: 23,
    question: "À quelle fréquence devriez-vous mettre à jour vos logiciels ?",
    options: ["Jamais", "Une fois par an", "Dès qu'une mise à jour est disponible", "Uniquement si un problème survient"],
    correct: 2,
    explanation: "Les mises à jour corrigent des failles de sécurité connues. Les retarder expose vos systèmes à des attaques exploitant ces vulnérabilités.",
    category: "Malwares",
    difficulty: "facile"
  },
  {
    id: 24,
    question: "Qu'est-ce que le chiffrement César ?",
    options: ["Un algorithme de hachage moderne", "Un chiffrement par substitution avec décalage fixe", "Un protocole réseau", "Un type de pare-feu"],
    correct: 1,
    explanation: "Le chiffrement César décale chaque lettre d'un nombre fixe de positions dans l'alphabet. C'est l'un des plus anciens chiffrements connus.",
    category: "Cryptographie",
    difficulty: "moyen"
  },
  {
    id: 25,
    question: "Quelle est la meilleure pratique pour les sauvegardes ?",
    options: ["Ne pas en faire", "Règle 3-2-1 : 3 copies, 2 supports, 1 hors site", "Tout mettre sur une clé USB", "Sauvegarder uniquement les photos"],
    correct: 1,
    explanation: "La règle 3-2-1 garantit la résilience : 3 copies de vos données, sur 2 supports différents, dont 1 stocké hors site.",
    category: "Malwares",
    difficulty: "difficile"
  }
];
