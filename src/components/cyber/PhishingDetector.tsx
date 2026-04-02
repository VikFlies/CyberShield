import { useState } from 'react';
import { analyzeEmail, type EmailInput } from '@/lib/phishing';
import { updateState, getState, useGlobalState } from '@/lib/state';
import { Info, AlertTriangle, CheckCircle, Shield } from 'lucide-react';

const PhishingDetector = () => {
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [result, setResult] = useState<ReturnType<typeof analyzeEmail> | null>(null);
  const state = useGlobalState();

  const handleAnalyze = () => {
    const email: EmailInput = { sender, subject, body };
    const res = analyzeEmail(email);
    setResult(res);

    // Sauvegarder dans le state
    const st = getState();
    updateState({
      phishingAnalyses: [
        ...st.phishingAnalyses,
        {
          sender,
          subject,
          score: res.score,
          verdict: res.verdict,
          reasons: res.reasons,
          date: new Date().toLocaleDateString('fr-FR'),
        },
      ],
    });
  };

  const loadExample = () => {
    setSender('securite@banque-verify.net');
    setSubject('URGENT : Votre compte sera bloqué dans les 24h');
    setBody('Cher client, nous avons détecté une activité suspecte. Cliquez ici pour confirmer votre identité et mettre à jour vos informations. Vos coordonnées bancaires doivent être vérifiées immédiatement.');
    setResult(null);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">📧 Détecteur de Phishing</h2>
        <p className="text-muted-foreground text-sm">
          Analysez un e-mail pour détecter les signes de tentative de phishing.
        </p>
      </div>

      <div className="card-cyber flex gap-3">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Le phishing est une technique d'arnaque où l'attaquant se fait passer pour un organisme de confiance. Signes typiques : <strong className="text-foreground">urgence</strong>, <strong className="text-foreground">liens suspects</strong>, <strong className="text-foreground">demandes de données personnelles</strong>.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <input
          value={sender}
          onChange={e => setSender(e.target.value)}
          placeholder="Expéditeur (ex: support@example.com)"
          className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <input
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="Objet de l'e-mail"
          className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Corps du message..."
          rows={5}
          className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />
        <div className="flex gap-3">
          <button
            onClick={handleAnalyze}
            disabled={!sender && !subject && !body}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Analyser
          </button>
          <button
            onClick={loadExample}
            className="px-6 py-2.5 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            Charger un exemple
          </button>
        </div>
      </div>

      {/* Résultat */}
      {result && (
        <div className="space-y-4">
          {/* Verdict */}
          <div className={`card-cyber border-l-4 ${
            result.verdict === 'Phishing probable' ? 'border-l-destructive' :
            result.verdict === 'Douteux' ? 'border-l-warning' : 'border-l-success'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              {result.verdict === 'Phishing probable' ? (
                <AlertTriangle className="w-6 h-6 text-destructive" />
              ) : result.verdict === 'Douteux' ? (
                <Shield className="w-6 h-6 text-warning" />
              ) : (
                <CheckCircle className="w-6 h-6 text-success" />
              )}
              <div>
                <p className={`text-lg font-bold ${
                  result.verdict === 'Phishing probable' ? 'text-destructive' :
                  result.verdict === 'Douteux' ? 'text-warning' : 'text-success'
                }`}>
                  {result.verdict}
                </p>
                <p className="text-sm text-muted-foreground">Score de suspicion : {result.score}/100</p>
              </div>
            </div>

            {/* Barre */}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-3">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  result.score >= 60 ? 'bg-destructive' : result.score >= 30 ? 'bg-warning' : 'bg-success'
                }`}
                style={{ width: `${result.score}%` }}
              />
            </div>
          </div>

          {/* Drapeaux rouges */}
          {result.reasons.length > 0 && (
            <div className="card-cyber">
              <h3 className="text-sm font-semibold text-foreground mb-3">🚩 Drapeaux rouges détectés</h3>
              <ul className="space-y-2">
                {result.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-destructive mt-0.5">•</span>
                    <span className="text-muted-foreground">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.reasons.length === 0 && (
            <div className="card-cyber border-success/30">
              <p className="text-sm text-success">✅ Aucun signe suspect détecté. Cet e-mail semble légitime.</p>
            </div>
          )}
        </div>
      )}

      {/* Historique */}
      {state.phishingAnalyses.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Historique des analyses</h3>
          <div className="space-y-2">
            {state.phishingAnalyses.slice(-5).reverse().map((a, i) => (
              <div key={i} className="card-cyber flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-foreground">{a.subject || a.sender}</p>
                  <p className="text-xs text-muted-foreground">{a.date}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  a.verdict === 'Phishing probable' ? 'bg-destructive/10 text-destructive' :
                  a.verdict === 'Douteux' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                }`}>
                  {a.verdict}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhishingDetector;
