import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TbArrowRight, TbPlayerPlay, TbCheck } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Hero() {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-20 lg:pt-40 lg:pb-32">
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-primary/10 to-transparent opacity-60 blur-3xl rounded-full translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 opacity-40 blur-3xl rounded-full -translate-x-1/3 translate-y-1/4" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">

          {/* LEFT: Content */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0"
          >
            {/* Pill */}
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 mb-8 hover:bg-zinc-50 transition-colors cursor-default">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider">V 2.0 is Live</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeIn} className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 mb-6 leading-[1.1]">
              Collect reviews <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600 relative">
                while you sleep.
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </motion.h1>

            {/* Subhead */}
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-zinc-500 mb-8 leading-relaxed">
              The easiest way to collect video & text testimonials.
              Embed a beautiful wall of love on your site in minutes and watch your conversions soar.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="h-14 px-8 rounded-full bg-zinc-900 text-white text-base font-semibold hover:bg-zinc-800 hover:scale-105 transition-all shadow-xl shadow-zinc-900/10 w-full sm:w-auto"
              >
                Start for free <TbArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById('design-showcase')?.scrollIntoView({ behavior: 'smooth' })}
                className="h-14 px-8 rounded-full bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50 text-base font-semibold w-full sm:w-auto"
              >
                <TbPlayerPlay className="mr-2 w-5 h-5 fill-current opacity-80" /> View Demo
              </Button>
            </motion.div>

            {/* Ease of Use / Features Text (Replaces Social Proof) */}
            <motion.div variants={fadeIn} className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-sm text-zinc-500 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span>Setup in 2 minutes</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-zinc-300 rounded-full" />
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>No design skills needed</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-zinc-300 rounded-full" />
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Free forever plan</span>
              </div>
            </motion.div>
          </motion.div>


          {/* RIGHT: Visual Composition */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center lg:justify-end perspective-[2000px] z-10"
          >
            {/* Main Dashboard Card (Tilted) */}
            <motion.div
              animate={{ rotateY: -10, rotateX: 5 }}
              className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-100 p-2 transform transition-transform duration-500 hover:rotate-0"
            >
              {/* Mock Browser/App Header */}
              <div className="h-8 bg-zinc-50 rounded-t-xl border-b border-zinc-100 flex items-center px-3 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
              </div>
              {/* Content Area - Grid Layout for Testimonials */}
              <div className="p-4 bg-zinc-50/50 min-h-[300px] rounded-b-xl">
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white p-3 rounded-lg border border-zinc-100 shadow-sm flex flex-col gap-2 opacity-80 blur-[0.5px]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-zinc-200" />
                        <div className="h-1.5 w-16 bg-zinc-200 rounded" />
                      </div>
                      <div className="space-y-1">
                        <div className="h-1.5 w-full bg-zinc-100 rounded" />
                        <div className="h-1.5 w-2/3 bg-zinc-100 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Floating "Success" Card Accent - Moved to Right Side */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: [0, -10, 0], opacity: 1 }}
              transition={{
                y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                opacity: { duration: 0.5, delay: 0.6 }
              }}
              className="absolute top-1/2 -right-6 lg:-right-12 -translate-y-1/2 z-20 w-64"
            >
              <div className="bg-zinc-900 text-white p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-zinc-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <Avatar className="w-8 h-8 border-2 border-zinc-800">
                      <AvatarImage src="https://i.pravatar.cc/150?u=a" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-zinc-900">
                      <TbCheck size={8} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-xs">New Testimonial</div>
                    <div className="text-[10px] text-zinc-400">Just now • Video</div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5, delay: 1 }}
                      className="h-full bg-green-500"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-500 font-medium">
                    <span>Syncing...</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-12 right-12 w-24 h-24 border border-dashed border-zinc-200 rounded-full opacity-50 z-0"
            />
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-primary/20 blur-[80px] rounded-full z-0 pointer-events-none" />

          </motion.div>

        </div>
      </div>
    </section>
  );
}