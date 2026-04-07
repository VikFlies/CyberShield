import { useState } from 'react';
import { useGlobalState } from '@/lib/state.js';
import { FileText, Download, Printer, X } from 'lucide-react';

const ReportModule = () => {
  const [showModal, setShowModal] = useState(false);
  const state = useGlobalState();

  const avgQuiz = state.quizResults.length > 0
    ? Math.round(state.quizResults.reduce((s, r) => s + ((r.correctCount ?? 0) / r.total) * 100, 0) / state.quizResults.length)
    : null;

  const lastPw = state.passwordAnalyses.length > 0
    ? state.passwordAnalyses[state.passwordAnalyses.length - 1]
    : null;

  const avgPwScore = state.passwordAnalyses.length > 0
    ? Math.round(state.passwordAnalyses.reduce((s, p) => s + p.score, 0) / state.passwordAnalyses.length)
    : null;

  const totalPhishing = state.phishingAnalyses.length;
  const phishingDetected = state.phishingAnalyses.filter(a => a.verdict === 'Phishing probable').length;

  let globalScore = 0;
  let count = 0;
  if (avgQuiz !== null) { globalScore += avgQuiz; count++; }
  if (avgPwScore !== null) { globalScore += avgPwScore; count++; }
  if (count > 0) globalScore = Math.round(globalScore / count);

  const recommendations = [];
  if (avgPwScore !== null && avgPwScore < 60) recommendations.push('Ameliorez la complexite de vos mots de passe (symboles, longueur).');
  if (avgQuiz !== null && avgQuiz < 60) recommendations.push('Renforcez vos connaissances en cybersecurite via des formations.');
  if (totalPhishing === 0) recommendations.push('Utilisez le detecteur de phishing pour vous entrainer a reperer les e-mails suspects.');
  if (phishingDetected > 0) recommendations.push('Restez vigilant face aux e-mails suspects. Verifiez toujours l\'expediteur.');
  recommendations.push('Activez l\'authentification a deux facteurs (2FA) sur tous vos comptes.');
  recommendations.push('Mettez a jour regulierement vos logiciels et systemes.');

  const reportData = {
    date: new Date().toLocaleDateString('fr-FR'),
    heure: new Date().toLocaleTimeString('fr-FR'),
    entreprise: 'SecureNova',
    plateforme: 'CyberShield',
    scoreGlobal: globalScore,
    quiz: { sessions: state.quizResults.length, scoreMoyen: avgQuiz },
    motsDePasse: { analyses: state.passwordAnalyses.length, scoreMoyen: avgPwScore },
    phishing: { analyses: totalPhishing, detected: phishingDetected },
    recommandations: recommendations,
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybershield-rapport-${reportData.date.replace(/\//g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  const hasData = state.quizResults.length > 0 || state.passwordAnalyses.length > 0 || state.phishingAnalyses.length > 0;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Rapport Personnalise</h2>
        <p className="text-muted-foreground text-sm">
          Synthese de votre niveau de cybersecurite basee sur vos interactions avec CyberShield.
        </p>
      </div>

      {!hasData ? (
        <div className="card-cyber text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground font-medium">Aucune donnee disponible</p>
          <p className="text-sm text-muted-foreground mt-1">
            Utilisez les differents modules pour generer votre rapport personnalise.
          </p>
        </div>
      ) : (
        <>
          <button
            onClick={() => setShowModal(true)}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Generer mon rapport
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card-cyber text-center">
              <p className="text-3xl font-bold text-primary font-mono">{globalScore}%</p>
              <p className="text-xs text-muted-foreground mt-1">Score global</p>
            </div>
            <div className="card-cyber text-center">
              <p className="text-3xl font-bold text-accent font-mono">{state.quizResults.length + state.passwordAnalyses.length + totalPhishing}</p>
              <p className="text-xs text-muted-foreground mt-1">Interactions</p>
            </div>
            <div className="card-cyber text-center">
              <p className="text-3xl font-bold text-warning font-mono">{recommendations.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Recommandations</p>
            </div>
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-lg font-bold text-foreground">Rapport de Securite — CyberShield</h3>
                <p className="text-xs text-muted-foreground">SecureNova - {reportData.date} a {reportData.heure}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 print:p-0">
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-3">Score de cybersecurite global</p>
                <div className={`score-circle w-28 h-28 ${
                  globalScore >= 80 ? 'score-high' : globalScore >= 50 ? 'score-mid' : 'score-low'
                }`}>
                  <span className="text-3xl font-bold text-foreground font-mono">{globalScore}%</span>
                </div>
              </div>

              {state.quizResults.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Quiz de Sensibilisation</h4>
                  <div className="bg-secondary rounded-lg p-4 text-sm space-y-1">
                    <p className="text-muted-foreground">Sessions : <span className="text-foreground">{state.quizResults.length}</span></p>
                    <p className="text-muted-foreground">Score moyen : <span className="text-foreground">{avgQuiz}%</span></p>
                    <p className="text-muted-foreground">Meilleur score : <span className="text-primary">{state.quizTopScores[0]?.score ?? 0} pts</span></p>
                  </div>
                </div>
              )}

              {state.passwordAnalyses.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Mots de Passe</h4>
                  <div className="bg-secondary rounded-lg p-4 text-sm space-y-1">
                    <p className="text-muted-foreground">Analyses effectuees : <span className="text-foreground">{state.passwordAnalyses.length}</span></p>
                    <p className="text-muted-foreground">Score moyen : <span className="text-foreground">{avgPwScore}%</span></p>
                    <p className="text-muted-foreground">Dernier niveau : <span className="text-foreground">{lastPw?.level}</span></p>
                  </div>
                </div>
              )}

              {totalPhishing > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Detection de Phishing</h4>
                  <div className="bg-secondary rounded-lg p-4 text-sm space-y-1">
                    <p className="text-muted-foreground">E-mails analyses : <span className="text-foreground">{totalPhishing}</span></p>
                    <p className="text-muted-foreground">Phishing detectes : <span className="text-destructive">{phishingDetected}</span></p>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Recommandations</h4>
                <div className="bg-secondary rounded-lg p-4">
                  <ol className="space-y-2">
                    {recommendations.map((r, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary font-bold">{i + 1}.</span>
                        {r}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-border">
              <button
                onClick={exportJSON}
                className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exporter JSON
              </button>
              <button
                onClick={printReport}
                className="flex-1 px-4 py-2.5 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportModule;
