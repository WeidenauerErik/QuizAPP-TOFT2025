import { useState, useEffect } from 'react';
import { QrCode, Trophy, LogOut, CheckCircle2 } from 'lucide-react';
import QRScanner from './QRScanner';

interface User {
  username: string;
  visitor_id: string;
}

interface CompletedQuiz {
  quiz_id: string;
  quiz_title: string;
  score: number;
  max_score: number;
  completed_at: string;
}

interface MainPageProps {
  user: User;
  onNavigateToLeaderboard: () => void;
  onNavigateToQuiz: (quizId: string) => void;
  onLogout: () => void;
}

export default function MainPage({
  user,
  onNavigateToLeaderboard,
  onNavigateToQuiz,
  onLogout,
}: MainPageProps) {
  const [completedQuizzes, setCompletedQuizzes] = useState<CompletedQuiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    loadCompletedQuizzes();
  }, [user.visitor_id]);

  const loadCompletedQuizzes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost/getCompletedQuizzes?visitor_id=${user.visitor_id}`);
      if (response.ok) {
        const data = await response.json();
        setCompletedQuizzes(data.quizzes || []);
      }
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQRScan = (quizId: string) => {
    setShowScanner(false);
    onNavigateToQuiz(quizId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (showScanner) {
    return <QRScanner onScan={handleQRScan} onClose={() => setShowScanner(false)} />;
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 pt-8 pb-24 rounded-b-[2rem] shadow-xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Hallo, {user.username}!</h1>
            <p className="text-cyan-100">Bereit für ein Quiz?</p>
          </div>
          <button
            onClick={onLogout}
            className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all"
            title="Abmelden"
          >
            <LogOut className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={() => setShowScanner(true)}
            className="flex-1 bg-white text-blue-600 font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <QrCode className="w-6 h-6" />
            <span>QR-Code scannen</span>
          </button>

          <button
            onClick={onNavigateToLeaderboard}
            className="bg-white/20 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:bg-white/30 transition-all"
            title="Leaderboard"
          >
            <Trophy className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="px-6 -mt-16">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            Abgeschlossene Quizzes
          </h2>

          {isLoading ? (
            <div className="text-center py-8 text-slate-300">Wird geladen...</div>
          ) : completedQuizzes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-300 mb-2">Noch keine Quizzes absolviert</p>
              <p className="text-slate-400 text-sm">Scanne einen QR-Code, um zu starten!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedQuizzes.map((quiz) => (
                <div
                  key={quiz.quiz_id}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white">{quiz.quiz_title}</h3>
                    <span className="text-xs text-slate-400">{formatDate(quiz.completed_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-full transition-all"
                        style={{ width: `${(quiz.score / quiz.max_score) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {quiz.score}/{quiz.max_score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
