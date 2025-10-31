import { useState } from 'react';
import { LogIn } from 'lucide-react';

interface LoginProps {
    onLogin: (username: string, visitorId: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim()) {
            setError('Bitte gib einen Benutzernamen ein');
            return;
        }

        setIsLoading(true);
        setError('');

        const visitor_id = crypto.randomUUID();

        onLogin(username.trim(), visitor_id);

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
                    <div className="flex justify-center mb-8">
                        <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-4 rounded-2xl shadow-lg">
                            <LogIn className="w-12 h-12 text-white" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-center text-white mb-2">
                        Quiz App
                    </h1>
                    <p className="text-center text-slate-300 mb-8">
                        Willkommen! Melde dich an, um zu starten.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-200 mb-2">
                                Benutzername
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                                placeholder="Dein Name"
                                disabled={isLoading}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                        >
                            {isLoading ? 'Wird geladen...' : 'Anmelden'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
