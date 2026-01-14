import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TbArrowRight, TbMail, TbLock, TbUser, TbLoader } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { TestimonialAvatar, TestimonialStars } from "@/components/widgets/TestimonialCard";
import { Video } from "lucide-react";
import logoPrimary from "@/assets/logo-primary.svg";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const authSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});

const planProductIds: Record<string, string> = {
  Pro: "pdt_0NVVmIlZrdWC90xs1ZgOm",
  Agency: "pdt_0NVVmba1bevOgK6sfV8Wx",
};

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { toast } = useToast();

  // Sample testimonial data for display cards
  const sampleTestimonial1 = {
    id: "auth-sample-1",
    author_name: "Emily Rodriguez",
    author_avatar_url: null,
    author_company: null,
    author_email: null,
    author_title: "CEO",
    content: "Vouchy completely transformed how we collect customer feedback. Our conversion rates have never been higher!",
    created_at: new Date().toISOString(),
    golden_quote: null,
    rating: 5,
    space_id: "sample-space",
    status: "approved" as const,
    type: "video" as const,
    video_url: null,
    ai_summary: null
  };

  const sampleTestimonial2 = {
    id: "auth-sample-2",
    author_name: "David Kim",
    author_avatar_url: null,
    author_company: null,
    author_email: null,
    author_title: "Marketing Director",
    content: "The best testimonial platform we've ever used. Setup took minutes and our customers love it!",
    created_at: new Date().toISOString(),
    golden_quote: null,
    rating: 5,
    space_id: "sample-space",
    status: "approved" as const,
    type: "text" as const,
    video_url: null,
    ai_summary: null
  };

  const initialMode = location.state?.mode || "signup";
  const selectedPlan = location.state?.plan || "Starter";

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [loading, setLoading] = useState(false);
  // Separate loading state for Google so we can show spinner on that button specifically if needed
  const [googleLoading, setGoogleLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && session) {
      handlePostAuthRedirect();
    }
  }, [user, session]);

  const handlePostAuthRedirect = async () => {
    const productId = planProductIds[selectedPlan];

    if (productId && user) {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('create-checkout', {
          body: {
            productId,
            customerEmail: user.email,
            customerName: user.user_metadata?.full_name || user.email,
            returnUrl: `${window.location.origin}/dashboard?payment=success`,
          },
        });

        if (error) throw error;

        if (data?.paymentLink) {
          window.location.href = data.paymentLink;
          return;
        }
      } catch (err) {
        console.error('Checkout error:', err);
        toast({
          variant: "destructive",
          title: "Payment Error",
          description: "Failed to create checkout session. Redirecting to dashboard.",
        });
      } finally {
        setLoading(false);
      }
    }

    if (mode === "signup") {
      navigate("/onboarding", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  const validateForm = () => {
    try {
      if (mode === "signup") {
        authSchema.parse(formData);
      } else {
        authSchema.pick({ email: true, password: true }).parse(formData);
      }
      setErrors({});
      return true;
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
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      if (mode === "signup") {
        const redirectUrl = `${window.location.origin}/`;
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: { full_name: formData.name },
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              variant: "destructive",
              title: "Account exists",
              description: "This email is already registered. Please sign in instead.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Signup failed",
              description: error.message,
            });
          }
          setLoading(false);
          return;
        }

        if (data.user && !data.session) {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account before logging in.",
          });
          setLoading(false);
          setMode("login");
          return;
        }

        if (data.session) {
          navigate("/dashboard");
          return;
        }

      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: "Invalid email or password. Please try again.",
          });
          setLoading(false);
          return;
        }

        if (data.session) {
          navigate("/dashboard");
          return;
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: selectedPlan && planProductIds[selectedPlan]
          ? `${window.location.origin}/auth?plan=${selectedPlan}`
          : `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      toast({
        variant: "destructive",
        title: "Google sign in failed",
        description: error.message,
      });
      setGoogleLoading(false);
    }
  };

  if (user && session && loading && !googleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <TbLoader className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Preparing your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background overflow-hidden font-sans">
      {/* Left: Form Section */}
      <div className="flex flex-col justify-center px-8 sm:px-12 md:px-20 lg:px-24 xl:px-32 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Back to Home Button */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <TbArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </button>
          </div>

          {/* Logo */}
          <div className="mb-12">
            <img src="/Vouchy (48 x 160 px).svg" alt="Vouchy" className="h-12 w-auto" />
          </div>

          <div className="mb-8 space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              {mode === "signup" ? "Get started with Vouchy" : "Welcome back"}
            </h1>
            <p className="text-muted-foreground text-lg">
              {mode === "signup"
                ? "Create your account to start collecting video testimonials."
                : "Enter your details to access your dashboard."}
            </p>
          </div>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full h-14 text-base font-medium rounded-xl border-2 hover:bg-slate-50 transition-all duration-300 relative overflow-hidden group"
              onClick={handleGoogleAuth}
              disabled={loading || googleLoading}
            >
              {googleLoading ? (
                <TbLoader className="w-5 h-5 mr-3 animate-spin text-foreground" />
              ) : (
                <FcGoogle className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
              )}
              <span className="relative z-10">Continue with Google</span>
            </Button>

            <div className="relative flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-border/40" />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">or email</span>
              <div className="flex-1 h-px bg-border/40" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="popLayout">
                {mode === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-foreground/80">Full Name</label>
                      <div className="relative group">
                        <TbUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          type="text"
                          placeholder="John Doe"
                          className={`h-12 pl-12 rounded-xl border-2 bg-transparent transition-all duration-300 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 ${errors.name ? "border-destructive focus:border-destructive" : ""}`}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          disabled={loading || googleLoading}
                        />
                      </div>
                      {errors.name && <p className="text-xs text-destructive font-medium ml-1">{errors.name}</p>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground/80">Email</label>
                <div className="relative group">
                  <TbMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="email"
                    placeholder="hello@company.com"
                    className={`h-12 pl-12 rounded-xl border-2 bg-transparent transition-all duration-300 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 ${errors.email ? "border-destructive focus:border-destructive" : ""}`}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading || googleLoading}
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive font-medium ml-1">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground/80">Password</label>
                <div className="relative group">
                  <TbLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className={`h-12 pl-12 rounded-xl border-2 bg-transparent transition-all duration-300 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 ${errors.password ? "border-destructive focus:border-destructive" : ""}`}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={loading || googleLoading}
                  />
                </div>
                {errors.password && <p className="text-xs text-destructive font-medium ml-1">{errors.password}</p>}
              </div>

              <Button
                className="w-full h-14 rounded-xl text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 group mt-4 relative overflow-hidden"
                type="submit"
                disabled={loading || googleLoading}
              >
                {loading && !googleLoading ? (
                  <TbLoader className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {mode === "signup" ? "Create Account" : "Sign In"}
                    <TbArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
                {/* Sheen effect on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-8">
              {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
              <button
                onClick={() => {
                  setMode(mode === "signup" ? "login" : "signup");
                  setErrors({});
                }}
                className="text-primary font-bold hover:underline transition-all"
                disabled={loading || googleLoading}
              >
                {mode === "signup" ? "Sign in" : "Create one"}
              </button>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right: Visual Section */}
      <div className="hidden lg:flex relative bg-[#F4F4F5] dark:bg-zinc-900 items-center justify-center overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-40">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" className="fill-current text-primary/10" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Animated Orbs */}
        <motion.div
          animate={{
            y: [0, -40, 0],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 60, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"
        />

        {/* Testimonial Cards */}
        <div className="relative z-10 w-full max-w-md flex flex-col gap-6">
          {/* Top Card - Video Testimonial */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotate: -5 }}
            animate={{ opacity: 1, x: 0, rotate: -6 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800 w-full"
          >
            <div className="flex items-start gap-3 mb-3">
              <TestimonialAvatar testimonial={sampleTestimonial1} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">{sampleTestimonial1.author_name}</p>
                <p className="text-xs text-muted-foreground">{sampleTestimonial1.author_title}</p>
              </div>
              <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center">
                <Video className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>

            <TestimonialStars rating={sampleTestimonial1.rating} className="mb-2" />

            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              "{sampleTestimonial1.content}"
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <span className="text-xs text-muted-foreground">2 days ago</span>
              <span className="text-xs px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-medium">
                Video
              </span>
            </div>
          </motion.div>

          {/* Center Card - Text Testimonial */}
          <motion.div
            initial={{ opacity: 0, x: -40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800"
          >
            <div className="flex items-start gap-3 mb-4">
              <TestimonialAvatar testimonial={sampleTestimonial2} size="md" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">{sampleTestimonial2.author_name}</p>
                <p className="text-xs text-muted-foreground">{sampleTestimonial2.author_title}</p>
              </div>
            </div>

            <TestimonialStars rating={sampleTestimonial2.rating} className="mb-3" />

            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              "{sampleTestimonial2.content}"
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <span className="text-xs text-muted-foreground">1 week ago</span>
              <span className="text-xs px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 font-medium">
                Text
              </span>
            </div>
          </motion.div>

          {/* Bottom Card - Feature Highlight */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotate: 5 }}
            animate={{ opacity: 1, x: 0, rotate: 6 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Video & Text</p>
                <p className="text-xs text-muted-foreground">Collect both formats</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center">
                  <svg className="w-2 h-2 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>HD video recording</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center">
                  <svg className="w-2 h-2 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Beautiful display</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center">
                  <svg className="w-2 h-2 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>One-line embed</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const StarIcon = ({ filled }: { filled?: boolean }) => (
  <svg className={`w-4 h-4 ${filled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export default Auth;
