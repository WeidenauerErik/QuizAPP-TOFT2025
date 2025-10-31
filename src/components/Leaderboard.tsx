import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Crown } from 'lucide-react';

interface User {
    username: string;
    visitor_id: string;
}

interface LeaderboardProps {
    user: User;
    onBack: () => void;
}

export default function Leaderboard({ user, onBack }: LeaderboardProps) {
    const [userRank, setUserRank] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadUserRank();
    }, []);

    const loadUserRank = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`https://localhost/getUserRank?visitor_id=${user.visitor_id}`);
            if (response.ok) {
                const data = await response.json();
                setUserRank(data.rank);
            } else {
                const errData = await response.json();
                setError(errData.error || 'Fehler beim Laden des Rangs');
            }
        } catch (err) {
            console.error('Error fetching user rank:', err);
            setError('Fehler beim Laden des Rangs');
        } finally {
            setIsLoading(false);
        }
    };

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Crown className="w-8 h-8 text-yellow-400" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-md bg-gradient-to-r from-purple-600 to-pink-600 px-6 pt-8 pb-16 rounded-2xl shadow-xl text-center">
                <button
                    onClick={onBack}
                    className="absolute top-6 left-6 p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all"
                >
                    <ArrowLeft className="w-6 h-6 text-white" />
                </button>

                <div className="flex items-center justify-center gap-2 mb-4">
                    <Trophy className="w-8 h-8 text-yellow-400" />
                    <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
                </div>

                {isLoading ? (
                    <p className="text-white text-lg mt-6">Lädt Rang...</p>
                ) : error ? (
                    <p className="text-red-400 text-lg mt-6">{error}</p>
                ) : userRank ? (
                    <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
                        <div className="flex items-center justify-center gap-3">
                            {getRankIcon(userRank)}
                            <span className="text-2xl font-bold text-white">
                                Dein Rang: #{userRank}
                            </span>
                        </div>
                        {userRank === 1 && (
                            <p className="text-yellow-300 font-semibold  mt-4">Herzlichen Glückwunsch, du bist auf Platz 1!</p>
                        )}
                    </div>
                ) : (
                    <p className="text-white text-lg mt-6">Noch keine Quizzes abgeschlossen</p>
                )}
            </div>
        </div>
    );
}
