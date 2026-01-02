import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, Check, Upload, Sparkles } from "lucide-react";
import logoPrimary from "@/assets/logo-primary.svg";

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
  const plan = location.state?.plan || "Starter";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [workspace, setWorkspace] = useState({
    name: "",
    color: colorOptions[0].value,
    logo: null as string | null,
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setWorkspace({ ...workspace, logo: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate("/dashboard", { state: { workspace, plan } });
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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <img src={logoPrimary} alt="Vouchy" className="h-8" />
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s.number} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    step > s.number
                      ? "bg-primary text-primary-foreground"
                      : step === s.number
                      ? "bg-primary text-primary-foreground"
                      : "bg-slate text-subtext"
                  }`}
                >
                  {step > s.number ? <Check className="w-4 h-4" /> : s.number}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-8 h-0.5 transition-all duration-300 ${
                      step > s.number ? "bg-primary" : "bg-border/[0.08]"
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
                  <h2 className="text-3xl font-black text-primary mb-2">
                    Name your workspace
                  </h2>
                  <p className="text-subtext mb-8">
                    This will be visible to people leaving testimonials.
                  </p>
                  <Input
                    type="text"
                    placeholder="e.g., Acme Inc."
                    className="h-14 text-lg"
                    value={workspace.name}
                    onChange={(e) =>
                      setWorkspace({ ...workspace, name: e.target.value })
                    }
                    autoFocus
                  />
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
                  <h2 className="text-3xl font-black text-primary mb-2">
                    Pick your brand color
                  </h2>
                  <p className="text-subtext mb-8">
                    This will theme your collection pages and widgets.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() =>
                          setWorkspace({ ...workspace, color: color.value })
                        }
                        className={`p-4 rounded-[12px] border-2 transition-all duration-300 ${
                          workspace.color === color.value
                            ? "border-primary shadow-lg"
                            : "border-border/[0.08] hover:border-primary/30"
                        }`}
                      >
                        <div
                          className="w-full h-12 rounded-[8px] mb-2"
                          style={{ backgroundColor: color.value }}
                        />
                        <p className="text-sm font-medium text-foreground/70">
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
                  <h2 className="text-3xl font-black text-primary mb-2">
                    Upload your logo
                  </h2>
                  <p className="text-subtext mb-8">
                    Add a logo to make your collection page branded.
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
                    className="w-full p-8 border-2 border-dashed border-border/20 rounded-[12px] hover:border-primary/40 transition-all duration-300 group"
                  >
                    {workspace.logo ? (
                      <img
                        src={workspace.logo}
                        alt="Logo preview"
                        className="max-h-24 mx-auto"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                          <Upload className="w-6 h-6 text-subtext group-hover:text-primary transition-colors duration-300" />
                        </div>
                        <p className="text-sm text-subtext">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-subtext/60 mt-1">
                          PNG, JPG up to 2MB
                        </p>
                      </div>
                    )}
                  </button>
                  <button
                    onClick={() => handleNext()}
                    className="mt-4 text-sm text-subtext hover:text-primary transition-colors"
                  >
                    Skip for now →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-12">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={step === 1}
                className="opacity-0 pointer-events-none data-[visible=true]:opacity-100 data-[visible=true]:pointer-events-auto transition-opacity"
                data-visible={step > 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                variant="hero"
                onClick={handleNext}
                disabled={step === 1 && !workspace.name}
                className="group"
              >
                {step === 3 ? "Launch Dashboard" : "Continue"}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Live Preview */}
      <div className="hidden lg:flex flex-1 bg-slate items-center justify-center p-12">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Live Preview
            </span>
          </div>

          <div
            className="bg-background rounded-[16px] p-8 border border-border/[0.08] shadow-[0_32px_64px_-16px_rgba(26,63,100,0.15)] transition-all duration-500"
            style={{ borderTopColor: workspace.color, borderTopWidth: 4 }}
          >
            {/* Logo */}
            <div className="h-10 mb-6 flex items-center">
              {workspace.logo ? (
                <img
                  src={workspace.logo}
                  alt="Logo"
                  className="max-h-full object-contain"
                />
              ) : (
                <div className="h-8 w-24 bg-slate rounded" />
              )}
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold mb-2" style={{ color: workspace.color }}>
              {workspace.name || "Your Workspace"}
            </h3>
            <p className="text-sm text-subtext mb-6">
              Share your experience with us
            </p>

            {/* Mock form */}
            <div className="space-y-3">
              <div className="h-10 bg-slate rounded-[8px]" />
              <div className="h-24 bg-slate rounded-[8px]" />
              <div
                className="h-10 rounded-[8px]"
                style={{ backgroundColor: workspace.color }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;
