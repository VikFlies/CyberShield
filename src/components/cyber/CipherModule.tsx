import { useState } from 'react';
import { cesarEncrypt, cesarDecrypt, cesarBruteForce, vigenereEncrypt, vigenereDecrypt } from '@/lib/cipher';
import { Info } from 'lucide-react';

const CipherModule = () => {
  const [mode, setMode] = useState<'cesar' | 'vigenere'>('cesar');
  const [text, setText] = useState('');
  const [shift, setShift] = useState(3);
  const [vKey, setVKey] = useState('');
  const [showBrute, setShowBrute] = useState(false);

  const cesarResult = text ? cesarEncrypt(text, shift) : '';
  const cesarDecResult = text ? cesarDecrypt(text, shift) : '';
  const bruteResults = text ? cesarBruteForce(text) : [];

  const vigEncResult = text && vKey ? vigenereEncrypt(text, vKey) : '';
  const vigDecResult = text && vKey ? vigenereDecrypt(text, vKey) : '';

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">🔐 Chiffrement & Déchiffrement</h2>
        <p className="text-muted-foreground text-sm">
          Explorez les algorithmes de chiffrement classiques de manière interactive.
        </p>
      </div>

      {/* Explication */}
      <div className="card-cyber flex gap-3">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p><strong className="text-foreground">César :</strong> Chaque lettre est décalée d'un nombre fixe dans l'alphabet. Avec un décalage de 3, A→D, B→E, etc.</p>
          <p className="mt-1"><strong className="text-foreground">Vigenère :</strong> Utilise un mot-clé pour appliquer un décalage variable à chaque lettre, rendant le chiffrement plus robuste.</p>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('cesar')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'cesar' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
          }`}
        >
          César
        </button>
        <button
          onClick={() => setMode('vigenere')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'vigenere' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
          }`}
        >
          Vigenère
        </button>
      </div>

      {/* Input */}
      <div className="space-y-4">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Entrez votre message..."
          rows={3}
          className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />

        {mode === 'cesar' ? (
          <div className="flex items-center gap-4">
            <label className="text-sm text-muted-foreground">Décalage :</label>
            <input
              type="range"
              min={1}
              max={25}
              value={shift}
              onChange={e => setShift(Number(e.target.value))}
              className="flex-1 accent-primary"
            />
            <span className="text-primary font-mono font-bold w-8 text-center">{shift}</span>
          </div>
        ) : (
          <input
            type="text"
            value={vKey}
            onChange={e => setVKey(e.target.value.replace(/[^a-zA-Z]/g, ''))}
            placeholder="Mot-clé (lettres uniquement)..."
            className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
          />
        )}
      </div>

      {/* Résultats */}
      {text && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-cyber">
            <h3 className="text-sm font-semibold text-success mb-2">🔒 Chiffré</h3>
            <p className="font-mono text-foreground break-all">
              {mode === 'cesar' ? cesarResult : (vigEncResult || '(entrez un mot-clé)')}
            </p>
          </div>
          <div className="card-cyber">
            <h3 className="text-sm font-semibold text-primary mb-2">🔓 Déchiffré</h3>
            <p className="font-mono text-foreground break-all">
              {mode === 'cesar' ? cesarDecResult : (vigDecResult || '(entrez un mot-clé)')}
            </p>
          </div>
        </div>
      )}

      {/* Force brute (César only) */}
      {mode === 'cesar' && text && (
        <div>
          <button
            onClick={() => setShowBrute(!showBrute)}
            className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            {showBrute ? 'Masquer' : 'Afficher'} la force brute (25 possibilités)
          </button>

          {showBrute && (
            <div className="card-cyber mt-4 overflow-hidden p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-muted-foreground font-medium w-24">Décalage</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">Résultat</th>
                  </tr>
                </thead>
                <tbody>
                  {bruteResults.map(r => (
                    <tr key={r.shift} className={`border-b border-border/30 ${r.shift === shift ? 'bg-primary/5' : ''}`}>
                      <td className="p-3 font-mono text-primary">{r.shift}</td>
                      <td className="p-3 font-mono text-foreground break-all">{r.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CipherModule;
