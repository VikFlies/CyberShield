import { useState, useEffect, useRef, useCallback } from 'react';
import { quizQuestions } from '@/lib/quiz-data.js';
import { updateState, getState } from '@/lib/state.js';
import { Timer, Trophy, Zap, Info } from 'lucide-react';

const QuizModule = () => {
  const [phase, setPhase] = useState('setup');
  const [playerName, setPlayerName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [categories, setCategories] = useState({});
  const timerRef = useRef(null);

  const startQuiz = () => {
    const shuffled = [...quizQuestions]
      .sort(() => Math.random() - 0.5)
      .filter((_, i) => i < 10);
    setQuestions(shuffled);
    setCurrentIdx(0);
    setScore(0);
    setCorrectCount(0);
    setStreak(0);
    setAnswered(null);
    setCategories({});
    setPhase('playing');
    setTimeLeft(20);
  };

  useEffect(() => {
    if (phase !== 'playing' || answered !== null) return;
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAnswer(-1);
          return 20;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, currentIdx, answered]);

  const handleAnswer = useCallback((idx) => {
    if (answered !== null) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setAnswered(idx);

    const q = questions[currentIdx];
    const isCorrect = idx === q.correct;
    const timeBonus = Math.max(0, Math.floor(timeLeft / 2));

    setCategories(prev => {
      const cat = prev[q.category] || { correct: 0, total: 0 };
      return {
        ...prev,
        [q.category]: {
          correct: cat.correct + (isCorrect ? 1 : 0),
          total: cat.total + 1,
        },
      };
    });

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      let points = 100 + timeBonus * 10;
      if (newStreak >= 3) points = Math.floor(points * 1.5);
      setScore(prev => prev + points);
    } else {
      setStreak(0);
    }
  }, [answered, currentIdx, questions, streak, timeLeft]);

  const nextQuestion = () => {
    if (currentIdx + 1 >= questions.length) {
      finishQuiz();
    } else {
      setCurrentIdx(prev => prev + 1);
      setAnswered(null);
      setTimeLeft(20);
    }
  };

  const finishQuiz = () => {
    setPhase('result');
    const result = {
      score,
      correctCount,
      total: questions.length,
      date: new Date().toLocaleDateString('fr-FR'),
      categories,
      playerName: playerName || 'Anonyme',
    };
    const st = getState();
    const allResults = [...st.quizResults, result];
    const topScores = [...st.quizTopScores, result]
      .sort((a, b) => b.score - a.score)
      .filter((_, i) => i < 5);
    updateState({ quizResults: allResults, quizTopScores: topScores });
  };

  const q = questions[currentIdx];

  const getRecommendations = () => {
    const recs = [];
    Object.entries(categories).forEach(([cat, data]) => {
      if (data.total > 0 && data.correct / data.total < 0.5) {
        recs.push(`Renforcez vos connaissances en "${cat}"`);
      }
    });
    if (recs.length === 0) recs.push('Excellent niveau ! Continuez a vous former.');
    return recs;
  };

  if (phase === 'setup') {
    return (
      <div className="space-y-6 max-w-lg">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Quiz de Sensibilisation</h2>
          <p className="text-muted-foreground text-sm">
            Testez vos connaissances en cybersecurite avec 10 questions aleatoires.
          </p>
        </div>

        <div className="card-cyber flex gap-3">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p>- <strong className="text-foreground">Timer</strong> : 20 secondes par question</p>
            <p>- <strong className="text-foreground">Bonus rapidite</strong> : repondez vite pour plus de points</p>
            <p>- <strong className="text-foreground">Streak</strong> : 3 bonnes reponses consecutives = +50% de points</p>
          </div>
        </div>

        <input
          value={playerName}
          onChange={e => setPlayerName(e.target.value)}
          placeholder="Votre nom (optionnel)"
          className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button
          onClick={startQuiz}
          className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Lancer le Quiz
        </button>
      </div>
    );
  }

  if (phase === 'result') {
    const st = getState();
    const pct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

    return (
      <div className="space-y-6 max-w-lg">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-warning mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground">Quiz termine !</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="card-cyber text-center">
            <p className="text-3xl font-bold text-primary font-mono">{score}</p>
            <p className="text-muted-foreground text-xs mt-1">points</p>
          </div>
          <div className="card-cyber text-center">
            <p className={`text-3xl font-bold font-mono ${pct >= 70 ? 'text-success' : pct >= 40 ? 'text-warning' : 'text-destructive'}`}>{pct}%</p>
            <p className="text-muted-foreground text-xs mt-1">{correctCount}/{questions.length} bonnes reponses</p>
          </div>
        </div>

        <div className="card-cyber space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Detail par categorie</h3>
          {Object.entries(categories).map(([cat, data]) => (
            <div key={cat} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{cat}</span>
              <span className={`text-sm font-medium ${
                data.correct / data.total >= 0.5 ? 'text-success' : 'text-destructive'
              }`}>
                {data.correct}/{data.total}
              </span>
            </div>
          ))}
        </div>

        <div className="card-cyber border-primary/30">
          <h3 className="text-sm font-semibold text-foreground mb-2">Recommandations</h3>
          <ul className="space-y-1">
            {getRecommendations().map((r, i) => (
              <li key={i} className="text-sm text-muted-foreground">- {r}</li>
            ))}
          </ul>
        </div>

        {st.quizTopScores.length > 0 && (
          <div className="card-cyber overflow-hidden p-0">
            <h3 className="text-sm font-semibold text-foreground p-4 pb-2">Classement</h3>
            <table className="w-full text-sm">
              <tbody>
                {st.quizTopScores.map((r, i) => (
                  <tr key={i} className="border-t border-border/30">
                    <td className="p-3 font-mono text-primary">{i + 1}</td>
                    <td className="p-3 text-foreground">{r.playerName}</td>
                    <td className="p-3 text-primary font-bold text-right">{r.score} pts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={() => setPhase('setup')}
          className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Rejouer
        </button>
      </div>
    );
  }

  // Playing
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Question {currentIdx + 1}/{questions.length}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground">{q.difficulty}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">{q.category}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {streak >= 3 && (
            <div className="flex items-center gap-1 text-warning">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-bold">Streak x{streak}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Timer className={`w-5 h-5 ${timeLeft <= 5 ? 'text-destructive' : 'text-primary'}`} />
            <span className={`font-mono font-bold ${timeLeft <= 5 ? 'text-destructive' : 'text-foreground'}`}>{timeLeft}s</span>
          </div>
          <div className="text-right">
            <span className="text-primary font-bold font-mono">{score}</span>
            <span className="text-xs text-muted-foreground ml-1">pts</span>
          </div>
        </div>
      </div>

      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 linear ${timeLeft <= 5 ? 'bg-destructive' : 'bg-primary/50'}`}
          style={{ width: `${(timeLeft / 20) * 100}%` }}
        />
      </div>

      <div className="card-cyber">
        <p className="text-lg font-semibold text-foreground">{q.question}</p>
      </div>

      <div className="space-y-3">
        {q.options.map((opt, i) => {
          let optClass = 'card-cyber cursor-pointer hover:border-primary/50';
          if (answered !== null) {
            if (i === q.correct) optClass = 'card-cyber border-success bg-success/5';
            else if (i === answered) optClass = 'card-cyber border-destructive bg-destructive/5';
            else optClass = 'card-cyber opacity-50';
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={answered !== null}
              className={`${optClass} w-full text-left`}
            >
              <span className="text-sm text-foreground">{opt}</span>
            </button>
          );
        })}
      </div>

      {answered !== null && (
        <div className="card-cyber border-primary/30">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Explication :</strong> {q.explanation}
          </p>
          <button
            onClick={nextQuestion}
            className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {currentIdx + 1 >= questions.length ? 'Voir les resultats' : 'Question suivante'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizModule;
