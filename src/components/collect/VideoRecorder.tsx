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
        testimonial?: string;
        rating: number;
    }, blob: Blob) => void;
    onBack: () => void;
    submitting: boolean;
    spaceId?: string;
}

export const VideoRecorder = ({
    questions,
    canUseAI,
    onSubmit,
    onBack,
    submitting,
    spaceId,
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
    const teleprompterRef = useRef<HTMLDivElement>(null);
    const [videoFormData, setVideoFormData] = useState({
        name: "",
        email: "",
        company: "",
        title: "",
        testimonial: "",
        rating: 5,
    });

    // Auto-scroll teleprompter when recording
    useEffect(() => {
        if (isRecording && teleprompterScript && teleprompterRef.current) {
            const element = teleprompterRef.current;
            const scrollHeight = element.scrollHeight - element.clientHeight;

            // Calculate scroll duration based on script length (approx 150 words per minute reading speed)
            const words = teleprompterScript.split(/\s+/).length;
            const readingTimeMs = (words / 150) * 60 * 1000; // Convert to milliseconds
            const minDuration = 15000; // Minimum 15 seconds
            const duration = Math.max(readingTimeMs, minDuration);

            let startTime: number;
            let animationId: number;

            const scroll = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Smooth easing function
                const easeProgress = progress;
                element.scrollTop = easeProgress * scrollHeight;

                if (progress < 1) {
                    animationId = requestAnimationFrame(scroll);
                }
            };

            // Start scrolling after a small delay
            const timeoutId = setTimeout(() => {
                animationId = requestAnimationFrame(scroll);
            }, 1000);

            return () => {
                clearTimeout(timeoutId);
                if (animationId) cancelAnimationFrame(animationId);
            };
        }
    }, [isRecording, teleprompterScript]);

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
                        <div className="flex flex-col md:flex-row items-center justify-between organic-card p-4 gap-4 md:gap-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Mic className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-zinc-900">Need a script?</h3>
                                    <p className="text-sm text-zinc-500">Write your own or use AI to generate one.</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setShowScriptEditor(true)}
                                className="gap-2 border-zinc-200 hover:bg-zinc-50 hover:text-primary"
                            >
                                Open Script Editor
                            </Button>
                        </div>
                    ) : (
                        <div className="organic-card p-4 shadow-sm">
                            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4 md:gap-0">
                                <h3 className="font-semibold text-zinc-900">Teleprompter Script</h3>
                                <div className="flex gap-2">
                                    <AIScriptGenerator
                                        questions={questions}
                                        onScriptGenerated={(script) => setTeleprompterScript(script)}
                                        isLocked={!canUseAI}
                                        spaceId={spaceId}
                                    />
                                    {teleprompterScript && (
                                        <TextMagic
                                            text={teleprompterScript}
                                            onTextUpdated={setTeleprompterScript}
                                            isLocked={!canUseAI}
                                            spaceId={spaceId}
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
                                className="min-h-[150px] mb-2 font-medium text-base leading-relaxed bg-zinc-50 border-zinc-200 focus:border-primary focus:ring-primary/20"
                            />
                            <p className="text-xs text-zinc-400 text-right">
                                This text will scroll on screen while you record.
                            </p>
                        </div>
                    )}
                </div>
            )}

            <div className="relative">
                {/* Video Container */}
                <div className="relative aspect-[4/3] md:aspect-video w-full max-w-full bg-black rounded-[16px] overflow-hidden shadow-2xl">
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

                    {/* Teleprompter Overlay - Redesigned */}
                    {isRecording && (
                        <motion.div
                            className="absolute inset-0 pointer-events-none flex flex-col"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {teleprompterScript ? (
                                <>
                                    {/* Top gradient fade */}
                                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/90 via-black/60 to-transparent z-10" />

                                    {/* Teleprompter content - centered card style */}
                                    <div className="flex-1 flex items-start justify-center pt-6 px-6">
                                        <div className="w-full max-w-2xl">
                                            {/* Scrolling container with ref for auto-scroll */}
                                            <div
                                                ref={teleprompterRef}
                                                className="max-h-[35vh] overflow-y-auto scrollbar-none"
                                                style={{
                                                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                                                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
                                                }}
                                            >
                                                {/* Extra padding at top for smooth scroll start */}
                                                <div className="h-8" />

                                                <p className="text-xl md:text-2xl lg:text-3xl font-medium text-white text-center leading-relaxed tracking-wide px-4"
                                                    style={{
                                                        textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)'
                                                    }}
                                                >
                                                    {teleprompterScript}
                                                </p>

                                                {/* Extra padding at bottom for smooth scroll end */}
                                                <div className="h-24" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom gradient fade */}
                                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                </>
                            ) : (
                                /* Question display when no script */
                                <div className="flex-1 flex items-start justify-center pt-12">
                                    <div className="text-center px-6">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full mb-4">
                                            <span className="text-xs text-white/70 uppercase tracking-wider font-medium">
                                                Question {currentQuestion + 1} of {questions.length}
                                            </span>
                                        </div>
                                        <motion.p
                                            key={currentQuestion}
                                            className="text-2xl md:text-3xl font-bold text-white max-w-xl mx-auto"
                                            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            {questions[currentQuestion]}
                                        </motion.p>
                                    </div>
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
                    <div className="mt-6 organic-card p-6 shadow-sm">
                        <h3 className="font-semibold text-zinc-900 mb-4">Almost done! Tell us about yourself</h3>

                        {/* Star Rating */}
                        <div className="flex justify-center gap-2 mb-6">
                            <p className="text-sm text-zinc-500 mr-3">Your rating:</p>
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
                                            : "text-zinc-200 hover:text-amber-300"
                                            }`}
                                    />
                                </motion.button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <Input
                                placeholder="Your name *"
                                value={videoFormData.name}
                                onChange={(e) => setVideoFormData({ ...videoFormData, name: e.target.value })}
                                className="bg-white border-zinc-200 focus:border-primary focus:ring-primary/20"
                                maxLength={100}
                            />
                            <Input
                                type="email"
                                placeholder="Email address *"
                                value={videoFormData.email}
                                onChange={(e) => setVideoFormData({ ...videoFormData, email: e.target.value })}
                                className="bg-white border-zinc-200 focus:border-primary focus:ring-primary/20"
                                maxLength={255}
                            />
                            <Input
                                placeholder="Job title (optional)"
                                value={videoFormData.title}
                                onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                                className="bg-white border-zinc-200 focus:border-primary focus:ring-primary/20"
                                maxLength={100}
                            />
                            <Input
                                placeholder="Company (optional)"
                                value={videoFormData.company}
                                onChange={(e) => setVideoFormData({ ...videoFormData, company: e.target.value })}
                                className="bg-white border-zinc-200 focus:border-primary focus:ring-primary/20"
                                maxLength={100}
                            />
                        </div>

                        {/* Optional Text Testimonial */}
                        <div className="mb-4">
                            <Textarea
                                placeholder="Would you like to add a written message? (Optional)"
                                value={videoFormData.testimonial}
                                onChange={(e) => setVideoFormData({ ...videoFormData, testimonial: e.target.value })}
                                className="min-h-[100px] bg-white border-zinc-200 focus:border-primary focus:ring-primary/20 resize-none"
                                maxLength={1000}
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
                                    <Button variant="outline" onClick={handleRetake} className="gap-2 h-12 px-6 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900">
                                        <RotateCcw className="w-4 h-4" />
                                        Record Again
                                    </Button>
                                    <Button
                                        variant="default"
                                        onClick={() => setShowVideoForm(true)}
                                        className="gap-2 h-12 px-6 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                        Continue
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {/* Form Step - Ready to submit */}
                                    <Button variant="outline" onClick={handleRetake} className="gap-2 h-12 px-6 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900">
                                        <RotateCcw className="w-4 h-4" />
                                        Retake
                                    </Button>
                                    <Button
                                        variant="default"
                                        onClick={handleSubmit}
                                        className="gap-2 h-12 px-6 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
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
                    <p className="text-center mt-4 text-sm font-medium text-zinc-400">
                        Tap to start recording
                    </p>
                )}

                <button
                    onClick={handleBackToOptions}
                    className="block mx-auto mt-8 text-sm text-zinc-400 hover:text-primary transition-colors"
                >
                    ← Back to options
                </button>
            </div>
        </motion.div>
    );
};
