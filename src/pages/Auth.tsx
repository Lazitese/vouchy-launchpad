import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TbArrowRight, TbMail, TbLock, TbUser, TbLoader } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

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
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-zinc-950 relative overflow-hidden font-sans p-4">

      {/* Background Patterns - Matched to Hero */}
      <div className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Animated Orbs - Subtle Background Ambiance */}
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 30, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Back to Home - Absolute Top Left */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20">
        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-primary transition-colors bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-zinc-200/50 dark:border-zinc-800/50"
        >
          <TbArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>
      </div>

      {/* Centered Auth Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[480px] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05)] relative z-10 overflow-hidden"
      >
        <div className="p-8 md:p-10">

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-50"></div>
              <img src="/Vouchy (64 x 64 px).svg" alt="Vouchy" className="h-16 w-16 object-contain relative z-10" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              {mode === "signup" ? "Get started with Vouchy" : "Welcome back"}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              {mode === "signup"
                ? "Start collecting authentic video testimonials."
                : "Enter your details to access your dashboard."}
            </p>
          </div>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full h-12 text-sm font-medium rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-300 relative overflow-hidden group"
              onClick={handleGoogleAuth}
              disabled={loading || googleLoading}
            >
              {googleLoading ? (
                <TbLoader className="w-5 h-5 mr-3 animate-spin text-foreground" />
              ) : (
                <FcGoogle className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
              )}
              <span className="relative z-10 text-zinc-700 dark:text-zinc-300">Continue with Google</span>
            </Button>

            <div className="relative flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">or email</span>
              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                      <div className="relative group">
                        <TbUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                        <Input
                          type="text"
                          placeholder="Full Name"
                          className={`h-12 pl-12 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 transition-all duration-300 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 ${errors.name ? "border-destructive focus:border-destructive" : ""}`}
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
                <div className="relative group">
                  <TbMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    className={`h-12 pl-12 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 transition-all duration-300 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 ${errors.email ? "border-destructive focus:border-destructive" : ""}`}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading || googleLoading}
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive font-medium ml-1">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="relative group">
                  <TbLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    type="password"
                    placeholder="Password"
                    className={`h-12 pl-12 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 transition-all duration-300 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 ${errors.password ? "border-destructive focus:border-destructive" : ""}`}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={loading || googleLoading}
                  />
                </div>
                {errors.password && <p className="text-xs text-destructive font-medium ml-1">{errors.password}</p>}
              </div>

              <Button
                className="w-full h-12 rounded-xl text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 group mt-2 relative overflow-hidden"
                type="submit"
                disabled={loading || googleLoading}
              >
                {loading && !googleLoading ? (
                  <TbLoader className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {mode === "signup" ? "Create Account" : "Sign In"}
                    <TbArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
                {/* Sheen effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
              </Button>
            </form>

            <p className="text-center text-xs text-zinc-500 mt-6">
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
        </div>

        {/* Bottom Bar Gradient Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-blue-500 to-indigo-500" />
      </motion.div>

      {/* Footer Copyright */}
      <div className="absolute bottom-6 text-[10px] text-zinc-400 font-medium">
        © Vouchy Inc.
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
