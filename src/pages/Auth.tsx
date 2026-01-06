import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, Lock, User, Chrome, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import logoPrimary from "@/assets/logo-primary.svg";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const authSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});

// Product IDs for paid plans
const planProductIds: Record<string, string> = {
  Pro: "pdt_0NVVmIlZrdWC90xs1ZgOm",
  Agency: "pdt_0NVVmba1bevOgK6sfV8Wx",
};

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { toast } = useToast();

  const initialMode = location.state?.mode || "signup";
  const selectedPlan = location.state?.plan || "Starter";

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle redirect when user is logged in
  useEffect(() => {
    if (user && session) {
      handlePostAuthRedirect();
    }
  }, [user, session]);

  const handlePostAuthRedirect = async () => {
    const productId = planProductIds[selectedPlan];

    // If a paid plan was selected, redirect to payment
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

    // Otherwise redirect to dashboard or onboarding
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
            data: {
              full_name: formData.name,
            },
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

        // Check if session was created (Email confirmation might be ON)
        if (data.user && !data.session) {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account before logging in.",
          });
          setLoading(false);
          // Optional: Switch to login mode
          setMode("login");
          return;
        }

        // If session exists, manually navigate to ensure we don't hang
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
    setLoading(true);
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
      setLoading(false);
    }
  };

  // Show loading state if redirecting
  if (user && session && loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-subtext">Preparing your checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo */}
          <div className="mb-12">
            <img src={logoPrimary} alt="Vouchy" className="h-8" />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-primary mb-2">
              {mode === "signup" ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-subtext">
              {mode === "signup" ? (
                <>
                  Selected plan:{" "}
                  <span className="text-primary font-medium">{selectedPlan}</span>
                </>
              ) : (
                "Sign in to access your dashboard"
              )}
            </p>
          </div>

          {/* Google Auth */}
          <Button
            variant="outline"
            className="w-full mb-6 h-12 text-base"
            onClick={handleGoogleAuth}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Chrome className="w-5 h-5 mr-2" />
            )}
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border/[0.08]" />
            <span className="text-xs text-subtext uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-border/[0.08]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-subtext" />
                  <Input
                    type="text"
                    placeholder="Full name"
                    className={`h-12 pl-11 ${errors.name ? "border-red-500" : ""}`}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
            )}

            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-subtext" />
                <Input
                  type="email"
                  placeholder="Email address"
                  className={`h-12 pl-11 ${errors.email ? "border-red-500" : ""}`}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-subtext" />
                <Input
                  type="password"
                  placeholder="Password"
                  className={`h-12 pl-11 ${errors.password ? "border-red-500" : ""}`}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  disabled={loading}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <Button
              variant="hero"
              className="w-full h-12 text-base group"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === "signup" ? "Create Account" : "Sign In"}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle mode */}
          <p className="mt-8 text-center text-sm text-subtext">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-primary font-medium hover:underline"
                  disabled={loading}
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-primary font-medium hover:underline"
                  disabled={loading}
                >
                  Create one
                </button>
              </>
            )}
          </p>
        </motion.div>
      </div>

      {/* Right: Visual */}
      <div className="hidden lg:flex flex-1 bg-slate items-center justify-center p-12">
        <motion.div
          className="max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-background rounded-[16px] p-8 border border-border/[0.08] shadow-[0_32px_64px_-16px_rgba(26,63,100,0.15)]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">JD</span>
              </div>
              <div>
                <p className="font-semibold text-primary">Jane Doe</p>
                <p className="text-sm text-subtext">Marketing Director</p>
              </div>
            </div>
            <p className="text-foreground/80 leading-relaxed mb-4">
              "Vouchy transformed how we collect testimonials. The video feature
              is a game-changer for social proof."
            </p>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-primary">★</span>
              ))}
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-subtext">
            Join 10,000+ businesses building trust with Vouchy
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
