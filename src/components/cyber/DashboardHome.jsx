import { useGlobalState } from '@/lib/state.js';
import { Shield, Lock, Mail, HelpCircle, TrendingUp, AlertTriangle, ArrowRight, Activity } from 'lucide-react';

const DashboardHome = ({ onNavigate }) => {
  const state = useGlobalState();

  const avgQuiz = state.quizResults.length > 0
    ? Math.round(state.quizResults.reduce((s, r) => s + ((r.correctCount ?? 0) / r.total) * 100, 0) / state.quizResults.length)
    : null;

  const lastPw = state.passwordAnalyses.length > 0
    ? state.passwordAnalyses[state.passwordAnalyses.length - 1]
    : null;

  const totalPhishing = state.phishingAnalyses.length;
  const phishingDetected = state.phishingAnalyses.filter(a => a.verdict === 'Phishing probable').length;
  const phishingRate = totalPhishing > 0 ? Math.round((phishingDetected / totalPhishing) * 100) : null;

  let globalLevel = 'Non evalue';
  let globalColor = 'text-muted-foreground';
  let globalBg = 'bg-muted/20';
  if (avgQuiz !== null) {
    if (avgQuiz >= 80) { globalLevel = 'Excellent'; globalColor = 'text-success'; globalBg = 'bg-success/10'; }
    else if (avgQuiz >= 60) { globalLevel = 'Bon'; globalColor = 'text-primary'; globalBg = 'bg-primary/10'; }
    else if (avgQuiz >= 40) { globalLevel = 'Moyen'; globalColor = 'text-warning'; globalBg = 'bg-warning/10'; }
    else { globalLevel = 'A ameliorer'; globalColor = 'text-destructive'; globalBg = 'bg-destructive/10'; }
  }

  const kpis = [
    { label: 'Score Quiz Moyen', value: avgQuiz !== null ? `${avgQuiz}%` : '--', icon: HelpCircle, color: 'hsl(var(--primary))', textColor: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Dernier Mot de Passe', value: lastPw ? lastPw.level : '--', icon: Lock, color: 'hsl(var(--accent))', textColor: 'text-accent', bg: 'bg-accent/10' },
    { label: 'E-mails Analyses', value: `${totalPhishing}`, icon: Mail, color: 'hsl(var(--info))', textColor: 'text-info', bg: 'bg-info/10' },
    { label: 'Taux Phishing', value: phishingRate !== null ? `${phishingRate}%` : '--', icon: AlertTriangle, color: 'hsl(var(--warning))', textColor: 'text-warning', bg: 'bg-warning/10' },
  ];

  const shortcuts = [
    { id: 'password', label: 'Tester un mot de passe', desc: 'Analysez la robustesse', icon: Lock },
    { id: 'phishing', label: 'Analyser un e-mail', desc: 'Detectez les menaces', icon: Mail },
    { id: 'quiz', label: 'Lancer le quiz', desc: 'Testez vos connaissances', icon: HelpCircle },
    { id: 'cipher', label: 'Chiffrer un message', desc: 'Cesar & Vigenere', icon: Shield },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bienvenue sur <span className="text-gradient-cyber">CyberShield</span>
          </h1>
          <p className="text-muted-foreground">
            Plateforme de sensibilisation a la cybersecurite — SecureNova
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
          <Activity className="w-3 h-3 text-success" />
          En ligne
        </div>
      </div>

      {/* Niveau global */}
      <div className={`card-cyber flex items-center gap-5 ${globalBg} border-transparent`}>
        <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center cyber-glow">
          <TrendingUp className="w-8 h-8 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">Niveau de cybersecurite global</p>
          <p className={`text-2xl font-bold ${globalColor}`}>{globalLevel}</p>
        </div>
        {avgQuiz !== null && (
          <div className="hidden sm:block text-right">
            <p className="text-3xl font-bold font-mono text-foreground">{avgQuiz}%</p>
            <p className="text-xs text-muted-foreground">score moyen</p>
          </div>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="card-stat animate-fade-in-up"
              style={{ '--stat-color': kpi.color, animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${kpi.textColor}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground font-mono">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1.5">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Raccourcis */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Acces rapide</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {shortcuts.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => onNavigate(s.id)}
                className="card-cyber group text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-sm font-medium text-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Scores */}
      {state.quizTopScores.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Top Scores Quiz</h2>
          <div className="card-cyber overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left p-4 text-muted-foreground font-medium w-12">#</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Joueur</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Score</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {state.quizTopScores.slice(0, 5).map((r, i) => (
                  <tr key={i} className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-mono">
                      {i === 0 ? <span className="text-warning font-bold">1</span> :
                       i === 1 ? <span className="text-muted-foreground font-bold">2</span> :
                       i === 2 ? <span className="text-accent font-bold">3</span> :
                       <span className="text-muted-foreground">{i + 1}</span>}
                    </td>
                    <td className="p-4 text-foreground font-medium">{r.playerName || 'Anonyme'}</td>
                    <td className="p-4 text-primary font-bold font-mono">{r.score} pts</td>
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
