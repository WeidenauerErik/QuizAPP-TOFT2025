import { useState } from 'react';
import { X, QrCode } from 'lucide-react';

interface QRScannerProps {
  onScan: (quizId: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [manualInput, setManualInput] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScan(manualInput.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">QR-Code scannen</h1>
        <button
          onClick={onClose}
          className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-6">
        <div className="aspect-square bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 border-4 border-dashed border-white/20">
          <div className="text-center">
            <QrCode className="w-24 h-24 text-white/30 mx-auto mb-4" />
            <p className="text-slate-400 text-sm">Kamera-Scanner hier integrieren</p>
            <p className="text-slate-500 text-xs mt-2">
              (z.B. mit html5-qrcode Library)
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-slate-800/50 text-slate-300">oder</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleManualSubmit} className="space-y-4">
        <div>
          <label htmlFor="quizId" className="block text-sm font-medium text-slate-200 mb-2">
            Quiz-ID manuell eingeben
          </label>
          <input
            type="text"
            id="quizId"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            placeholder="Quiz-ID eingeben..."
          />
        </div>

        <button
          type="submit"
          disabled={!manualInput.trim()}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          Quiz starten
        </button>
      </form>
    </div>
  );
}
