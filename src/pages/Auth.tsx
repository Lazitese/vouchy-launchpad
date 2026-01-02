import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, Lock, User, Chrome } from "lucide-react";
import logoPrimary from "@/assets/logo-primary.svg";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialMode = location.state?.mode || "signup";
  const selectedPlan = location.state?.plan || "Starter";
  
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to onboarding for signup, dashboard for login
    if (mode === "signup") {
      navigate("/onboarding", { state: { plan: selectedPlan, user: formData } });
    } else {
      navigate("/dashboard");
    }
  };

  const handleGoogleAuth = () => {
    // Simulate Google auth
    if (mode === "signup") {
      navigate("/onboarding", { state: { plan: selectedPlan } });
    } else {
      navigate("/dashboard");
    }
  };

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
          >
            <Chrome className="w-5 h-5 mr-2" />
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
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-subtext" />
                <Input
                  type="text"
                  placeholder="Full name"
                  className="h-12 pl-11"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-subtext" />
              <Input
                type="email"
                placeholder="Email address"
                className="h-12 pl-11"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-subtext" />
              <Input
                type="password"
                placeholder="Password"
                className="h-12 pl-11"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <Button variant="hero" className="w-full h-12 text-base group" type="submit">
              {mode === "signup" ? "Create Account" : "Sign In"}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
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
