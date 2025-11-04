import { useEffect, useRef, useState } from "react";

interface QRScannerProps {
    onScan: (quizId: string) => void;
    onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
    const [manualInput, setManualInput] = useState("");
    const [cameraError, setCameraError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: { ideal: "environment" } },
                    audio: false,
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;

                    // Warten, bis Metadaten geladen sind (dann kann .play() sicher aufgerufen werden)
                    videoRef.current.onloadedmetadata = async () => {
                        try {
                            await videoRef.current?.play();
                        } catch (playErr) {
                            console.warn("Konnte Video nicht automatisch abspielen:", playErr);
                        }
                    };
                }
            } catch (err) {
                console.error("Fehler beim Zugriff auf Kamera:", err);
                setCameraError(
                    "Kamera konnte nicht gestartet werden. Bitte erlaube den Kamerazugriff."
                );
            }
        };

        startCamera();

        // Cleanup bei Unmount
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

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
                    ✕
                </button>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-6">
                <div className="aspect-square bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 border-4 border-dashed border-white/20 overflow-hidden relative">
                    {cameraError ? (
                        <p className="text-red-400 text-center text-sm">{cameraError}</p>
                    ) : (
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover rounded-2xl"
                            playsInline
                            muted
                        />
                    )}
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
                    <label
                        htmlFor="quizId"
                        className="block text-sm font-medium text-slate-200 mb-2"
                    >
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
