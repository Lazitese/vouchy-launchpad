import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WidgetPreview } from "@/components/WidgetPreview";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Sparkles } from "lucide-react";

// Dummy Data for Previews
const DUMMY_TESTIMONIALS = [
    {
        id: "1",
        content: "Vouchy has completely transformed how we collect feedback. It's incredibly easy to use!",
        author_name: "Sarah Jenkins",
        author_title: "Product Manager",
        author_avatar: "https://i.pravatar.cc/150?u=1",
        rating: 5,
        type: "text",
        created_at: new Date().toISOString(),
        status: "approved",
        space_id: "demo",
        video_url: null
    },
    {
        id: "2",
        content: "The video collection feature is a game changer. Our conversion rate went up by 20%.",
        author_name: "Mike Ross",
        author_title: "Founder",
        author_avatar: "https://i.pravatar.cc/150?u=2",
        rating: 5,
        type: "video",
        created_at: new Date().toISOString(),
        status: "approved",
        space_id: "demo",
        video_url: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
        id: "3",
        content: "Simple, fast, and beautiful widgets. I love it.",
        author_name: "Jessica Lee",
        author_title: "Designer",
        author_avatar: "https://i.pravatar.cc/150?u=3",
        rating: 5,
        type: "text",
        created_at: new Date().toISOString(),
        status: "approved",
        space_id: "demo",
        video_url: null
    },
    {
        id: "4",
        content: "Highly recommend this to any business looking to build trust.",
        author_name: "David Chen",
        author_title: "Marketing Lead",
        author_avatar: "https://i.pravatar.cc/150?u=4",
        rating: 4,
        type: "text",
        created_at: new Date().toISOString(),
        status: "approved",
        space_id: "demo",
        video_url: null
    }
] as any[]; // Type cast for simplicity in preview

const TEMPLATES = [
    {
        id: "wall-of-love",
        name: "Wall of Love",
        description: "Our most popular layout. Features a masonry grid that mixes video and text beautifully.",
        layout: "masonry",
        tag: "Popular"
    },
    {
        id: "carousel",
        name: "Review Carousel",
        description: "Perfect for headers or footers. A smooth sliding carousel of your best reviews.",
        layout: "marquee",
        tag: "Compact"
    },
    {
        id: "spotlight",
        name: "Spotlight Slider",
        description: "Focus on one story at a time with a modern slider interface.",
        layout: "spotlight",
        tag: "Premium"
    },
    {
        id: "bento",
        name: "Bento Grid",
        description: "A trendy, clean grid layout that highlights specific testimonials with varied sizes.",
        layout: "bento",
        tag: "Modern"
    },
    {
        id: "stack",
        name: "Stacked Cards",
        description: "Interactive stack of cards. Great for saving space while engaging users.",
        layout: "stack",
        tag: "Interactive"
    },
    {
        id: "minimal",
        name: "Minimal List",
        description: "A clean, simple list for a more understated look.",
        layout: "minimal",
        tag: "Clean"
    },
    {
        id: "cards",
        name: "Basic Cards",
        description: "Classic card grid layout. Clean and professional for any brand.",
        layout: "cards",
        tag: "Classic"
    },
    {
        id: "avatar",
        name: "Avatar Focus",
        description: "Put faces front and center. Perfect for building personal connections.",
        layout: "avatar",
        tag: "Personal"
    },
    {
        id: "timeline",
        name: "Timeline Story",
        description: "A vertical journey through your testimonials. Elegant and engaging.",
        layout: "timeline",
        tag: "Elegant"
    }
];

export default function Templates() {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentTemplate = TEMPLATES[currentIndex];

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? TEMPLATES.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === TEMPLATES.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 font-sans selection:bg-primary/20">
            <Navigation />

            <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200 shadow-sm text-zinc-700 mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <span className="text-xs font-bold uppercase tracking-wider">Design Gallery</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 mb-6"
                    >
                        Choose your style.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-zinc-600 dark:text-zinc-400"
                    >
                        {TEMPLATES.length} professionally designed templates. <br />
                        Fully customizable to match your brand.
                    </motion.p>
                </div>

                {/* Single Card Display */}
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="relative"
                    >
                        {/* Preview Card */}
                        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] border-2 border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">

                            {/* Widget Preview */}
                            <div className="relative h-[600px] bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 p-8 md:p-12 flex items-center justify-center overflow-hidden">
                                {/* Subtle grid pattern */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
                                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="1" fill="none" />
                                            </pattern>
                                        </defs>
                                        <rect width="100%" height="100%" fill="url(#grid)" />
                                    </svg>
                                </div>
                                <div className="w-full h-full overflow-hidden relative" style={{ transform: 'scale(0.75)', transformOrigin: 'center' }}>
                                    <WidgetPreview
                                        testimonials={DUMMY_TESTIMONIALS}
                                        darkMode={false}
                                        layout={currentTemplate.layout}
                                        showVideoFirst={true}
                                        readOnly={true}
                                    />
                                </div>
                            </div>

                            {/* Info Bar */}
                            <div className="p-8 md:p-10 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full">
                                            {currentTemplate.tag}
                                        </span>
                                        <span className="text-sm text-zinc-400">
                                            {currentIndex + 1} / {TEMPLATES.length}
                                        </span>
                                    </div>
                                    <Button
                                        size="lg"
                                        onClick={() => navigate(`/auth?template=${currentTemplate.id}`)}
                                        className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-full h-12 px-8 font-bold shadow-lg"
                                    >
                                        Use this template
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-zinc-50 mb-3">
                                    {currentTemplate.name}
                                </h2>
                                <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
                                    {currentTemplate.description}
                                </p>
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={handlePrev}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 md:-translate-x-20 w-14 h-14 rounded-full bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 shadow-xl flex items-center justify-center text-zinc-900 dark:text-zinc-50 hover:scale-110 transition-transform duration-200"
                            aria-label="Previous template"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 md:translate-x-20 w-14 h-14 rounded-full bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 shadow-xl flex items-center justify-center text-zinc-900 dark:text-zinc-50 hover:scale-110 transition-transform duration-200"
                            aria-label="Next template"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </motion.div>

                    {/* Dots Navigation */}
                    <div className="flex items-center justify-center gap-2 mt-12">
                        {TEMPLATES.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`rounded-full transition-all duration-300 ${idx === currentIndex
                                    ? "w-10 h-2 bg-zinc-900 dark:bg-zinc-50"
                                    : "w-2 h-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600"
                                    }`}
                                aria-label={`Go to template ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-32 text-center bg-zinc-900 dark:bg-zinc-950 rounded-[3rem] p-12 md:p-20 relative overflow-hidden border border-zinc-800">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Ready to showcase your social proof?
                        </h2>
                        <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto">
                            Start collecting testimonials in minutes. No credit card required.
                        </p>
                        <div className="flex justify-center">
                            <Button
                                size="lg"
                                onClick={() => navigate("/auth")}
                                className="h-14 px-10 bg-white text-zinc-900 hover:bg-zinc-100 rounded-full font-bold text-lg shadow-2xl"
                            >
                                Get Started for Free
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>

            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
