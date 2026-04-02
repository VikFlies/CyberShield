import { useState } from 'react';
import { useGlobalState } from '@/lib/state';
import { FileText, Download, Printer, X } from 'lucide-react';

const ReportModule = () => {
  const [showModal, setShowModal] = useState(false);
  const state = useGlobalState();

  // Calculs
  const avgQuiz = state.quizResults.length > 0
    ? Math.round(state.quizResults.reduce((s, r) => s + (r.score / r.total) * 100, 0) / state.quizResults.length)
    : null;

  const lastPw = state.passwordAnalyses.length > 0
    ? state.passwordAnalyses[state.passwordAnalyses.length - 1]
    : null;

  const avgPwScore = state.passwordAnalyses.length > 0
    ? Math.round(state.passwordAnalyses.reduce((s, p) => s + p.score, 0) / state.passwordAnalyses.length)
    : null;

  const totalPhishing = state.phishingAnalyses.length;
  const phishingDetected = state.phishingAnalyses.filter(a => a.verdict === 'Phishing probable').length;

  // Score global
  let globalScore = 0;
  let count = 0;
  if (avgQuiz !== null) { globalScore += avgQuiz; count++; }
  if (avgPwScore !== null) { globalScore += avgPwScore; count++; }
  if (count > 0) globalScore = Math.round(globalScore / count);

  // Recommandations
  const recommendations: string[] = [];
  if (avgPwScore !== null && avgPwScore < 60) recommendations.push('Améliorez la complexité de vos mots de passe (symboles, longueur).');
  if (avgQuiz !== null && avgQuiz < 60) recommendations.push('Renforcez vos connaissances en cybersécurité via des formations.');
  if (totalPhishing === 0) recommendations.push('Utilisez le détecteur de phishing pour vous entraîner à repérer les e-mails suspects.');
  if (phishingDetected > 0) recommendations.push('Restez vigilant face aux e-mails suspects. Vérifiez toujours l\'expéditeur.');
  recommendations.push('Activez l\'authentification à deux facteurs (2FA) sur tous vos comptes.');
  recommendations.push('Mettez à jour régulièrement vos logiciels et systèmes.');

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
        <h2 className="text-2xl font-bold text-foreground mb-2">📊 Rapport Personnalisé</h2>
        <p className="text-muted-foreground text-sm">
          Synthèse de votre niveau de cybersécurité basée sur vos interactions avec CyberShield.
        </p>
      </div>

      {!hasData ? (
        <div className="card-cyber text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground font-medium">Aucune donnée disponible</p>
          <p className="text-sm text-muted-foreground mt-1">
            Utilisez les différents modules pour générer votre rapport personnalisé.
          </p>
        </div>
      ) : (
        <>
          <button
            onClick={() => setShowModal(true)}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Générer mon rapport
          </button>

          {/* Aperçu rapide */}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-lg font-bold text-foreground">Rapport de Sécurité — CyberShield</h3>
                <p className="text-xs text-muted-foreground">SecureNova • {reportData.date} à {reportData.heure}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 print:p-0">
              {/* Score global */}
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-2">Score de cybersécurité global</p>
                <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full border-4 ${
                  globalScore >= 80 ? 'border-success' : globalScore >= 50 ? 'border-warning' : 'border-destructive'
                }`}>
                  <span className="text-3xl font-bold text-foreground font-mono">{globalScore}%</span>
                </div>
              </div>

              {/* Quiz */}
              {state.quizResults.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">🧠 Quiz de Sensibilisation</h4>
                  <div className="bg-secondary rounded-lg p-4 text-sm space-y-1">
                    <p className="text-muted-foreground">Sessions : <span className="text-foreground">{state.quizResults.length}</span></p>
                    <p className="text-muted-foreground">Score moyen : <span className="text-foreground">{avgQuiz}%</span></p>
                    <p className="text-muted-foreground">Meilleur score : <span className="text-primary">{state.quizTopScores[0]?.score ?? 0} pts</span></p>
                  </div>
                </div>
              )}

              {/* Mots de passe */}
              {state.passwordAnalyses.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">🔒 Mots de Passe</h4>
                  <div className="bg-secondary rounded-lg p-4 text-sm space-y-1">
                    <p className="text-muted-foreground">Analyses effectuées : <span className="text-foreground">{state.passwordAnalyses.length}</span></p>
                    <p className="text-muted-foreground">Score moyen : <span className="text-foreground">{avgPwScore}%</span></p>
                    <p className="text-muted-foreground">Dernier niveau : <span className="text-foreground">{lastPw?.level}</span></p>
                  </div>
                </div>
              )}

              {/* Phishing */}
              {totalPhishing > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">📧 Détection de Phishing</h4>
                  <div className="bg-secondary rounded-lg p-4 text-sm space-y-1">
                    <p className="text-muted-foreground">E-mails analysés : <span className="text-foreground">{totalPhishing}</span></p>
                    <p className="text-muted-foreground">Phishing détectés : <span className="text-destructive">{phishingDetected}</span></p>
                  </div>
                </div>
              )}

              {/* Recommandations */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">💡 Recommandations</h4>
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

            {/* Footer */}
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
