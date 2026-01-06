import { motion, AnimatePresence } from "framer-motion";
import { Quote, Loader2, Heart } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Tables } from "@/integrations/supabase/types";
import { CustomStyles, hexToHSL, defaultStyles } from "@/utils/widgetUtils";

// Import Layouts
import { MinimalLayout } from "./widgets/layouts/MinimalLayout";
import { CardsLayout } from "./widgets/layouts/CardsLayout";
import { MasonryLayout } from "./widgets/layouts/MasonryLayout";
import { AvatarLayout } from "./widgets/layouts/AvatarLayout";
import { BentoLayout } from "./widgets/layouts/BentoLayout";
import { MarqueeLayout } from "./widgets/layouts/MarqueeLayout";
import { StackLayout } from "./widgets/layouts/StackLayout";
import { SpotlightLayout } from "./widgets/layouts/SpotlightLayout";

interface WidgetPreviewProps {
  testimonials: Tables<"testimonials">[];
  darkMode: boolean;
  layout: string;
  showVideoFirst: boolean;
  initialCustomStyles?: Partial<CustomStyles>;
  customStyles?: CustomStyles;
  onCustomStylesChange?: (styles: CustomStyles) => void;
  readOnly?: boolean;
  previewDevice?: "desktop" | "tablet" | "mobile";
}

// --- Device Frames ---
const MobileFrame = ({ children, darkMode }: { children: React.ReactNode, darkMode: boolean }) => (
  <div className="relative rounded-[3rem] border-[14px] border-[#1a1a1a] bg-[#1a1a1a] shadow-2xl overflow-hidden w-[400px] h-[840px] shrink-0">
    {/* Side Buttons */}
    <div className="absolute top-28 -left-[16px] w-[4px] h-10 bg-[#2a2a2a] rounded-l-md" />
    <div className="absolute top-44 -left-[16px] w-[4px] h-16 bg-[#2a2a2a] rounded-l-md" />
    <div className="absolute top-36 -right-[16px] w-[4px] h-24 bg-[#2a2a2a] rounded-r-md" />

    {/* Inner Screen */}
    <div className={`relative w-full h-full rounded-[2.2rem] overflow-hidden ${darkMode ? "bg-black" : "bg-white"}`}>
      {/* Dynamic Island */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 min-w-[120px] h-[32px] bg-black rounded-full z-50 flex justify-center items-center shadow-sm">
        <div className="w-[80px] h-[20px] bg-neutral-900/50 rounded-full" />
        <div className="relative left-[6px] w-2 h-2 bg-[#1a1a2a] rounded-full opacity-60" />
      </div>

      {/* Status Bar Indicators (Mock) */}
      <div className="absolute top-1.5 right-6 text-[10px] font-bold text-white z-50">5G</div>
      <div className="absolute top-1.5 left-8 text-[10px] font-bold text-white z-50">9:41</div>

      {children}

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-neutral-500/50 rounded-full z-50" />
    </div>
  </div>
);

const TabletFrame = ({ children, darkMode }: { children: React.ReactNode, darkMode: boolean }) => (
  <div className="relative rounded-[2rem] border-[12px] border-[#1a1a1a] bg-[#1a1a1a] shadow-2xl overflow-hidden w-[840px] h-[1100px] shrink-0">
    {/* Inner Screen */}
    <div className={`relative w-full h-full rounded-[1.4rem] overflow-hidden ${darkMode ? "bg-black" : "bg-white"}`}>
      {/* Camera Dot */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/80 rounded-full z-50" />
      {children}
    </div>
  </div>
);

const DesktopFrame = ({ children, darkMode }: { children: React.ReactNode, darkMode: boolean }) => (
  <div className="relative rounded-lg bg-white dark:bg-slate-900 shadow-2xl overflow-hidden w-[1280px] h-[840px] flex flex-col shrink-0 border border-slate-200 dark:border-slate-800">
    {/* Browser Bar */}
    <div className="h-10 bg-slate-100 dark:bg-slate-900 border-b dark:border-slate-800 flex items-center px-4 gap-4 shrink-0">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E]" />
        <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-[#D89E24]" />
        <div className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29]" />
      </div>
      {/* Address Bar */}
      <div className="flex-1 max-w-2xl mx-auto h-7 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-[5px] shadow-sm flex items-center justify-center text-[11px] text-slate-400 font-medium">
        <span className="opacity-50 mr-1">🔒</span> vouchy.io/widgets/preview
      </div>
      <div className="w-16" /> {/* Balance */}
    </div>
    {/* Content */}
    <div className={`flex-1 w-full relative ${darkMode ? "bg-black" : "bg-white"}`}>
      {children}
    </div>
  </div>
);


export const WidgetPreview = ({
  testimonials,
  darkMode,
  layout,
  showVideoFirst,
  initialCustomStyles,
  customStyles: propStyles,
  readOnly,
  previewDevice = "desktop",
}: WidgetPreviewProps) => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const effectiveStyles = propStyles || (initialCustomStyles ? { ...defaultStyles, ...initialCustomStyles } : defaultStyles);

  const approved = testimonials.filter((t) => t.status === "approved");
  const sorted = showVideoFirst ? [...approved].sort((a, b) => (a.type === "video" ? -1 : 1)) : approved;
  const displayItems = sorted.slice(0, 8);

  useEffect(() => { setCarouselIndex(0); }, [layout]);

  const renderWidget = () => {
    if (displayItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-8">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-16 h-16 mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Quote className="w-8 h-8 text-primary/40" />
          </motion.div>
          <p className="text-sm font-medium opacity-60">Add testmonials to view preview</p>
        </div>
      );
    }

    const layoutProps = {
      displayItems,
      darkMode,
      customStyles: effectiveStyles,
      scrollContainerRef,
      previewDevice: readOnly ? "desktop" : previewDevice,
      layout: "grid" as any
    };

    const layouts: Record<string, JSX.Element> = {
      minimal: <MinimalLayout {...layoutProps} />,
      cards: <CardsLayout {...layoutProps} />,
      masonry: <MasonryLayout {...layoutProps} />,
      avatar: <AvatarLayout {...layoutProps} />,
      bento: <BentoLayout {...layoutProps} />,
      marquee: <MarqueeLayout {...layoutProps} />,
      stack: <StackLayout {...layoutProps} carouselIndex={carouselIndex} nextSlide={() => setCarouselIndex(i => (i + 1) % Math.max(displayItems.length, 1))} prevSlide={() => setCarouselIndex(i => (i - 1 + displayItems.length) % Math.max(displayItems.length, 1))} />,
      spotlight: <SpotlightLayout {...layoutProps} carouselIndex={carouselIndex} setCarouselIndex={setCarouselIndex} activeStyle={layout} nextSlide={() => setCarouselIndex(i => (i + 1) % Math.max(displayItems.length, 1))} prevSlide={() => setCarouselIndex(i => (i - 1 + displayItems.length) % Math.max(displayItems.length, 1))} />,
    };

    return layouts[layout] || <MinimalLayout {...layoutProps} />;
  };

  // Embed Mode (No Lab Frame)
  if (readOnly) return <div className="w-full">{renderWidget()}</div>;

  // Lab Mode Content (Scrollable Inner)
  const Content = (
    <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 p-4 md:p-10"
      style={{
        ...(effectiveStyles.primaryColor ? { "--primary": hexToHSL(effectiveStyles.primaryColor) } as any : {}),
        backgroundColor: effectiveStyles.backgroundColor || (darkMode ? "#000" : "#fff"),
        color: effectiveStyles.textColor || (darkMode ? "#fff" : "#000"),
      }}
    >
      {/* Lab-Only Header: Premium Design with Disclaimer */}
      {!readOnly && (
        <div className="mb-8 md:mb-16 text-center px-2 pt-6 space-y-4">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter leading-tight break-words"
          >
            Vouchy Testimonies
          </motion.h1>

          <div className="relative flex items-center justify-center py-4 px-4">
            <div className="absolute left-4 right-4 h-px bg-current opacity-10" />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative z-10 px-3 bg-inherit text-[9px] md:text-xs font-semibold text-muted-foreground/60 uppercase tracking-widest text-center"
              style={{ backgroundColor: effectiveStyles.backgroundColor || (darkMode ? "#000" : "#fff") }}
            >
              * Header not included in embed
            </motion.span>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${layout}-${previewDevice}-${darkMode}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderWidget()}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return (
    <div className="w-full h-full flex items-center justify-center p-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={previewDevice}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          {previewDevice === "mobile" && <MobileFrame darkMode={darkMode}>{Content}</MobileFrame>}
          {previewDevice === "tablet" && <TabletFrame darkMode={darkMode}>{Content}</TabletFrame>}
          {previewDevice === "desktop" && <DesktopFrame darkMode={darkMode}>{Content}</DesktopFrame>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};