import { useState } from 'react';
import { analyzeEmail } from '@/lib/phishing.js';
import { updateState, getState, useGlobalState } from '@/lib/state.js';
import { Info, AlertTriangle, CheckCircle, Shield, Search, RotateCcw } from 'lucide-react';

const PhishingDetector = () => {
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const state = useGlobalState();

  const handleAnalyze = async () => {
    setAnalyzing(true);
    // Petit delai pour le feedback visuel
    await new Promise(r => setTimeout(r, 400));
    const email = { sender, subject, body };
    const res = analyzeEmail(email);
    setResult(res);
    setAnalyzing(false);

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
    setSubject('URGENT : Votre compte sera bloque dans les 24h');
    setBody('Cher client, nous avons detecte une activite suspecte sur votre compte. Cliquez ici pour confirmer votre identite et mettre a jour vos informations. Vos coordonnees bancaires doivent etre verifiees immediatement. http://banque-verify.net/secure');
    setResult(null);
  };

  const loadExample2 = () => {
    setSender('support@facebookt.com');
    setSubject('Connexion inhabituelle detectee sur votre compte');
    setBody('Nous avons detecte une tentative de connexion inhabituelle. Veuillez verifier votre identite en cliquant sur le lien suivant pour securiser votre compte. Si vous ne confirmez pas dans les 24h, votre compte sera desactive.');
    setResult(null);
  };

  const reset = () => {
    setSender('');
    setSubject('');
    setBody('');
    setResult(null);
  };

  const verdictIcon = () => {
    if (!result) return null;
    if (result.verdict === 'Phishing probable') return <AlertTriangle className="w-7 h-7 text-destructive" />;
    if (result.verdict === 'Douteux') return <Shield className="w-7 h-7 text-warning" />;
    return <CheckCircle className="w-7 h-7 text-success" />;
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Detecteur de Phishing</h2>
        <p className="text-muted-foreground text-sm">
          Analysez un e-mail pour detecter les signes de tentative de phishing.
        </p>
      </div>

      <div className="card-cyber flex gap-3 bg-primary/5 border-primary/20">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p>Notre moteur detecte le <strong className="text-foreground">typosquatting</strong> (facebookt.com, goggle.com), les <strong className="text-foreground">domaines suspects</strong>, le <strong className="text-foreground">vocabulaire d'urgence</strong> et les <strong className="text-foreground">techniques de manipulation</strong>.</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Expediteur</label>
          <input
            value={sender}
            onChange={e => setSender(e.target.value)}
            placeholder="ex: support@facebookt.com"
            className="input-cyber"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Objet</label>
          <input
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Objet de l'e-mail"
            className="input-cyber"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Corps du message</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Collez le contenu de l'e-mail ici..."
            rows={5}
            className="input-cyber resize-none"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAnalyze}
            disabled={(!sender && !subject && !body) || analyzing}
            className="btn-cyber flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? (
              <><Search className="w-4 h-4 animate-spin" /> Analyse en cours...</>
            ) : (
              <><Search className="w-4 h-4" /> Analyser</>
            )}
          </button>
          <button onClick={loadExample} className="btn-secondary text-xs">
            Exemple : banque
          </button>
          <button onClick={loadExample2} className="btn-secondary text-xs">
            Exemple : facebookt.com
          </button>
          {(sender || subject || body) && (
            <button onClick={reset} className="btn-secondary text-xs flex items-center gap-1">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Resultat */}
      {result && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Verdict principal */}
          <div className={`card-cyber border-l-4 ${
            result.verdict === 'Phishing probable' ? 'border-l-destructive bg-destructive/5' :
            result.verdict === 'Douteux' ? 'border-l-warning bg-warning/5' : 'border-l-success bg-success/5'
          }`}>
            <div className="flex items-center gap-4">
              {verdictIcon()}
              <div className="flex-1">
                <p className={`text-xl font-bold ${
                  result.verdict === 'Phishing probable' ? 'text-destructive' :
                  result.verdict === 'Douteux' ? 'text-warning' : 'text-success'
                }`}>
                  {result.verdict}
                </p>
                <p className="text-sm text-muted-foreground">Score de suspicion : {result.score}/100</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className={`text-3xl font-bold font-mono ${
                  result.score >= 55 ? 'text-destructive' : result.score >= 25 ? 'text-warning' : 'text-success'
                }`}>{result.score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>

            {/* Barre */}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-4">
              <div
                className={`progress-bar ${
                  result.score >= 55 ? 'bg-destructive' : result.score >= 25 ? 'bg-warning' : 'bg-success'
                }`}
                style={{ width: `${result.score}%` }}
              />
            </div>
          </div>

          {/* Details */}
          {result.reasons.length > 0 && (
            <div className="card-cyber">
              <h3 className="text-sm font-semibold text-foreground mb-4">Problemes detectes</h3>
              <div className="space-y-3">
                {result.reasons.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-destructive text-xs font-bold">{i + 1}</span>
                    </div>
                    <span className="text-muted-foreground">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.reasons.length === 0 && (
            <div className="card-cyber border-success/30 bg-success/5">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <p className="text-sm text-success font-medium">Aucun signe suspect detecte. Cet e-mail semble legitime.</p>
              </div>
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
              <div key={i} className="card-cyber flex items-center justify-between py-3 px-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground truncate">{a.subject || a.sender}</p>
                  <p className="text-xs text-muted-foreground">{a.date}</p>
                </div>
                <span className={`badge-cyber shrink-0 ml-3 ${
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
