import { useState } from 'react';
import { analyzePassword } from '@/lib/password.js';
import { updateState, getState } from '@/lib/state.js';
import { Eye, EyeOff, Info, Check, X, Save } from 'lucide-react';

const PasswordAnalyzer = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
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
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
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
        <h2 className="text-2xl font-bold text-foreground mb-2">Analyseur de Mot de Passe</h2>
        <p className="text-muted-foreground text-sm">
          Testez la robustesse de votre mot de passe. L'analyse se fait en temps reel, rien n'est envoye a un serveur.
        </p>
      </div>

      <div className="card-cyber flex gap-3 bg-primary/5 border-primary/20">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Un mot de passe fort combine <strong className="text-foreground">longueur</strong>, <strong className="text-foreground">majuscules</strong>, <strong className="text-foreground">chiffres</strong> et <strong className="text-foreground">symboles</strong>. Evitez les mots courants comme "password" ou "123456".
        </p>
      </div>

      {/* Input */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => { setPassword(e.target.value); setSaved(false); }}
          placeholder="Entrez un mot de passe a tester..."
          className="input-cyber pr-12 font-mono"
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {result && (
        <div className="space-y-5 animate-fade-in-up">
          {/* Score bar */}
          <div className="card-cyber">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-sm text-muted-foreground">Score de robustesse</p>
                <p className={`text-3xl font-bold font-mono ${
                  result.score >= 80 ? 'text-success' :
                  result.score >= 60 ? 'text-accent' :
                  result.score >= 35 ? 'text-warning' : 'text-destructive'
                }`}>
                  {result.score}<span className="text-lg text-muted-foreground">/100</span>
                </p>
              </div>
              <span className={`badge-cyber ${
                result.score >= 80 ? 'bg-success/10 text-success' :
                result.score >= 60 ? 'bg-accent/10 text-accent' :
                result.score >= 35 ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'
              }`}>
                {result.level}
              </span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={`progress-bar ${barColor()}`}
                style={{ width: `${result.score}%` }}
              />
            </div>
          </div>

          {/* Entropie + Criteres en grille */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Entropie */}
            <div className="card-cyber text-center">
              <p className="text-xs text-muted-foreground mb-1">Entropie estimee</p>
              <p className="text-2xl font-bold font-mono text-primary">{result.entropy} <span className="text-sm text-muted-foreground">bits</span></p>
              <p className="text-xs text-muted-foreground mt-2">
                E = L x log2(R)
              </p>
            </div>

            {/* Criteres */}
            <div className="card-cyber">
              <p className="text-xs text-muted-foreground mb-3">Criteres</p>
              <div className="space-y-2">
                {result.criteria.map((c, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${c.met ? 'bg-success/20' : 'bg-destructive/20'}`}>
                      {c.met
                        ? <Check className="w-3 h-3 text-success" />
                        : <X className="w-3 h-3 text-destructive" />
                      }
                    </div>
                    <span className={`text-xs ${c.met ? 'text-foreground' : 'text-muted-foreground'}`}>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div className="card-cyber border-warning/20 bg-warning/5">
              <h3 className="text-sm font-semibold text-warning mb-3">Suggestions d'amelioration</h3>
              <ul className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-warning mt-0.5">-</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saved}
            className={`btn-cyber flex items-center gap-2 ${saved ? 'bg-success hover:bg-success' : ''}`}
          >
            {saved ? (
              <><Check className="w-4 h-4" /> Analyse enregistree</>
            ) : (
              <><Save className="w-4 h-4" /> Enregistrer l'analyse</>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default PasswordAnalyzer;
