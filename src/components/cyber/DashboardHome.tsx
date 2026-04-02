import { useGlobalState } from '@/lib/state';
import { Shield, Lock, Mail, HelpCircle, TrendingUp, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

interface Props {
  onNavigate: (tab: string) => void;
}

const DashboardHome = ({ onNavigate }: Props) => {
  const state = useGlobalState();

  // Score moyen quiz
  const avgQuiz = state.quizResults.length > 0
    ? Math.round(state.quizResults.reduce((s, r) => s + (r.score / r.total) * 100, 0) / state.quizResults.length)
    : null;

  // Dernier mot de passe
  const lastPw = state.passwordAnalyses.length > 0
    ? state.passwordAnalyses[state.passwordAnalyses.length - 1]
    : null;

  // Phishing stats
  const totalPhishing = state.phishingAnalyses.length;
  const phishingDetected = state.phishingAnalyses.filter(a => a.verdict === 'Phishing probable').length;
  const phishingRate = totalPhishing > 0 ? Math.round((phishingDetected / totalPhishing) * 100) : null;

  // Niveau global
  let globalLevel = 'Non évalué';
  let globalColor = 'text-muted-foreground';
  if (avgQuiz !== null) {
    if (avgQuiz >= 80) { globalLevel = 'Excellent'; globalColor = 'text-success'; }
    else if (avgQuiz >= 60) { globalLevel = 'Bon'; globalColor = 'text-primary'; }
    else if (avgQuiz >= 40) { globalLevel = 'Moyen'; globalColor = 'text-warning'; }
    else { globalLevel = 'À améliorer'; globalColor = 'text-destructive'; }
  }

  const kpis = [
    {
      label: 'Score Quiz Moyen',
      value: avgQuiz !== null ? `${avgQuiz}%` : '—',
      icon: HelpCircle,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Dernier Mot de Passe',
      value: lastPw ? lastPw.level : '—',
      icon: Lock,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      label: 'E-mails Analysés',
      value: `${totalPhishing}`,
      icon: Mail,
      color: 'text-info',
      bg: 'bg-info/10',
    },
    {
      label: 'Taux Phishing',
      value: phishingRate !== null ? `${phishingRate}%` : '—',
      icon: AlertTriangle,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
  ];

  const shortcuts = [
    { id: 'password', label: 'Tester un mot de passe', icon: Lock },
    { id: 'phishing', label: 'Analyser un e-mail', icon: Mail },
    { id: 'quiz', label: 'Lancer le quiz', icon: HelpCircle },
    { id: 'cipher', label: 'Chiffrer un message', icon: Shield },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Bienvenue sur <span className="text-gradient-cyber">CyberShield</span>
        </h1>
        <p className="text-muted-foreground">
          Plateforme de sensibilisation à la cybersécurité — SecureNova
        </p>
      </div>

      {/* Niveau global */}
      <div className="card-cyber flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
          <TrendingUp className="w-7 h-7 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Niveau de cybersécurité global</p>
          <p className={`text-2xl font-bold ${globalColor}`}>{globalLevel}</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="card-cyber">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Raccourcis */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Accès rapide</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {shortcuts.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => onNavigate(s.id)}
                className="card-cyber group flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">{s.label}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Derniers résultats quiz */}
      {state.quizTopScores.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">🏆 Top Scores Quiz</h2>
          <div className="card-cyber overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-muted-foreground font-medium">#</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Joueur</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Score</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {state.quizTopScores.slice(0, 5).map((r, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="p-4 text-foreground font-mono">{i + 1}</td>
                    <td className="p-4 text-foreground">{r.playerName || 'Anonyme'}</td>
                    <td className="p-4 text-primary font-bold">{r.score} pts</td>
                    <td className="p-4 text-muted-foreground">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
