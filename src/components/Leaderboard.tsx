import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Medal, Crown } from 'lucide-react';

interface User {
  username: string;
  visitor_id: string;
}

interface LeaderboardEntry {
  username: string;
  visitor_id: string;
  total_score: number;
  quizzes_completed: number;
}

interface LeaderboardProps {
  user: User;
  onBack: () => void;
}

export default function Leaderboard({ user, onBack }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost/getLeaderboard');
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard || []);

        const rank = data.leaderboard.findIndex(
          (entry: LeaderboardEntry) => entry.visitor_id === user.visitor_id
        );
        if (rank !== -1) {
          setUserRank(rank + 1);
        }
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-slate-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankClass = (position: number, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return 'bg-cyan-500/20 border-cyan-400/50';
    }
    switch (position) {
      case 1:
        return 'bg-yellow-500/10 border-yellow-400/30';
      case 2:
        return 'bg-slate-300/10 border-slate-300/30';
      case 3:
        return 'bg-amber-600/10 border-amber-600/30';
      default:
        return 'bg-white/5 border-white/10';
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 pt-8 pb-24 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all mr-4"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
            <p className="text-purple-100">Top 10 Quiz-Champions</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <span className="text-2xl font-bold text-white">Bestenliste</span>
        </div>
      </div>

      <div className="px-6 -mt-16">
        {userRank && userRank > 10 && (
          <div className="bg-cyan-500/20 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-cyan-400/50 mb-4">
            <p className="text-center text-white font-semibold">
              Dein Rang: #{userRank}
            </p>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
          {isLoading ? (
            <div className="text-center py-8 text-slate-300">Wird geladen...</div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-300">Noch keine Einträge vorhanden</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.slice(0, 10).map((entry, index) => {
                const position = index + 1;
                const isCurrentUser = entry.visitor_id === user.visitor_id;

                return (
                  <div
                    key={entry.visitor_id}
                    className={`rounded-xl p-4 border transition-all ${getRankClass(
                      position,
                      isCurrentUser
                    )} ${isCurrentUser ? 'ring-2 ring-cyan-400' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 flex-shrink-0">
                        {getRankIcon(position) || (
                          <span className="text-lg font-bold text-white">#{position}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white truncate">
                            {entry.username}
                          </h3>
                          {isCurrentUser && (
                            <span className="text-xs bg-cyan-500 text-white px-2 py-1 rounded-full">
                              Du
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400">
                          {entry.quizzes_completed} Quiz{entry.quizzes_completed !== 1 ? 'ze' : ''}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">
                          {entry.total_score}
                        </div>
                        <div className="text-xs text-slate-400">Punkte</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
