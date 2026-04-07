export const quizQuestions = [
  {
    id: 1,
    question: "Quel est le principal risque d'utiliser le meme mot de passe partout ?",
    options: ["Oublier son mot de passe", "Si un compte est compromis, tous le sont", "Le mot de passe devient trop long", "Aucun risque"],
    correct: 1,
    explanation: "Si un attaquant obtient votre mot de passe sur un site, il pourra acceder a tous vos autres comptes utilisant le meme mot de passe.",
    category: "Mots de passe",
    difficulty: "facile"
  },
  {
    id: 2,
    question: "Que signifie l'acronyme HTTPS ?",
    options: ["HyperText Transfer Protocol Secure", "High Tech Protection System", "Hybrid Transfer Protocol Standard", "HyperText Transmission Privacy Service"],
    correct: 0,
    explanation: "HTTPS chiffre les communications entre votre navigateur et le serveur web, protegeant vos donnees en transit.",
    category: "Reseaux",
    difficulty: "facile"
  },
  {
    id: 3,
    question: "Qu'est-ce qu'une attaque par phishing ?",
    options: ["Un virus informatique", "Une tentative d'usurper une identite pour voler des donnees", "Une attaque sur le reseau Wi-Fi", "Un spam publicitaire"],
    correct: 1,
    explanation: "Le phishing consiste a se faire passer pour une entite legitime afin de tromper la victime et obtenir des informations sensibles.",
    category: "Phishing",
    difficulty: "facile"
  },
  {
    id: 4,
    question: "Quelle est la longueur minimale recommandee pour un mot de passe securise ?",
    options: ["6 caracteres", "8 caracteres", "12 caracteres", "4 caracteres"],
    correct: 2,
    explanation: "Les experts recommandent au moins 12 caracteres pour resister aux attaques par force brute modernes.",
    category: "Mots de passe",
    difficulty: "facile"
  },
  {
    id: 5,
    question: "Qu'est-ce qu'un VPN ?",
    options: ["Un antivirus", "Un reseau prive virtuel", "Un pare-feu", "Un protocole de messagerie"],
    correct: 1,
    explanation: "Un VPN cree un tunnel chiffre pour vos communications, masquant votre adresse IP et protegeant votre vie privee en ligne.",
    category: "Reseaux",
    difficulty: "facile"
  },
  {
    id: 6,
    question: "Que devez-vous verifier avant de cliquer sur un lien dans un e-mail ?",
    options: ["La couleur du lien", "L'URL reelle en survolant le lien", "La taille de la police", "Le nombre de destinataires"],
    correct: 1,
    explanation: "Survoler un lien revele l'URL reelle de destination. Les liens de phishing affichent souvent un texte different de l'URL reelle.",
    category: "Phishing",
    difficulty: "facile"
  },
  {
    id: 7,
    question: "Qu'est-ce que l'authentification a deux facteurs (2FA) ?",
    options: ["Utiliser deux mots de passe", "Confirmer son identite avec deux methodes differentes", "Se connecter sur deux appareils", "Changer de mot de passe deux fois"],
    correct: 1,
    explanation: "Le 2FA ajoute une couche de securite en demandant une seconde verification (SMS, application, cle physique) en plus du mot de passe.",
    category: "Authentification",
    difficulty: "moyen"
  },
  {
    id: 8,
    question: "Qu'est-ce qu'un ransomware ?",
    options: ["Un logiciel de sauvegarde", "Un malware qui chiffre vos fichiers et demande une rancon", "Un outil de recuperation", "Un antivirus"],
    correct: 1,
    explanation: "Les ransomwares chiffrent vos donnees et exigent un paiement pour les restaurer. Les sauvegardes regulieres sont la meilleure protection.",
    category: "Malwares",
    difficulty: "moyen"
  },
  {
    id: 9,
    question: "Quelle pratique est la plus risquee sur un Wi-Fi public ?",
    options: ["Consulter la meteo", "Effectuer des operations bancaires", "Lire un article", "Regarder une video"],
    correct: 1,
    explanation: "Les Wi-Fi publics ne sont pas chiffres. Un attaquant peut intercepter vos donnees sensibles comme les identifiants bancaires.",
    category: "Reseaux",
    difficulty: "moyen"
  },
  {
    id: 10,
    question: "Qu'est-ce que l'ingenierie sociale ?",
    options: ["La conception de logiciels", "La manipulation psychologique pour obtenir des informations", "La gestion de projet informatique", "L'optimisation des reseaux"],
    correct: 1,
    explanation: "L'ingenierie sociale exploite la confiance et les emotions humaines pour contourner les mesures de securite techniques.",
    category: "Phishing",
    difficulty: "moyen"
  },
  {
    id: 11,
    question: "Quel type de fichier joint est le plus dangereux dans un e-mail ?",
    options: [".jpg", ".exe", ".txt", ".pdf"],
    correct: 1,
    explanation: "Les fichiers .exe sont des executables qui peuvent contenir des malwares. Ne jamais ouvrir un .exe recu par e-mail non sollicite.",
    category: "Malwares",
    difficulty: "facile"
  },
  {
    id: 12,
    question: "Qu'est-ce qu'une attaque DDoS ?",
    options: ["Un vol de donnees", "Une surcharge de serveur par un afflux massif de requetes", "Un virus de messagerie", "Une usurpation d'identite"],
    correct: 1,
    explanation: "L'attaque DDoS submerge un serveur de requetes simultanees, le rendant indisponible pour les utilisateurs legitimes.",
    category: "Reseaux",
    difficulty: "moyen"
  },
  {
    id: 13,
    question: "Comment reconnaitre un site web securise ?",
    options: ["Il a un beau design", "Le cadenas et HTTPS dans la barre d'adresse", "Il charge rapidement", "Il a beaucoup de publicites"],
    correct: 1,
    explanation: "Le cadenas et le protocole HTTPS indiquent que la connexion est chiffree entre votre navigateur et le serveur.",
    category: "Reseaux",
    difficulty: "facile"
  },
  {
    id: 14,
    question: "Qu'est-ce qu'un gestionnaire de mots de passe ?",
    options: ["Un fichier texte avec vos mots de passe", "Un logiciel securise qui genere et stocke vos mots de passe", "Un post-it sur l'ecran", "Le trousseau de cles physiques"],
    correct: 1,
    explanation: "Un gestionnaire de mots de passe chiffre et stocke tous vos identifiants, vous permettant d'utiliser des mots de passe uniques et complexes.",
    category: "Mots de passe",
    difficulty: "facile"
  },
  {
    id: 15,
    question: "Qu'est-ce que le chiffrement de bout en bout ?",
    options: ["Chiffrer uniquement le debut du message", "Seuls l'expediteur et le destinataire peuvent lire le message", "Chiffrer les metadonnees", "Utiliser un VPN"],
    correct: 1,
    explanation: "Le chiffrement de bout en bout garantit que meme le fournisseur du service ne peut pas lire le contenu de vos messages.",
    category: "Cryptographie",
    difficulty: "moyen"
  },
  {
    id: 16,
    question: "Qu'est-ce qu'un pare-feu (firewall) ?",
    options: ["Un antivirus", "Un systeme qui filtre le trafic reseau", "Un logiciel de sauvegarde", "Un protocole de chiffrement"],
    correct: 1,
    explanation: "Le pare-feu controle le trafic entrant et sortant de votre reseau selon des regles de securite definies.",
    category: "Reseaux",
    difficulty: "moyen"
  },
  {
    id: 17,
    question: "Quelle est la methode la plus sure pour partager un mot de passe ?",
    options: ["Par e-mail", "Par SMS", "Via un gestionnaire de mots de passe partage", "Sur un post-it"],
    correct: 2,
    explanation: "Les gestionnaires de mots de passe permettent un partage securise et chiffre, contrairement aux canaux non proteges.",
    category: "Mots de passe",
    difficulty: "moyen"
  },
  {
    id: 18,
    question: "Qu'est-ce qu'une attaque par force brute ?",
    options: ["Forcer physiquement un ordinateur", "Tester toutes les combinaisons possibles de mot de passe", "Envoyer un virus", "Couper l'electricite du serveur"],
    correct: 1,
    explanation: "L'attaque par force brute teste systematiquement toutes les combinaisons jusqu'a trouver le bon mot de passe.",
    category: "Mots de passe",
    difficulty: "difficile"
  },
  {
    id: 19,
    question: "Que faire si vous recevez un e-mail suspect de votre banque ?",
    options: ["Cliquer sur le lien pour verifier", "Appeler votre banque avec le numero officiel", "Repondre a l'e-mail", "Transferer l'e-mail a vos collegues"],
    correct: 1,
    explanation: "Ne jamais cliquer sur les liens d'un e-mail suspect. Contactez directement votre banque via les canaux officiels.",
    category: "Phishing",
    difficulty: "facile"
  },
  {
    id: 20,
    question: "Qu'est-ce qu'un zero-day ?",
    options: ["Une mise a jour systeme", "Une faille de securite inconnue du fabricant", "Un type de virus ancien", "Une sauvegarde quotidienne"],
    correct: 1,
    explanation: "Une vulnerabilite zero-day est une faille qui n'a pas encore ete decouverte ou corrigee par l'editeur du logiciel.",
    category: "Malwares",
    difficulty: "difficile"
  },
  {
    id: 21,
    question: "Quel est le principe du moindre privilege ?",
    options: ["Donner tous les acces a tout le monde", "N'accorder que les permissions strictement necessaires", "Supprimer tous les comptes inutilises", "Utiliser uniquement des comptes administrateur"],
    correct: 1,
    explanation: "Le principe du moindre privilege limite les risques en ne donnant a chaque utilisateur que les acces dont il a reellement besoin.",
    category: "Authentification",
    difficulty: "difficile"
  },
  {
    id: 22,
    question: "Qu'est-ce que le spoofing d'e-mail ?",
    options: ["Supprimer un e-mail", "Falsifier l'adresse de l'expediteur", "Chiffrer un e-mail", "Archiver un e-mail"],
    correct: 1,
    explanation: "Le spoofing consiste a falsifier l'en-tete d'un e-mail pour faire croire qu'il provient d'une source legitime.",
    category: "Phishing",
    difficulty: "difficile"
  },
  {
    id: 23,
    question: "A quelle frequence devriez-vous mettre a jour vos logiciels ?",
    options: ["Jamais", "Une fois par an", "Des qu'une mise a jour est disponible", "Uniquement si un probleme survient"],
    correct: 2,
    explanation: "Les mises a jour corrigent des failles de securite connues. Les retarder expose vos systemes a des attaques.",
    category: "Malwares",
    difficulty: "facile"
  },
  {
    id: 24,
    question: "Qu'est-ce que le chiffrement Cesar ?",
    options: ["Un algorithme de hachage moderne", "Un chiffrement par substitution avec decalage fixe", "Un protocole reseau", "Un type de pare-feu"],
    correct: 1,
    explanation: "Le chiffrement Cesar decale chaque lettre d'un nombre fixe de positions dans l'alphabet. C'est l'un des plus anciens chiffrements connus.",
    category: "Cryptographie",
    difficulty: "moyen"
  },
  {
    id: 25,
    question: "Quelle est la meilleure pratique pour les sauvegardes ?",
    options: ["Ne pas en faire", "Regle 3-2-1 : 3 copies, 2 supports, 1 hors site", "Tout mettre sur une cle USB", "Sauvegarder uniquement les photos"],
    correct: 1,
    explanation: "La regle 3-2-1 garantit la resilience : 3 copies de vos donnees, sur 2 supports differents, dont 1 stocke hors site.",
    category: "Malwares",
    difficulty: "difficile"
  }
];
