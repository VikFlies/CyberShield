import { useState } from 'react';
import { analyzePassword } from '@/lib/password';
import { updateState, getState } from '@/lib/state';
import { Eye, EyeOff, Info } from 'lucide-react';

const PasswordAnalyzer = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const result = password.length > 0 ? analyzePassword(password) : null;

  const handleSave = () => {
    if (result) {
      const st = getState();
      updateState({
        passwordAnalyses: [
          ...st.passwordAnalyses,
          {
            password: '***',
            score: result.score,
            level: result.level,
            entropy: result.entropy,
            date: new Date().toLocaleDateString('fr-FR'),
          },
        ],
      });
    }
  };

  const barColor = () => {
    if (!result) return 'bg-muted';
    if (result.score >= 80) return 'bg-success';
    if (result.score >= 60) return 'bg-accent';
    if (result.score >= 35) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">🔒 Analyseur de Mot de Passe</h2>
        <p className="text-muted-foreground text-sm">
          Testez la robustesse de votre mot de passe. L'analyse se fait en temps réel, rien n'est envoyé à un serveur.
        </p>
      </div>

      {/* Info pédagogique */}
      <div className="card-cyber flex gap-3">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Un mot de passe fort combine <strong className="text-foreground">longueur</strong>, <strong className="text-foreground">majuscules</strong>, <strong className="text-foreground">chiffres</strong> et <strong className="text-foreground">symboles</strong>. Évitez les mots courants comme "password" ou "123456".
        </p>
      </div>

      {/* Input */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Entrez un mot de passe à tester..."
          className="w-full bg-secondary border border-border rounded-lg px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {result && (
        <div className="space-y-6">
          {/* Barre de progression */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Score : {result.score}/100</span>
              <span className={`text-sm font-semibold ${
                result.score >= 80 ? 'text-success' :
                result.score >= 60 ? 'text-accent' :
                result.score >= 35 ? 'text-warning' : 'text-destructive'
              }`}>
                {result.level}
              </span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColor()}`}
                style={{ width: `${result.score}%` }}
              />
            </div>
          </div>

          {/* Entropie */}
          <div className="card-cyber">
            <p className="text-sm text-muted-foreground">Entropie estimée</p>
            <p className="text-xl font-bold font-mono text-primary">{result.entropy} bits</p>
            <p className="text-xs text-muted-foreground mt-1">
              E = L × log₂(R) — Plus l'entropie est élevée, plus le mot de passe est difficile à deviner.
            </p>
          </div>

          {/* Critères */}
          <div className="card-cyber space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Critères d'évaluation</h3>
            {result.criteria.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${c.met ? 'bg-success' : 'bg-destructive'}`} />
                <span className={`text-sm ${c.met ? 'text-foreground' : 'text-muted-foreground'}`}>{c.label}</span>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div className="card-cyber border-warning/30">
              <h3 className="text-sm font-semibold text-warning mb-2">💡 Suggestions</h3>
              <ul className="space-y-1">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground">• {s}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Enregistrer l'analyse
          </button>
        </div>
      )}
    </div>
  );
};

export default PasswordAnalyzer;
