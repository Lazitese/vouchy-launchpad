import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star, Quote, Play, ChevronLeft, ChevronRight, Crown, Lock } from "lucide-react";
import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type Testimonial = Tables<"testimonials">;

interface WidgetPreviewProps {
  testimonials: Testimonial[];
  darkMode: boolean;
  layout: string;
  showVideoFirst: boolean;
}

const widgetStyles = [
  { id: "minimal", name: "Minimal", description: "Clean & subtle", isPro: false },
  { id: "cards", name: "Cards", description: "Modern cards", isPro: false },
  { id: "masonry", name: "Masonry", description: "Pinterest-style", isPro: true },
  { id: "marquee", name: "Marquee", description: "Auto-scroll", isPro: true },
  { id: "spotlight", name: "Spotlight", description: "Featured focus", isPro: true },
] as const;

export const WidgetPreview = ({
  testimonials,
  darkMode,
  layout,
  showVideoFirst,
}: WidgetPreviewProps) => {
  const [activeStyle, setActiveStyle] = useState<string>("minimal");
  const [carouselIndex, setCarouselIndex] = useState(0);

  const approved = testimonials.filter((t) => t.status === "approved");
  const sorted = showVideoFirst
    ? [...approved].sort((a, b) => (a.type === "video" ? -1 : 1))
    : approved;
  const displayItems = sorted.slice(0, 6);

  const baseClasses = darkMode
    ? "bg-gray-950 text-white"
    : "bg-background text-foreground";

  const cardClasses = darkMode
    ? "bg-gray-900/80 border-gray-800"
    : "bg-card border-border/[0.08]";

  const subtextClasses = darkMode ? "text-gray-400" : "text-subtext";

  const nextSlide = () => setCarouselIndex((i) => (i + 1) % Math.max(displayItems.length, 1));
  const prevSlide = () => setCarouselIndex((i) => (i - 1 + displayItems.length) % Math.max(displayItems.length, 1));

  const renderAvatar = (t: Testimonial, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "w-7 h-7",
      md: "w-10 h-10",
      lg: "w-16 h-16"
    };
    const textSizes = {
      sm: "text-[10px]",
      md: "text-sm",
      lg: "text-xl"
    };

    return (
      <div className="relative">
        <Avatar className={`${sizeClasses[size]} ring-2 ring-primary/20`}>
          {t.author_avatar_url ? (
            <AvatarImage src={t.author_avatar_url} alt={t.author_name} />
          ) : null}
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            <span className={textSizes[size]}>{t.author_name.charAt(0)}</span>
          </AvatarFallback>
        </Avatar>
        {t.type === "video" && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center shadow-sm">
            <Play className="w-2 h-2 text-primary-foreground fill-current" />
          </div>
        )}
      </div>
    );
  };

  // Render different widget styles
  const renderWidget = () => {
    if (displayItems.length === 0) {
      return (
        <div className="flex items-center justify-center py-16">
          <p className={`text-sm ${subtextClasses}`}>
            Approve testimonials to see preview
          </p>
        </div>
      );
    }

    switch (activeStyle) {
      case "minimal":
        return (
          <div className="space-y-4">
            {displayItems.slice(0, 3).map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
                className={`p-5 rounded-xl border backdrop-blur-sm ${cardClasses} hover:scale-[1.01] transition-transform duration-300`}
              >
                <div className="flex items-start gap-4">
                  {renderAvatar(t, "md")}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium truncate">{t.author_name}</p>
                      {t.rating && (
                        <div className="flex gap-0.5">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                          ))}
                        </div>
                      )}
                    </div>
                    {t.author_title && (
                      <p className={`text-xs ${subtextClasses} mb-2`}>{t.author_title}</p>
                    )}
                    <p className={`text-sm leading-relaxed ${subtextClasses}`}>
                      {t.content?.slice(0, 100)}...
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case "cards":
        return (
          <div className={`grid gap-4 ${layout === "grid" ? "grid-cols-2" : "grid-cols-1"}`}>
            {displayItems.slice(0, 4).map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -4, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)" }}
                className={`group p-5 rounded-2xl border ${cardClasses} transition-all duration-300 cursor-pointer`}
              >
                <Quote className={`w-6 h-6 mb-3 ${subtextClasses} opacity-30 group-hover:opacity-50 transition-opacity`} />
                <p className={`text-sm leading-relaxed mb-4 ${subtextClasses}`}>
                  "{t.content?.slice(0, 80)}..."
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-current/10">
                  {renderAvatar(t, "sm")}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{t.author_name}</p>
                    {t.author_company && (
                      <p className={`text-[10px] ${subtextClasses} truncate`}>{t.author_company}</p>
                    )}
                  </div>
                  {t.rating && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: Math.min(t.rating, 5) }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        );

      case "masonry":
        return (
          <div className="columns-2 gap-3 space-y-3">
            {displayItems.slice(0, 5).map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                whileHover={{ scale: 1.02 }}
                className={`break-inside-avoid p-4 rounded-xl border ${cardClasses} transition-all duration-200`}
                style={{ minHeight: i % 2 === 0 ? "140px" : "100px" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  {renderAvatar(t, "sm")}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold truncate">{t.author_name}</p>
                    {t.rating && (
                      <div className="flex gap-0.5">
                        {Array.from({ length: Math.min(t.rating, 5) }).map((_, i) => (
                          <Star key={i} className="w-2 h-2 fill-primary text-primary" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <p className={`text-[11px] leading-relaxed ${subtextClasses}`}>
                  {t.content?.slice(0, i % 2 === 0 ? 100 : 60)}...
                </p>
              </motion.div>
            ))}
          </div>
        );

      case "marquee":
        return (
          <div className="relative overflow-hidden py-2">
            <motion.div
              className="flex gap-4"
              animate={{ x: [0, -800] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {[...displayItems, ...displayItems].map((t, i) => (
                <motion.div
                  key={`${t.id}-${i}`}
                  className={`flex-shrink-0 w-64 p-4 rounded-xl border ${cardClasses}`}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {renderAvatar(t, "sm")}
                    <div>
                      <p className="text-xs font-semibold">{t.author_name}</p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: Math.min(t.rating || 5, 5) }).map((_, i) => (
                          <Star key={i} className="w-2 h-2 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className={`text-[11px] leading-relaxed ${subtextClasses}`}>
                    "{t.content?.slice(0, 70)}..."
                  </p>
                </motion.div>
              ))}
            </motion.div>
            {/* Fade edges */}
            <div className={`absolute inset-y-0 left-0 w-12 bg-gradient-to-r ${darkMode ? 'from-gray-950' : 'from-background'} to-transparent pointer-events-none`} />
            <div className={`absolute inset-y-0 right-0 w-12 bg-gradient-to-l ${darkMode ? 'from-gray-950' : 'from-background'} to-transparent pointer-events-none`} />
          </div>
        );

      case "spotlight":
        const current = displayItems[carouselIndex] || displayItems[0];
        return (
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current?.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`p-8 rounded-2xl border ${cardClasses} text-center`}
              >
                <motion.div
                  className="mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                >
                  {renderAvatar(current, "lg")}
                </motion.div>
                
                <div className="flex justify-center gap-1 mb-4">
                  {Array.from({ length: Math.min(current?.rating || 5, 5) }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                    >
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </motion.div>
                  ))}
                </div>

                <Quote className={`w-8 h-8 mx-auto mb-3 ${subtextClasses} opacity-20`} />
                
                <motion.p 
                  className={`text-sm leading-relaxed mb-6 max-w-xs mx-auto ${subtextClasses}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  "{current?.content?.slice(0, 120)}..."
                </motion.p>

                <div>
                  <p className="text-sm font-semibold">{current?.author_name}</p>
                  {current?.author_title && (
                    <p className={`text-xs ${subtextClasses}`}>
                      {current.author_title}{current.author_company && ` at ${current.author_company}`}
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {displayItems.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevSlide}
                  className={`w-8 h-8 rounded-full border ${cardClasses} flex items-center justify-center transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>
                <div className="flex gap-1.5">
                  {displayItems.map((_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setCarouselIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === carouselIndex 
                          ? "w-6 bg-primary" 
                          : `w-1.5 ${darkMode ? 'bg-gray-700' : 'bg-border'} hover:bg-primary/50`
                      }`}
                      whileHover={{ scale: 1.2 }}
                    />
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextSlide}
                  className={`w-8 h-8 rounded-full border ${cardClasses} flex items-center justify-center transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary`}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Style selector */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            Widget Preview
          </span>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {widgetStyles.map((style) => (
            <motion.button
              key={style.id}
              onClick={() => setActiveStyle(style.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative px-4 py-2.5 rounded-xl text-left transition-all duration-300 ${
                activeStyle === style.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-slate hover:bg-slate/80 text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-xs font-semibold">{style.name}</p>
                  <p className={`text-[10px] ${activeStyle === style.id ? 'text-primary-foreground/70' : 'text-subtext'}`}>
                    {style.description}
                  </p>
                </div>
                {style.isPro && (
                  <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    activeStyle === style.id 
                      ? 'bg-primary-foreground/20 text-primary-foreground' 
                      : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    <Crown className="w-2.5 h-2.5" />
                    PRO
                  </div>
                )}
              </div>
              {activeStyle === style.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 rounded-xl border-2 border-primary"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Preview container */}
      <motion.div
        layout
        className={`p-6 rounded-2xl ${baseClasses} transition-colors duration-500`}
        style={{
          boxShadow: darkMode 
            ? "0 0 0 1px rgba(255,255,255,0.05), 0 20px 40px -20px rgba(0,0,0,0.8)" 
            : "0 0 0 1px rgba(0,0,0,0.03), 0 20px 40px -20px rgba(0,0,0,0.1)"
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStyle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {renderWidget()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
