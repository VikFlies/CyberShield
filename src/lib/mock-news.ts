// Données mockées de veille cybersécurité — CyberShield
import type { NewsArticle } from './state';

export const mockNews: NewsArticle[] = [
  {
    title: "Nouvelle vague de ransomware ciblant les PME françaises",
    source: "ANSSI",
    date: "2026-03-30",
    summary: "L'ANSSI alerte sur une recrudescence d'attaques par ransomware visant spécifiquement les petites et moyennes entreprises du secteur industriel.",
    category: "Ransomware",
    severity: "high"
  },
  {
    title: "Vulnérabilité critique découverte dans OpenSSL 3.4",
    source: "CERT-FR",
    date: "2026-03-29",
    summary: "Une faille zero-day permettant l'exécution de code à distance a été identifiée. Un correctif est disponible.",
    category: "Vulnérabilités",
    severity: "high"
  },
  {
    title: "Mise à jour de sécurité Windows : 47 failles corrigées",
    source: "Microsoft",
    date: "2026-03-28",
    summary: "Le Patch Tuesday de mars corrige 47 vulnérabilités dont 5 critiques activement exploitées.",
    category: "Mises à jour",
    severity: "medium"
  },
  {
    title: "Campagne de phishing imitant l'Assurance Maladie",
    source: "Cybermalveillance.gouv.fr",
    date: "2026-03-27",
    summary: "Des e-mails frauduleux promettant un remboursement circulent massivement. Ne cliquez pas sur les liens.",
    category: "Phishing",
    severity: "high"
  },
  {
    title: "L'IA générative utilisée pour créer des deepfakes vocaux",
    source: "Europol",
    date: "2026-03-26",
    summary: "Les cybercriminels utilisent de plus en plus l'IA pour imiter la voix de dirigeants et orchestrer des fraudes au virement.",
    category: "IA & Menaces",
    severity: "medium"
  },
  {
    title: "Augmentation de 40% des attaques sur les supply chains",
    source: "ENISA",
    date: "2026-03-25",
    summary: "Les attaques ciblant les chaînes d'approvisionnement logicielles continuent de croître, nécessitant une vigilance accrue.",
    category: "Supply Chain",
    severity: "high"
  },
  {
    title: "Guide pratique : sécuriser le télétravail en 10 étapes",
    source: "CNIL",
    date: "2026-03-24",
    summary: "La CNIL publie un guide actualisé pour aider les entreprises à sécuriser les postes de travail à distance.",
    category: "Bonnes pratiques",
    severity: "low"
  },
  {
    title: "Fuite de données chez un hébergeur cloud européen",
    source: "Le Monde Informatique",
    date: "2026-03-23",
    summary: "Les données de 2 millions d'utilisateurs ont été exposées suite à une mauvaise configuration de base de données.",
    category: "Fuites de données",
    severity: "high"
  },
  {
    title: "Nouveau standard de chiffrement post-quantique adopté",
    source: "NIST",
    date: "2026-03-22",
    summary: "Le NIST finalise les algorithmes de chiffrement résistants aux ordinateurs quantiques pour protéger les communications futures.",
    category: "Cryptographie",
    severity: "low"
  },
  {
    title: "Alerte : applications malveillantes sur le Play Store",
    source: "Kaspersky",
    date: "2026-03-21",
    summary: "12 applications Android contenaient un trojan bancaire. Google les a retirées mais 500 000 téléchargements ont été effectués.",
    category: "Malwares",
    severity: "medium"
  }
];
