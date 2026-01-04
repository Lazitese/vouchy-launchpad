import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Lock, Loader2, X, Wand2 } from "lucide-react";
import { useAIFeatures } from "@/hooks/useUserPlan";

interface AIScriptGeneratorProps {
  questions: string[];
  onScriptGenerated: (script: string) => void;
  isLocked?: boolean;
}

export const AIScriptGenerator = ({ 
  questions, 
  onScriptGenerated,
  isLocked = false 
}: AIScriptGeneratorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [keywords, setKeywords] = useState("");
  const { generateScript, loading } = useAIFeatures();

  const handleGenerate = async () => {
    if (!keywords.trim()) return;
    
    const script = await generateScript(keywords, questions);
    if (script) {
      onScriptGenerated(script);
      setIsOpen(false);
      setKeywords("");
    }
  };

  if (isLocked) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-slate/50 rounded-lg border border-border/[0.08] opacity-60">
        <Lock className="w-4 h-4 text-subtext" />
        <span className="text-sm text-subtext">AI Script Generator</span>
        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-auto">Pro</span>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Sparkles className="w-4 h-4" />
        AI Script
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-xl p-6 w-full max-w-md border border-border/[0.08] shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Wand2 className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-primary">AI Script Generator</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-slate rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-subtext" />
                </button>
              </div>

              <p className="text-sm text-subtext mb-4">
                Enter keywords about your experience and we'll generate a natural script for your video testimonial.
              </p>

              <Input
                placeholder="e.g., productivity, time saved, great support..."
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="mb-4"
              />

              <div className="text-xs text-subtext mb-4">
                <p className="font-medium mb-1">Questions your script will cover:</p>
                <ul className="list-disc pl-4 space-y-1">
                  {questions.slice(0, 3).map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                  {questions.length > 3 && <li>...and {questions.length - 3} more</li>}
                </ul>
              </div>

              <Button
                variant="hero"
                className="w-full gap-2"
                onClick={handleGenerate}
                disabled={loading || !keywords.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Script
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
