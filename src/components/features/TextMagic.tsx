import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Lock, Loader2, Minimize2, FileText, Globe, Wand2, AlignJustify, Maximize2 } from "lucide-react";
import { useAIFeatures } from "@/hooks/useUserPlan";

interface TextMagicProps {
  text: string;
  onTextUpdated: (newText: string) => void;
  isLocked?: boolean;
  spaceId?: string;
}

export const TextMagic = ({ text, onTextUpdated, isLocked = false, spaceId }: TextMagicProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { enhanceText, loading } = useAIFeatures();

  const handleEnhance = async (mode: 'shorten' | 'medium' | 'longer' | 'simplify' | 'fix' | 'translate') => {
    if (!text.trim()) return;

    const enhanced = await enhanceText(text, mode, spaceId);
    if (enhanced) {
      onTextUpdated(enhanced);
      setIsOpen(false);
    }
  };

  if (isLocked) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate/50 rounded-lg border border-border/[0.08] opacity-60 text-sm">
        <Lock className="w-3.5 h-3.5 text-subtext" />
        <span className="text-subtext">AI Enhance</span>
        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">Pro</span>
      </div>
    );
  }

  if (!text || text.length < 10) {
    return null;
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-1.5 h-8 text-xs"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Sparkles className="w-3.5 h-3.5" />
        )}
        AI Enhance
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            className="absolute right-0 top-full mt-1 z-20 bg-card rounded-xl p-3 border border-border/[0.08] shadow-lg min-w-[220px]"
          >
            <p className="text-xs text-subtext mb-2 px-1">Transform your text</p>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleEnhance('fix')}
                disabled={loading}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/5 transition-colors text-left border border-primary/20 bg-primary/5 mb-2"
              >
                <Wand2 className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-bold text-primary">Recommended</p>
                  <p className="text-xs text-primary/70">Fix grammar & flow</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleEnhance('shorten')}
                disabled={loading}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate transition-colors text-left"
              >
                <Minimize2 className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-primary">Shorten this</p>
                  <p className="text-xs text-subtext">Make it concise</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleEnhance('medium')}
                disabled={loading}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate transition-colors text-left"
              >
                <AlignJustify className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-primary">Medium length</p>
                  <p className="text-xs text-subtext">Balanced detail</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleEnhance('longer')}
                disabled={loading}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate transition-colors text-left"
              >
                <Maximize2 className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-primary">Longer</p>
                  <p className="text-xs text-subtext">Add more detail</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleEnhance('simplify')}
                disabled={loading}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate transition-colors text-left"
              >
                <FileText className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-primary">Simple words</p>
                  <p className="text-xs text-subtext">Easier to understand</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleEnhance('translate')}
                disabled={loading}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate transition-colors text-left border-t border-border/[0.08] mt-1 pt-2"
              >
                <Globe className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-primary">Translate</p>
                  <p className="text-xs text-subtext">Convert to English</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
