import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  MessageSquare,
  ChevronRight,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";
import { useSpaceBySlug } from "@/hooks/useSpaces";
import { useSubmitTestimonial } from "@/hooks/useTestimonials";
import { useToast } from "@/hooks/use-toast";
import logoPrimary from "@/assets/logo-primary.svg";
import { supabase } from "@/integrations/supabase/client";
import { VideoRecorder } from "@/components/collect/VideoRecorder";
import { TextForm } from "@/components/collect/TextForm";

type Mode = "select" | "video" | "text" | "success";
type PlanType = "free" | "pro" | "agency";

const Collect = () => {
  const { slug } = useParams();
  const { space, loading: spaceLoading, error: spaceError } = useSpaceBySlug(slug);
  const { submitTextTestimonial, submitVideoTestimonial, loading: submitting } = useSubmitTestimonial();
  const { toast } = useToast();

  const [mode, setMode] = useState<Mode>("select");
  const [ownerPlan, setOwnerPlan] = useState<PlanType>("free");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        const { data, error } = await supabase.rpc('get_space_owner_plan', {
          _space_id: space.id
        });

        if (error) throw error;
        setOwnerPlan((data as PlanType) || "free");
      } catch (error) {
        console.error("Error fetching owner plan:", error);
        setOwnerPlan("free");
      } finally {
        setPlanLoading(false);
      }
    };

    fetchOwnerPlan();
  }, [space?.id]);

  const canUseAI = ownerPlan === "pro" || ownerPlan === "agency";

  const handleVideoSubmit = async (formData: {
    name: string;
    email: string;
    company?: string;
    title?: string;
    rating: number;
  }, videoBlob: Blob) => {
    if (!space) return;

    const { error } = await submitVideoTestimonial({
      spaceId: space.id,
      name: formData.name.trim(),
      email: formData.email.trim(),
      company: formData.company?.trim() || undefined,
      title: formData.title?.trim() || undefined,
      videoBlob,
      rating: formData.rating,
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

  const handleTextSubmit = async (formData: {
    name: string;
    email: string;
    company: string;
    title: string;
    testimonial: string;
    rating: number;
  }, avatarFile: File | null) => {
    if (!space) return;

    const { error } = await submitTextTestimonial({
      spaceId: space.id,
      name: formData.name.trim(),
      email: formData.email.trim(),
      company: formData.company.trim() || undefined,
      title: formData.title.trim() || undefined,
      content: formData.testimonial.trim(),
      rating: formData.rating,
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
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-200/50 dark:border-zinc-800/50 px-6 py-4 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
        <img src={logoPrimary} alt="Vouchy" className="h-6" />
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-6">
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
                  className="group p-8 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl text-left hover:border-primary/50 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
                    <Video className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                    Record a video
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    Share your story on camera. It's quick and personal.
                  </p>
                  <div className="flex items-center text-primary font-semibold">
                    Start recording
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Text Option */}
                <button
                  onClick={() => setMode("text")}
                  className="group p-8 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl text-left hover:border-primary/50 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
                    <MessageSquare className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                    Write a review
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    Prefer writing? Share your thoughts in text form.
                  </p>
                  <div className="flex items-center text-primary font-semibold">
                    Write review
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Video Recorder */}
          {mode === "video" && (
            <VideoRecorder
              questions={questions}
              canUseAI={canUseAI}
              onSubmit={handleVideoSubmit}
              onBack={() => setMode("select")}
              submitting={submitting}
            />
          )}

          {/* Text Form */}
          {mode === "text" && (
            <TextForm
              canUseAI={canUseAI}
              onSubmit={handleTextSubmit}
              onBack={() => setMode("select")}
              submitting={submitting}
            />
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
      <footer className="border-t border-zinc-200/50 dark:border-zinc-800/50 px-6 py-6 text-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Powered by <span className="font-semibold text-primary">Vouchy</span>
        </p>
      </footer>
    </div>
  );
};

export default Collect;
