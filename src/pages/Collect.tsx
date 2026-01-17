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
import logoFull from "@/assets/logo-full.svg";
import { supabase } from "@/integrations/supabase/client";
import { VideoRecorder } from "@/components/collect/VideoRecorder";
import { TextForm } from "@/components/collect/TextForm";
import { SEOHead } from "@/components/SEO/SEOHead";

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
    testimonial?: string;
    rating: number;
  }, videoBlob: Blob) => {
    if (!space) return;

    const { error } = await submitVideoTestimonial({
      spaceId: space.id,
      name: formData.name.trim(),
      email: formData.email.trim(),
      company: formData.company?.trim() || undefined,
      title: formData.title?.trim() || undefined,
      content: formData.testimonial?.trim() || undefined,
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
  if (spaceLoading || planLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error or not found
  if (spaceError || !space) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-zinc-900">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Collection Not Found</h1>
        <p className="text-zinc-500 text-center max-w-md">
          This collection link is invalid or has been deactivated.
        </p>
      </div>
    );
  }

  const isFreePlan = ownerPlan === "free";



  return (
    <div className="min-h-screen bg-engineering-grid flex flex-col font-sans text-zinc-900 selection:bg-primary/20 selection:text-primary">
      <SEOHead
        title={space?.name ? `Submit Testimonial to ${space.name} | Vouchy` : 'Submit Testimonial | Vouchy'}
        description="Share your experience with a video or text review. Your feedback helps us grow."
        url={window.location.href}
      />
      {/* Header */}
      <header className="border-b border-zinc-200/50 px-6 py-4 bg-white/60 backdrop-blur-md sticky top-0 z-50">
        <img src={logoFull} alt="Vouchy" className="h-6" />
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-6 relative z-10">
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
              <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-zinc-900">
                Share your experience
              </h1>
              <p className="text-lg text-zinc-500 mb-12 max-w-lg mx-auto leading-relaxed">
                Help others by sharing your honest feedback. Choose how you'd like to contribute.
              </p>

              <div className={`grid grid-cols-1 ${!isFreePlan ? 'md:grid-cols-2' : 'max-w-md mx-auto'} gap-4 md:gap-6`}>
                {/* Video Option - HIDDEN FOR FREE PLAN */}
                {!isFreePlan && (
                  <button
                    onClick={() => setMode("video")}
                    className="group relative p-8 bg-white/70 backdrop-blur-xl border border-zinc-200/60 rounded-2xl text-left hover:border-primary/50 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner group-hover:bg-primary/10">
                        <Video className="w-7 h-7 text-primary transition-colors" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl font-bold text-zinc-900 mb-2 tracking-tight group-hover:text-primary transition-colors">
                        Record a video
                      </h3>
                      <p className="text-zinc-500 mb-6 text-sm leading-relaxed">
                        Share your story on camera. It's quick, personal, and impactful.
                      </p>
                      <div className="flex items-center text-primary font-semibold text-sm">
                        Start recording
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </button>
                )}

                {/* Text Option */}
                <button
                  onClick={() => setMode("text")}
                  className="group relative p-8 bg-white/70 backdrop-blur-xl border border-zinc-200/60 rounded-2xl text-left hover:border-primary/50 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner group-hover:bg-primary/10">
                      <MessageSquare className="w-7 h-7 text-primary transition-colors" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-2 tracking-tight group-hover:text-primary transition-colors">
                      Write a review
                    </h3>
                    <p className="text-zinc-500 mb-6 text-sm leading-relaxed">
                      Prefer writing? Share your thoughts in text form effortlessly.
                    </p>
                    <div className="flex items-center text-primary font-semibold text-sm">
                      Write review
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
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
              spaceId={space.id}
            />
          )}

          {/* Text Form */}
          {mode === "text" && (
            <TextForm
              canUseAI={canUseAI}
              onSubmit={handleTextSubmit}
              onBack={() => setMode("select")}
              submitting={submitting}
              spaceId={space.id}
            />
          )}

          {/* Success */}
          {mode === "success" && (
            <motion.div
              key="success"
              className="text-center bg-white/60 backdrop-blur-md p-10 rounded-3xl border border-primary/20 shadow-xl max-w-md w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <Check className="w-10 h-10 text-primary" strokeWidth={2} />
              </div>
              <h2 className="text-3xl font-bold text-zinc-900 mb-4 tracking-tight">
                Thank you!
              </h2>
              <p className="text-zinc-500 text-lg leading-relaxed">
                Your testimonial has been submitted. We appreciate you taking the time to share your experience.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/50 px-6 py-6 text-center bg-white/60 backdrop-blur-md">
        <p className="text-sm text-zinc-400 font-medium">
          Powered by <span className="text-zinc-900 font-bold">Vouchy</span>
        </p>
      </footer>
    </div>
  );
};

export default Collect;
