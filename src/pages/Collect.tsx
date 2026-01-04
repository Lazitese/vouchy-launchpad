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
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import { useSpaceBySlug } from "@/hooks/useSpaces";
import { useSubmitTestimonial } from "@/hooks/useTestimonials";
import { useToast } from "@/hooks/use-toast";
import logoPrimary from "@/assets/logo-primary.svg";
import { z } from "zod";
import { AIScriptGenerator } from "@/components/AIScriptGenerator";
import { TextMagic } from "@/components/TextMagic";
import { supabase } from "@/integrations/supabase/client";

type Mode = "select" | "video" | "text" | "success";

const textFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  company: z.string().max(100).optional(),
  testimonial: z.string().min(10, "Please write at least 10 characters").max(2000),
  rating: z.number().min(1).max(5),
});

type PlanType = "free" | "pro" | "agency";

const Collect = () => {
  const { slug } = useParams();
  const { space, loading: spaceLoading, error: spaceError } = useSpaceBySlug(slug);
  const { submitTextTestimonial, submitVideoTestimonial, loading: submitting } = useSubmitTestimonial();
  const { toast } = useToast();
  
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
  const [videoFormData, setVideoFormData] = useState({
    name: "",
    email: "",
    company: "",
    title: "",
    rating: 5,
  });
  
  const [textForm, setTextForm] = useState({
    name: "",
    email: "",
    company: "",
    title: "",
    testimonial: "",
    rating: 5,
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // AI Features state
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [ownerPlan, setOwnerPlan] = useState<PlanType>("free");
  const [planLoading, setPlanLoading] = useState(true);

  const questions = space?.questions || [
    "What problem were you trying to solve?",
    "How has our product helped you?",
    "What results have you seen?",
    "Would you recommend us to others?",
  ];
  
  // Fetch space owner's plan to determine AI features availability
  useEffect(() => {
    const fetchOwnerPlan = async () => {
      if (!space?.id) return;
      
      try {
        // Get the space owner's user_id through the workspace
        const { data: spaceData } = await supabase
          .from("spaces")
          .select("workspace_id")
          .eq("id", space.id)
          .single();
          
        if (spaceData?.workspace_id) {
          const { data: workspaceData } = await supabase
            .from("workspaces")
            .select("user_id")
            .eq("id", spaceData.workspace_id)
            .single();
            
          if (workspaceData?.user_id) {
            const { data: profileData } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", workspaceData.user_id)
              .single();
              
            setOwnerPlan(((profileData as any)?.plan as PlanType) || "free");
          }
        }
      } catch (error) {
        console.error("Error fetching owner plan:", error);
      } finally {
        setPlanLoading(false);
      }
    };
    
    fetchOwnerPlan();
  }, [space?.id]);
  
  const canUseAI = ownerPlan === "pro" || ownerPlan === "agency";

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
      toast({
        variant: "destructive",
        title: "Camera access denied",
        description: "Please allow camera access to record a video testimonial.",
      });
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
        if (prev < questions.length - 1) {
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

  const submitVideo = async () => {
    if (!space || !recordedBlob) return;
    
    // Validate video form
    if (!videoFormData.name.trim() || !videoFormData.email.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter your name and email.",
      });
      return;
    }

    const { error } = await submitVideoTestimonial({
      spaceId: space.id,
      name: videoFormData.name.trim(),
      email: videoFormData.email.trim(),
      company: videoFormData.company.trim() || undefined,
      title: videoFormData.title.trim() || undefined,
      videoBlob: recordedBlob,
      rating: videoFormData.rating,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Please try again.",
      });
      return;
    }

    setMode("success");
  };

  const submitText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!space) return;

    // Validate
    try {
      textFormSchema.parse(textForm);
      setErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) {
            newErrors[e.path[0] as string] = e.message;
          }
        });
        setErrors(newErrors);
      }
      return;
    }

    const { error } = await submitTextTestimonial({
      spaceId: space.id,
      name: textForm.name.trim(),
      email: textForm.email.trim(),
      company: textForm.company.trim() || undefined,
      title: textForm.title.trim() || undefined,
      content: textForm.testimonial.trim(),
      rating: textForm.rating,
      avatarFile: avatarFile || undefined,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Please try again.",
      });
      return;
    }

    setMode("success");
  };

  // Loading state
  if (spaceLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error or not found
  if (spaceError || !space) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-primary mb-2">Collection Not Found</h1>
        <p className="text-subtext text-center max-w-md">
          This collection link is invalid or has been deactivated.
        </p>
      </div>
    );
  }

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
              {/* AI Script Generator - Above video */}
              {!recordedBlob && !isRecording && (
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-subtext">Need help with what to say?</p>
                  <AIScriptGenerator
                    questions={questions}
                    onScriptGenerated={(script) => setGeneratedScript(script)}
                    isLocked={!canUseAI}
                  />
                </div>
              )}
              
              {/* Generated Script Display */}
              {generatedScript && !recordedBlob && !isRecording && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-4 p-4 bg-primary/5 border border-primary/20 rounded-xl relative"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-primary mb-2">Your AI-generated script:</p>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{generatedScript}</p>
                    </div>
                    <button
                      onClick={() => setGeneratedScript(null)}
                      className="p-1 hover:bg-primary/10 rounded-lg transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4 text-subtext" />
                    </button>
                  </div>
                </motion.div>
              )}
              
              <div className="relative">
                {/* Video Container */}
                <div className="relative aspect-video bg-gray-900 rounded-[16px] overflow-hidden">
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
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Teleprompter Overlay - Shows generated script while recording if available */}
                  {isRecording && (
                    <motion.div
                      className="absolute inset-x-0 top-0 p-6 bg-gradient-to-b from-black/80 to-transparent"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {generatedScript ? (
                        <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-white/30">
                          <p className="text-xs text-white/60 uppercase tracking-wider mb-2">Your Script</p>
                          <p className="text-lg text-white/90 whitespace-pre-wrap leading-relaxed">{generatedScript}</p>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs text-white/60 uppercase tracking-wider mb-2">
                            Question {currentQuestion + 1} of {questions.length}
                          </p>
                          <motion.p
                            key={currentQuestion}
                            className="text-xl md:text-2xl font-semibold text-white"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                          >
                            {questions[currentQuestion]}
                          </motion.p>
                        </>
                      )}
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
                  {!recordedBlob && (
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
                  )}
                </div>

                {/* Video form for name/email after recording */}
                {recordedBlob && (
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
                            className={`w-7 h-7 transition-all duration-200 ${
                              rating <= videoFormData.rating
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
                <div className="flex items-center justify-center gap-4 mt-6">
                  {recordedBlob ? (
                    <>
                      <Button variant="outline" onClick={retakeRecording} className="gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Retake
                      </Button>
                      <Button 
                        variant="hero" 
                        onClick={submitVideo} 
                        className="gap-2"
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
                  onClick={() => {
                    setMode("select");
                    setRecordedBlob(null);
                    setCurrentQuestion(0);
                  }}
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

              <form onSubmit={submitText} className="space-y-5">
                {/* Star Rating */}
                <div className="flex flex-col items-center gap-3 mb-2">
                  <p className="text-sm text-subtext">How would you rate your experience?</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <motion.button
                        key={rating}
                        type="button"
                        onClick={() => setTextForm({ ...textForm, rating })}
                        whileHover={{ scale: 1.15, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1"
                      >
                        <Star
                          className={`w-9 h-9 transition-all duration-200 ${
                            rating <= textForm.rating
                              ? "text-amber-400 fill-amber-400 drop-shadow-sm"
                              : "text-border/30 hover:text-amber-300"
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="flex flex-col items-center gap-3 p-5 bg-slate rounded-xl border border-border/[0.08]">
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          toast({
                            variant: "destructive",
                            title: "File too large",
                            description: "Please upload an image under 5MB.",
                          });
                          return;
                        }
                        setAvatarFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setAvatarPreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => avatarInputRef.current?.click()}
                      className="relative w-20 h-20 rounded-full bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-primary/50 transition-colors"
                    >
                      {avatarPreview ? (
                        <>
                          <img
                            src={avatarPreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-5 h-5 text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Camera className="w-6 h-6 text-primary/50 group-hover:text-primary transition-colors" />
                        </div>
                      )}
                    </motion.div>
                    
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">Add your photo</p>
                      <p className="text-xs text-subtext">Optional • JPG, PNG up to 5MB</p>
                      {avatarPreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setAvatarFile(null);
                            setAvatarPreview(null);
                          }}
                          className="text-xs text-red-500 hover:text-red-600 mt-1"
                        >
                          Remove photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Your name *"
                      value={textForm.name}
                      onChange={(e) =>
                        setTextForm({ ...textForm, name: e.target.value })
                      }
                      className={errors.name ? "border-red-500" : ""}
                      maxLength={100}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>
                  <Input
                    placeholder="Job title (optional)"
                    value={textForm.title}
                    onChange={(e) =>
                      setTextForm({ ...textForm, title: e.target.value })
                    }
                    maxLength={100}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Email address *"
                      value={textForm.email}
                      onChange={(e) =>
                        setTextForm({ ...textForm, email: e.target.value })
                      }
                      className={errors.email ? "border-red-500" : ""}
                      maxLength={255}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>
                  <Input
                    placeholder="Company (optional)"
                    value={textForm.company}
                    onChange={(e) =>
                      setTextForm({ ...textForm, company: e.target.value })
                    }
                    maxLength={100}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-subtext">Your testimonial</label>
                    <TextMagic
                      text={textForm.testimonial}
                      onTextUpdated={(newText) => setTextForm({ ...textForm, testimonial: newText })}
                      isLocked={!canUseAI}
                    />
                  </div>
                  <Textarea
                    placeholder="Share your experience..."
                    className={`min-h-[120px] resize-none ${errors.testimonial ? "border-red-500" : ""}`}
                    value={textForm.testimonial}
                    onChange={(e) =>
                      setTextForm({ ...textForm, testimonial: e.target.value })
                    }
                    maxLength={2000}
                  />
                  {errors.testimonial && (
                    <p className="text-xs text-red-500 mt-1">{errors.testimonial}</p>
                  )}
                </div>

                <Button 
                  variant="hero" 
                  className="w-full gap-2" 
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Review
                    </>
                  )}
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
