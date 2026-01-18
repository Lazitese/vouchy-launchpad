import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Tables } from "@/integrations/supabase/types";
import { CustomStyles, hexToHSL, defaultStyles } from "@/utils/widgetUtils";

// Import Layouts
import { CardsLayout } from "./widgets/layouts/CardsLayout";
import { BentoLayout } from "./widgets/layouts/BentoLayout";
import { MarqueeLayout } from "./widgets/layouts/MarqueeLayout";
import { TimelineLayout } from "./widgets/layouts/TimelineLayout";
import { FloatingCardsLayout } from "./widgets/layouts/FloatingCardsLayout";
import { GlassPrismLayout } from "./widgets/layouts/GlassPrismLayout";
import { PolaroidStackLayout } from "./widgets/layouts/PolaroidStackLayout";
import { ParallaxScrollLayout } from "./widgets/layouts/ParallaxScrollLayout";
import { MinimalStackedLayout } from "./widgets/layouts/MinimalStackedLayout";
import { CinematicSliderLayout } from "./widgets/layouts/CinematicSliderLayout";
import { OrbitRingLayout } from "./widgets/layouts/OrbitRingLayout";
import { RadialBurstLayout } from "./widgets/layouts/RadialBurstLayout";
import { NewsTickerHeroLayout } from "./widgets/layouts/NewsTickerHeroLayout";
import { MasonryWallLayout } from "./widgets/layouts/MasonryWallLayout";
import { StackedCardsLayout } from "./widgets/layouts/StackedCardsLayout";
import { VideoModal } from "./widgets/VideoModal";

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
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
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

    const handleVideoClick = (videoUrl: string | null) => {
      if (videoUrl) {
        setSelectedVideo(videoUrl);
      }
    };

    const layoutProps = {
      displayItems,
      darkMode,
      customStyles: effectiveStyles,
      scrollContainerRef,
      previewDevice: readOnly ? "desktop" : previewDevice,
      layout: "grid" as any,
      onVideoClick: handleVideoClick
    };

    const layouts: Record<string, JSX.Element> = {
      cards: <CardsLayout {...layoutProps} />,
      bento: <BentoLayout {...layoutProps} />,
      marquee: <MarqueeLayout {...layoutProps} />,
      timeline: <TimelineLayout {...layoutProps} />,
      floating: <FloatingCardsLayout {...layoutProps} />,
      glass: <GlassPrismLayout {...layoutProps} />,
      polaroid: <PolaroidStackLayout {...layoutProps} />,
      parallax: <ParallaxScrollLayout {...layoutProps} />,
      minimalStacked: <MinimalStackedLayout {...layoutProps} />,
      cinematic: <CinematicSliderLayout {...layoutProps} />,
      orbit: <OrbitRingLayout {...layoutProps} />,
      radial: <RadialBurstLayout {...layoutProps} />,
      news: <NewsTickerHeroLayout {...layoutProps} />,
      masonryWall: <MasonryWallLayout {...layoutProps} />,
      deck: <StackedCardsLayout {...layoutProps} />,
    };

    return layouts[layout] || <CardsLayout {...layoutProps} />;
  };

  // Embed Mode (No Lab Frame)
  if (readOnly) {
    return (
      <div className="w-full">
        {renderWidget()}
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          videoUrl={selectedVideo || ""}
        />
      </div>
    );
  }

  // Lab Mode Content (Scrollable Inner)
  const Content = (
    <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 p-4"
      style={{
        ...(effectiveStyles.primaryColor ? { "--primary": hexToHSL(effectiveStyles.primaryColor) } as any : {}),
        backgroundColor: effectiveStyles.backgroundColor || (darkMode ? "#000" : "#fff"),
        color: effectiveStyles.textColor || (darkMode ? "#fff" : "#000"),
      }}
    >
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
    <div className="w-full h-full p-0 overflow-hidden">
      {Content}
      <VideoModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoUrl={selectedVideo || ""}
      />
    </div>
  );
};