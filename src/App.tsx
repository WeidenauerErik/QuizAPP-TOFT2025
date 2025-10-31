import { useState, useEffect } from 'react';
import Login from './components/Login';
import MainPage from './components/MainPage';
import Leaderboard from './components/Leaderboard';
import {QuizPage} from './components/QuizPage';

type Page = 'main' | 'leaderboard' | 'quiz';

interface User {
  username: string;
  visitor_id: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('main');
  const [currentQuizId, setCurrentQuizId] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedVisitorId = localStorage.getItem('visitor_id');

    if (storedUsername && storedVisitorId) {
      setUser({ username: storedUsername, visitor_id: storedVisitorId });
    }
  }, []);

  const handleLogin = (username: string, visitorId: string) => {
    localStorage.setItem('username', username);
    localStorage.setItem('visitor_id', visitorId);
    setUser({ username, visitor_id: visitorId });
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('visitor_id');
    setUser(null);
    setCurrentPage('main');
  };

  const navigateToQuiz = (quizId: string) => {
    setCurrentQuizId(quizId);
    setCurrentPage('quiz');
  };

  const navigateToMain = () => {
    setCurrentPage('main');
    setCurrentQuizId(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {currentPage === 'main' && (
        <MainPage
          user={user}
          onNavigateToLeaderboard={() => setCurrentPage('leaderboard')}
          onNavigateToQuiz={navigateToQuiz}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'leaderboard' && (
        <Leaderboard
          user={user}
          onBack={() => setCurrentPage('main')}
        />
      )}
      {currentPage === 'quiz' && currentQuizId && (
        <QuizPage
          user={user}
          quizId={currentQuizId}
          onBack={navigateToMain}
        />
      )}
    </div>
  );
}

export default App;
