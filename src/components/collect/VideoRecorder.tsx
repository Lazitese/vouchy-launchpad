import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Video,
    Square,
    RotateCcw,
    Send,
    Star,
    ChevronRight,
    Mic,
    Camera,
    CameraOff,
    MicOff,
    X,
    Loader2,
} from "lucide-react";
import { AIScriptGenerator } from "@/components/features/AIScriptGenerator";
import { TextMagic } from "@/components/features/TextMagic";
import { useRecorder } from "@/hooks/useRecorder";

interface VideoRecorderProps {
    questions: string[];
    canUseAI: boolean;
    onSubmit: (formData: {
        name: string;
        email: string;
        company?: string;
        title?: string;
        rating: number;
    }, blob: Blob) => void;
    onBack: () => void;
    submitting: boolean;
}

export const VideoRecorder = ({
    questions,
    canUseAI,
    onSubmit,
    onBack,
    submitting,
}: VideoRecorderProps) => {
    const {
        videoRef,
        isRecording,
        recordedBlob,
        cameraEnabled,
        micEnabled,
        isCountdownActive,
        countDown,
        setRecordedBlob,
        toggleCamera,
        toggleMic,
        startTeleprompterSession,
        stopRecording,
        retakeRecording,
        initCamera,
    } = useRecorder();

    useEffect(() => {
        initCamera();
    }, []);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [teleprompterScript, setTeleprompterScript] = useState<string | null>(null);
    const [showScriptEditor, setShowScriptEditor] = useState(false);
    const [showVideoForm, setShowVideoForm] = useState(false);
    const [videoFormData, setVideoFormData] = useState({
        name: "",
        email: "",
        company: "",
        title: "",
        rating: 5,
    });

    const handleSubmit = () => {
        if (!recordedBlob) return;
        onSubmit(videoFormData, recordedBlob);
    };

    const handleRetake = () => {
        retakeRecording();
        setCurrentQuestion(0);
        setShowVideoForm(false);
    };

    const handleBackToOptions = () => {
        onBack();
        setRecordedBlob(null);
        setCurrentQuestion(0);
        setTeleprompterScript(null);
        setShowScriptEditor(false);
    };

    return (
        <motion.div
            className="w-full max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            {/* Script Tools - Above video */}
            {!recordedBlob && !isRecording && !isCountdownActive && (
                <div className="mb-6">
                    {!showScriptEditor ? (
                        <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-card border border-border/[0.08] rounded-xl gap-4 md:gap-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Mic className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-primary">Need a script?</h3>
                                    <p className="text-sm text-subtext">Write your own or use AI to generate one.</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setShowScriptEditor(true)}
                                className="gap-2"
                            >
                                Open Script Editor
                            </Button>
                        </div>
                    ) : (
                        <div className="p-4 bg-card border border-border/[0.08] rounded-xl">
                            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4 md:gap-0">
                                <h3 className="font-semibold text-primary">Teleprompter Script</h3>
                                <div className="flex gap-2">
                                    <AIScriptGenerator
                                        questions={questions}
                                        onScriptGenerated={(script) => setTeleprompterScript(script)}
                                        isLocked={!canUseAI}
                                    />
                                    {teleprompterScript && (
                                        <TextMagic
                                            text={teleprompterScript}
                                            onTextUpdated={setTeleprompterScript}
                                            isLocked={!canUseAI}
                                        />
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowScriptEditor(false)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <Textarea
                                placeholder="Write your script here, or use the AI tools above to generate one..."
                                value={teleprompterScript || ""}
                                onChange={(e) => setTeleprompterScript(e.target.value)}
                                className="min-h-[150px] mb-2 font-medium text-base leading-relaxed"
                            />
                            <p className="text-xs text-subtext text-right">
                                This text will scroll on screen while you record.
                            </p>
                        </div>
                    )}
                </div>
            )}

            <div className="relative">
                {/* Video Container */}
                <div className="relative aspect-[4/3] md:aspect-video w-full max-w-full bg-gray-900 rounded-[16px] overflow-hidden shadow-2xl">
                    {recordedBlob ? (
                        <video
                            src={URL.createObjectURL(recordedBlob)}
                            controls
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover transform scale-x-[-1]"
                        />
                    )}

                    {/* Countdown Overlay */}
                    <AnimatePresence>
                        {isCountdownActive && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.5 }}
                                className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                            >
                                <motion.span
                                    key={countDown}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1.2 }}
                                    exit={{ opacity: 0 }}
                                    className="text-9xl font-black text-white drop-shadow-2xl"
                                >
                                    {countDown}
                                </motion.span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Teleprompter Overlay */}
                    {isRecording && (
                        <motion.div
                            className="absolute inset-x-0 top-0 p-8 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {teleprompterScript ? (
                                <div className="max-h-[40vh] overflow-y-auto scrollbar-hide mask-linear-fade">
                                    <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-3">TELEPROMPTER</p>
                                    <p className="text-2xl md:text-3xl font-medium text-white/95 whitespace-pre-wrap leading-relaxed drop-shadow-md text-center">
                                        {teleprompterScript}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center mt-4">
                                    <p className="text-xs text-white/60 uppercase tracking-wider mb-2">
                                        Question {currentQuestion + 1} of {questions.length}
                                    </p>
                                    <motion.p
                                        key={currentQuestion}
                                        className="text-2xl md:text-3xl font-bold text-white drop-shadow-md"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        {questions[currentQuestion]}
                                    </motion.p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Recording indicator */}
                    {isRecording && (
                        <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 bg-red-500/90 backdrop-blur-md rounded-full shadow-lg border border-white/10">
                            <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                            <span className="text-xs font-bold text-white tracking-wide">REC</span>
                        </div>
                    )}

                    {/* Camera controls */}
                    {!recordedBlob && !isCountdownActive && !isRecording && (
                        <div className="absolute bottom-6 left-6 flex gap-2">
                            <button
                                onClick={toggleCamera}
                                className={`p-3 rounded-full transition-all duration-300 backdrop-blur-md ${cameraEnabled ? "bg-white/10 hover:bg-white/20 text-white" : "bg-red-500 text-white shadow-lg"
                                    }`}
                            >
                                {cameraEnabled ? (
                                    <Camera className="w-5 h-5" />
                                ) : (
                                    <CameraOff className="w-5 h-5" />
                                )}
                            </button>
                            <button
                                onClick={toggleMic}
                                className={`p-3 rounded-full transition-all duration-300 backdrop-blur-md ${micEnabled ? "bg-white/10 hover:bg-white/20 text-white" : "bg-red-500 text-white shadow-lg"
                                    }`}
                            >
                                {micEnabled ? (
                                    <Mic className="w-5 h-5" />
                                ) : (
                                    <MicOff className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Video form for name/email after recording */}
                {recordedBlob && showVideoForm && (
                    <div className="mt-6 p-6 bg-card border border-border/[0.08] rounded-[12px]">
                        <h3 className="font-semibold text-primary mb-4">Almost done! Tell us about yourself</h3>

                        {/* Star Rating */}
                        <div className="flex justify-center gap-2 mb-6">
                            <p className="text-sm text-subtext mr-3">Your rating:</p>
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <motion.button
                                    key={rating}
                                    type="button"
                                    onClick={() => setVideoFormData({ ...videoFormData, rating })}
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-1 transition-transform"
                                >
                                    <Star
                                        className={`w-7 h-7 transition-all duration-200 ${rating <= videoFormData.rating
                                            ? "text-amber-400 fill-amber-400"
                                            : "text-border/30 hover:text-amber-300"
                                            }`}
                                    />
                                </motion.button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                placeholder="Your name *"
                                value={videoFormData.name}
                                onChange={(e) => setVideoFormData({ ...videoFormData, name: e.target.value })}
                                maxLength={100}
                            />
                            <Input
                                type="email"
                                placeholder="Email address *"
                                value={videoFormData.email}
                                onChange={(e) => setVideoFormData({ ...videoFormData, email: e.target.value })}
                                maxLength={255}
                            />
                            <Input
                                placeholder="Job title (optional)"
                                value={videoFormData.title}
                                onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                                maxLength={100}
                            />
                            <Input
                                placeholder="Company (optional)"
                                value={videoFormData.company}
                                onChange={(e) => setVideoFormData({ ...videoFormData, company: e.target.value })}
                                maxLength={100}
                            />
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mt-8">
                    {recordedBlob ? (
                        <>
                            {!showVideoForm ? (
                                <>
                                    {/* Review Step - Just recorded */}
                                    <Button variant="outline" onClick={handleRetake} className="gap-2 h-12 px-6">
                                        <RotateCcw className="w-4 h-4" />
                                        Record Again
                                    </Button>
                                    <Button
                                        variant="hero"
                                        onClick={() => setShowVideoForm(true)}
                                        className="gap-2 h-12 px-6"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                        Continue
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {/* Form Step - Ready to submit */}
                                    <Button variant="outline" onClick={handleRetake} className="gap-2 h-12 px-6">
                                        <RotateCcw className="w-4 h-4" />
                                        Retake
                                    </Button>
                                    <Button
                                        variant="hero"
                                        onClick={handleSubmit}
                                        className="gap-2 h-12 px-6"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Submit Video
                                            </>
                                        )}
                                    </Button>
                                </>
                            )}
                        </>
                    ) : (
                        !isCountdownActive && (
                            <button
                                onClick={isRecording ? stopRecording : startTeleprompterSession}
                                className={`group relative flex items-center justify-center transition-all duration-300 hover:scale-105 ${isRecording
                                    ? "w-16 h-16 rounded-[20px] bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20"
                                    : "w-20 h-20 rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20"
                                    }`}
                            >
                                {/* Button Ring Animation */}
                                {!isRecording && (
                                    <span className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping group-hover:border-primary/50" />
                                )}

                                {isRecording ? (
                                    <Square className="w-6 h-6 text-white fill-white" />
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <Video className="w-8 h-8 text-white mb-0.5 ml-0.5" />
                                    </div>
                                )}
                            </button>
                        )
                    )}
                </div>

                {!recordedBlob && !isCountdownActive && !isRecording && (
                    <p className="text-center mt-4 text-sm font-medium text-subtext">
                        Tap to start recording
                    </p>
                )}

                <button
                    onClick={handleBackToOptions}
                    className="block mx-auto mt-8 text-sm text-subtext hover:text-primary transition-colors"
                >
                    ← Back to options
                </button>
            </div>
        </motion.div>
    );
};
