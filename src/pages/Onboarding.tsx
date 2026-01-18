import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, Check, Upload, Sparkles, Loader2, Play } from "lucide-react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useToast } from "@/hooks/use-toast";
import logoFull from "@/assets/logo-full.svg";

const colorOptions = [
  { name: "Ocean", value: "#1a3f64" },
  { name: "Emerald", value: "#059669" },
  { name: "Sunset", value: "#ea580c" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Rose", value: "#e11d48" },
  { name: "Slate", value: "#475569" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workspace, loading: workspaceLoading, createWorkspace, uploadLogo } = useWorkspace();
  const { toast } = useToast();
  const plan = location.state?.plan || "Starter";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [workspaceData, setWorkspaceData] = useState({
    name: "",
    color: colorOptions[0].value,
    logoFile: null as File | null,
    logoPreview: null as string | null,
  });

  // If user already has a workspace, redirect to dashboard
  useEffect(() => {
    if (!workspaceLoading && workspace) {
      navigate("/dashboard", { replace: true });
    }
  }, [workspace, workspaceLoading, navigate]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Logo must be less than 2MB",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setWorkspaceData({
          ...workspaceData,
          logoFile: file,
          logoPreview: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Create workspace
      setLoading(true);
      try {
        let logoUrl: string | undefined;

        if (workspaceData.logoFile) {
          const { url, error } = await uploadLogo(workspaceData.logoFile);
          if (error) {
            toast({
              variant: "destructive",
              title: "Logo upload failed",
              description: "Could not upload logo. Please try again.",
            });
            return;
          }
          logoUrl = url || undefined;
        }

        const { error } = await createWorkspace(
          workspaceData.name,
          workspaceData.color,
          logoUrl
        );

        if (error) {
          toast({
            variant: "destructive",
            title: "Failed to create workspace",
            description: "Please try again.",
          });
          return;
        }

        navigate("/dashboard", { state: { plan } });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const steps = [
    { number: 1, label: "Workspace" },
    { number: 2, label: "Brand Color" },
    { number: 3, label: "Logo" },
  ];

  if (workspaceLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex relative overflow-hidden font-sans">

      {/* Background Patterns (Consistent with Auth) */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Animated Orbs */}
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] right-[30%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 30, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Left: Form */}
      <div className="flex-1 flex flex-col p-8 md:p-12 lg:p-16 relative z-10 w-full lg:max-w-[50%] bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm lg:backdrop-blur-none lg:bg-transparent">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <img src={logoFull} alt="Vouchy" className="h-8 md:h-9" />
          <div className="flex items-center gap-3">
            {steps.map((s, i) => (
              <div key={s.number} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2 ${step > s.number
                      ? "bg-primary border-primary text-primary-foreground"
                      : step === s.number
                        ? "bg-primary border-primary text-primary-foreground shadow-[0_0_15px_-3px_rgba(0,0,0,0.2)] shadow-primary/40"
                        : "bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-400"
                    }`}
                >
                  {step > s.number ? <Check className="w-4 h-4" /> : s.number}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-8 h-0.5 transition-all duration-300 ${step > s.number ? "bg-primary" : "bg-zinc-200 dark:bg-zinc-800"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">
                    Name your workspace
                  </h2>
                  <p className="text-zinc-500 dark:text-zinc-400 mb-10 text-lg">
                    This will be visible on your testimonial collection page.
                  </p>

                  <div className="space-y-4">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Workspace Name</label>
                    <Input
                      type="text"
                      placeholder="e.g. Acme Inc."
                      className="h-14 text-lg px-6 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all duration-300"
                      value={workspaceData.name}
                      onChange={(e) =>
                        setWorkspaceData({ ...workspaceData, name: e.target.value })
                      }
                      autoFocus
                      maxLength={100}
                    />
                    <div className="flex items-center gap-2 text-xs text-zinc-400 ml-1">
                      <Sparkles className="w-3 h-3 text-primary" />
                      <span>Used for your public profile URL</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">
                    Pick your brand color
                  </h2>
                  <p className="text-zinc-500 dark:text-zinc-400 mb-10 text-lg">
                    This will theme your widgets to match your brand.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() =>
                          setWorkspaceData({ ...workspaceData, color: color.value })
                        }
                        className={`group relative p-4 rounded-2xl border-2 text-left transition-all duration-300 overflow-hidden ${workspaceData.color === color.value
                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                            : "border-zinc-200 dark:border-zinc-800 hover:border-primary/30 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                          }`}
                      >
                        <div className="flex items-center justify-between mb-3 relative z-10">
                          <div
                            className="w-12 h-12 rounded-full shadow-sm"
                            style={{ backgroundColor: color.value }}
                          />
                          {workspaceData.color === color.value && (
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                        <p className={`text-sm font-semibold relative z-10 ${workspaceData.color === color.value ? "text-foreground" : "text-zinc-500 group-hover:text-foreground"
                          }`}>
                          {color.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">
                    Upload your logo
                  </h2>
                  <p className="text-zinc-500 dark:text-zinc-400 mb-10 text-lg">
                    Add trust to your collection page.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-64 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group relative overflow-hidden"
                  >
                    {workspaceData.logoPreview ? (
                      <div className="relative z-10 p-8">
                        <img
                          src={workspaceData.logoPreview}
                          alt="Logo preview"
                          className="max-h-32 object-contain drop-shadow-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl backdrop-blur-sm text-white font-medium">
                          Change Logo
                        </div>
                      </div>
                    ) : (
                      <div className="text-center relative z-10">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-zinc-200 dark:border-zinc-800">
                          <Upload className="w-8 h-8 text-zinc-400 group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-base font-semibold text-foreground mb-1">
                          Click to upload
                        </p>
                        <p className="text-sm text-zinc-500">
                          SVG, PNG, or JPG (max 2MB)
                        </p>
                      </div>
                    )}
                  </button>

                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => handleNext()}
                      className="text-sm font-medium text-zinc-400 hover:text-primary transition-colors flex items-center gap-1"
                    >
                      Skip for now <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Actions */}
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-zinc-100 dark:border-zinc-800/50">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={step === 1 || loading}
                className={`text-zinc-500 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <Button
                onClick={handleNext}
                disabled={(step === 1 && !workspaceData.name) || loading}
                className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-300 group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {step === 3 ? "Launch Dashboard" : "Continue"}
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Live Preview (Branded Glass Card) */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative p-12">
        {/* Decorative Grid on Right Side */}
        <div className="absolute inset-0 bg-zinc-50/50 dark:bg-zinc-900/20 backdrop-blur-[2px] pointer-events-none" />

        <motion.div
          className="w-full max-w-[480px] relative z-10"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-500 uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-primary" />
              Live Preview
            </div>
          </div>

          {/* The Preview Card */}
          <div className={`relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-black/20 transition-all duration-500 ${step === 2 ? 'ring-4 ring-primary/20 scale-[1.02]' : ''
            }`}>
            {/* Card Header Color Stripe */}
            <div
              className="h-2 w-full transition-colors duration-500"
              style={{ backgroundColor: workspaceData.color }}
            />

            <div className="p-8 md:p-10">
              {/* Logo Area */}
              <div className="flex justify-center mb-8 h-16 items-center">
                <AnimatePresence mode="wait">
                  {workspaceData.logoPreview ? (
                    <motion.img
                      key="logo"
                      src={workspaceData.logoPreview}
                      alt="Workspace Logo"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="max-h-full object-contain"
                    />
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center"
                    >
                      <span className="text-xl font-bold text-zinc-400">
                        {workspaceData.name ? workspaceData.name.charAt(0).toUpperCase() : "W"}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Headline */}
              <div className="text-center space-y-4 mb-10">
                <h3 className="text-3xl font-bold text-foreground">
                  {workspaceData.name || "Your Workspace"}
                </h3>
                <p className="text-zinc-500">
                  Share your experience with us! Your feedback helps us build better products.
                </p>
              </div>

              {/* Fake Video Button */}
              <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-1.5 flex items-center gap-4 mb-4 border border-zinc-100 dark:border-zinc-800">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0 transition-colors duration-500"
                  style={{ backgroundColor: workspaceData.color }}
                >
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div className="flex-1">
                  <div className="h-2 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full mb-2" />
                  <div className="h-2 w-16 bg-zinc-100 dark:bg-zinc-800/80 rounded-full" />
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-4 text-center border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-[10px] text-zinc-400 font-medium">
                Powered by <span className="text-foreground">Vouchy</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Onboarding;
