import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';

interface User {
  username: string;
  visitor_id: string;
}

interface Question {
  question_id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
}

interface Quiz {
  quiz_id: string;
  quiz_title: string;
  questions: Question[];
}

interface QuizPageProps {
  user: User;
  quizId: string;
  onBack: () => void;
}

export default function QuizPage({ user, quizId, onBack }: QuizPageProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost/getQuiz?quiz_id=${quizId}`);
      if (response.ok) {
        const data = await response.json();
        setQuiz(data.quiz);
        setSelectedAnswers(new Array(data.quiz.questions.length).fill(-1));
      } else {
        setError('Quiz konnte nicht geladen werden');
      }
    } catch (err) {
      setError('Fehler beim Laden des Quiz');
      console.error('Error loading quiz:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isSubmitted) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    let calculatedScore = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        calculatedScore++;
      }
    });

    setScore(calculatedScore);
    setIsSubmitted(true);

    try {
      await fetch('http://localhost/submitQuiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitor_id: user.visitor_id,
          quiz_id: quizId,
          score: calculatedScore,
          max_score: quiz.questions.length,
        }),
      });
    } catch (err) {
      console.error('Error submitting quiz:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-spin" />
          <p className="text-white text-lg">Lädt Quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Fehler</h2>
          <p className="text-slate-300 mb-6">{error || 'Quiz nicht gefunden'}</p>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all"
          >
            Zurück
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  if (isSubmitted) {
    const percentage = (score / quiz.questions.length) * 100;

    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center">
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">Quiz abgeschlossen!</h2>
            <p className="text-slate-300 mb-6">Gut gemacht, {user.username}!</p>

            <div className="bg-white/5 rounded-2xl p-6 mb-6">
              <div className="text-6xl font-bold text-white mb-2">
                {score}/{quiz.questions.length}
              </div>
              <div className="text-slate-300">Punkte erreicht</div>

              <div className="mt-4 bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            <button
              onClick={onBack}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
            >
              Zurück zur Übersicht
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 pt-8 pb-16 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all mr-4"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{quiz.quiz_title}</h1>
            <p className="text-purple-100 text-sm">
              Frage {currentQuestionIndex + 1} von {quiz.questions.length}
            </p>
          </div>
        </div>

        <div className="bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-white h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="px-6 -mt-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">{currentQuestion.question_text}</h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-xl transition-all border-2 ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? 'bg-cyan-500/30 border-cyan-400 shadow-lg'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? 'border-cyan-400 bg-cyan-400'
                        : 'border-white/30'
                    }`}
                  >
                    {selectedAnswers[currentQuestionIndex] === index && (
                      <div className="w-3 h-3 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-white">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex-1 bg-white/10 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-white/20"
          >
            Zurück
          </button>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswers.includes(-1)}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              Abgeben
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
            >
              Weiter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
