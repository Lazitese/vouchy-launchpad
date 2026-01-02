import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Video,
  MessageSquare,
  Play,
  Square,
  RotateCcw,
  Send,
  Star,
  ChevronRight,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Check,
} from "lucide-react";
import logoPrimary from "@/assets/logo-primary.svg";

type Mode = "select" | "video" | "text" | "success";

const teleprompterQuestions = [
  "What problem were you trying to solve?",
  "How has our product helped you?",
  "What results have you seen?",
  "Would you recommend us to others?",
];

const Collect = () => {
  const { spaceId } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [mode, setMode] = useState<Mode>("select");
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  
  const [textForm, setTextForm] = useState({
    name: "",
    email: "",
    company: "",
    testimonial: "",
    rating: 5,
  });

  // Initialize camera
  useEffect(() => {
    if (mode === "video" && !stream) {
      initCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mode]);

  const initCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !cameraEnabled;
      });
      setCameraEnabled(!cameraEnabled);
    }
  };

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !micEnabled;
      });
      setMicEnabled(!micEnabled);
    }
  };

  const startRecording = () => {
    if (!stream) return;

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setRecordedBlob(blob);
    };

    mediaRecorder.start();
    setIsRecording(true);

    // Auto-cycle through questions
    const interval = setInterval(() => {
      setCurrentQuestion((prev) => {
        if (prev < teleprompterQuestions.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 8000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const retakeRecording = () => {
    setRecordedBlob(null);
    setCurrentQuestion(0);
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  };

  const submitVideo = () => {
    // Handle video submission
    setMode("success");
  };

  const submitText = (e: React.FormEvent) => {
    e.preventDefault();
    setMode("success");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/[0.08] px-6 py-4">
        <img src={logoPrimary} alt="Vouchy" className="h-6" />
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {/* Mode Selection */}
          {mode === "select" && (
            <motion.div
              key="select"
              className="w-full max-w-2xl text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl md:text-4xl font-black text-primary mb-4">
                Share your experience
              </h1>
              <p className="text-lg text-subtext mb-12">
                Help others by sharing your honest feedback. Choose how you'd like to contribute.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Video Option */}
                <button
                  onClick={() => setMode("video")}
                  className="group p-8 bg-card border border-border/[0.08] rounded-[16px] text-left hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-[12px] bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Video className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">
                    Record a video
                  </h3>
                  <p className="text-subtext mb-4">
                    Share your story on camera. It's quick and personal.
                  </p>
                  <div className="flex items-center text-primary font-medium">
                    Start recording
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Text Option */}
                <button
                  onClick={() => setMode("text")}
                  className="group p-8 bg-card border border-border/[0.08] rounded-[16px] text-left hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-[12px] bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <MessageSquare className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">
                    Write a review
                  </h3>
                  <p className="text-subtext mb-4">
                    Prefer writing? Share your thoughts in text form.
                  </p>
                  <div className="flex items-center text-primary font-medium">
                    Write review
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Video Recorder */}
          {mode === "video" && (
            <motion.div
              key="video"
              className="w-full max-w-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                {/* Video Container */}
                <div className="relative aspect-video bg-gray-900 rounded-[16px] overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />

                  {/* Teleprompter Overlay */}
                  {isRecording && (
                    <motion.div
                      className="absolute inset-x-0 top-0 p-6 bg-gradient-to-b from-black/80 to-transparent"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="text-xs text-white/60 uppercase tracking-wider mb-2">
                        Question {currentQuestion + 1} of {teleprompterQuestions.length}
                      </p>
                      <motion.p
                        key={currentQuestion}
                        className="text-xl md:text-2xl font-semibold text-white"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        {teleprompterQuestions[currentQuestion]}
                      </motion.p>
                    </motion.div>
                  )}

                  {/* Recording indicator */}
                  {isRecording && (
                    <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 bg-red-500 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span className="text-xs font-medium text-white">REC</span>
                    </div>
                  )}

                  {/* Camera controls */}
                  <div className="absolute bottom-6 left-6 flex gap-2">
                    <button
                      onClick={toggleCamera}
                      className={`p-3 rounded-full transition-colors ${
                        cameraEnabled ? "bg-white/20" : "bg-red-500"
                      }`}
                    >
                      {cameraEnabled ? (
                        <Camera className="w-5 h-5 text-white" />
                      ) : (
                        <CameraOff className="w-5 h-5 text-white" />
                      )}
                    </button>
                    <button
                      onClick={toggleMic}
                      className={`p-3 rounded-full transition-colors ${
                        micEnabled ? "bg-white/20" : "bg-red-500"
                      }`}
                    >
                      {micEnabled ? (
                        <Mic className="w-5 h-5 text-white" />
                      ) : (
                        <MicOff className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  {recordedBlob ? (
                    <>
                      <Button variant="outline" onClick={retakeRecording} className="gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Retake
                      </Button>
                      <Button variant="hero" onClick={submitVideo} className="gap-2">
                        <Send className="w-4 h-4" />
                        Submit Video
                      </Button>
                    </>
                  ) : (
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isRecording
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-primary hover:bg-primary/90"
                      }`}
                    >
                      {isRecording ? (
                        <Square className="w-6 h-6 text-white fill-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                      )}
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setMode("select")}
                  className="block mx-auto mt-6 text-sm text-subtext hover:text-primary transition-colors"
                >
                  ← Back to options
                </button>
              </div>
            </motion.div>
          )}

          {/* Text Form */}
          {mode === "text" && (
            <motion.div
              key="text"
              className="w-full max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-black text-primary mb-2 text-center">
                Write your review
              </h2>
              <p className="text-subtext mb-8 text-center">
                Share what you loved about your experience
              </p>

              <form onSubmit={submitText} className="space-y-4">
                {/* Rating */}
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setTextForm({ ...textForm, rating })}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          rating <= textForm.rating
                            ? "text-primary fill-primary"
                            : "text-border/20"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Your name"
                    value={textForm.name}
                    onChange={(e) =>
                      setTextForm({ ...textForm, name: e.target.value })
                    }
                    required
                  />
                  <Input
                    placeholder="Company (optional)"
                    value={textForm.company}
                    onChange={(e) =>
                      setTextForm({ ...textForm, company: e.target.value })
                    }
                  />
                </div>

                <Input
                  type="email"
                  placeholder="Email address"
                  value={textForm.email}
                  onChange={(e) =>
                    setTextForm({ ...textForm, email: e.target.value })
                  }
                  required
                />

                <Textarea
                  placeholder="Share your experience..."
                  className="min-h-[150px] resize-none"
                  value={textForm.testimonial}
                  onChange={(e) =>
                    setTextForm({ ...textForm, testimonial: e.target.value })
                  }
                  required
                />

                <Button variant="hero" className="w-full gap-2" type="submit">
                  <Send className="w-4 h-4" />
                  Submit Review
                </Button>
              </form>

              <button
                onClick={() => setMode("select")}
                className="block mx-auto mt-6 text-sm text-subtext hover:text-primary transition-colors"
              >
                ← Back to options
              </button>
            </motion.div>
          )}

          {/* Success */}
          {mode === "success" && (
            <motion.div
              key="success"
              className="text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Check className="w-10 h-10 text-green-500" />
              </motion.div>
              <h2 className="text-3xl font-black text-primary mb-2">
                Thank you!
              </h2>
              <p className="text-lg text-subtext max-w-md mx-auto">
                Your testimonial has been submitted. We appreciate you taking the
                time to share your experience.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/[0.08] px-6 py-4 text-center">
        <p className="text-xs text-subtext">
          Powered by <span className="font-medium text-primary">Vouchy</span>
        </p>
      </footer>
    </div>
  );
};

export default Collect;
