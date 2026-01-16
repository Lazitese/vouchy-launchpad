import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Zap, Video, ShieldCheck, Link as LinkIcon, Download, Code2, Users, CheckCircle2, MessageSquare, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Hero() {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="relative bg-white pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
      {/* Engineering Grid Background - Subtle Precision */}
      <div className="absolute inset-0 z-0 opacity-[0.03] [mask-image:linear-gradient(to_bottom,black_60%,transparent)]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* LEFT: Content */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0"
          >
            {/* Pill */}
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100/80 border border-zinc-200 text-zinc-600 mb-8 backdrop-blur-sm cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">The Future of Social Proof</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeIn} className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 mb-6 leading-[1.05]">
              The easiest way to collect
              <span className="inline-flex items-center -space-x-4 ml-2 align-middle transform translate-y-[-4px]">
                {[1, 2, 3, 4].map((i) => (
                  <Avatar key={i} className="w-10 h-10 md:w-14 md:h-14 border-4 border-white ring-1 ring-emerald-500/20 dark:border-zinc-900 overflow-hidden">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${i + 10}`} alt={`User ${i}`} className="object-cover" />
                    <AvatarFallback className="bg-zinc-100 text-zinc-500 text-[10px] font-bold">U{i}</AvatarFallback>
                  </Avatar>
                ))}
              </span>
              <span className="ml-2 text-emerald-600">testimonials.</span>
            </motion.h1>

            {/* Subhead */}
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-zinc-500 mb-8 leading-relaxed font-light">
              Send a link. Get testimonials. Embed it anywhere. <br className="hidden md:block" />
              Turn your happy customers into your best marketing team.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="h-14 px-8 rounded-2xl bg-zinc-900 text-white text-base font-semibold hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-zinc-900/10 w-full sm:w-auto overflow-hidden group relative"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                Start Collecting for Free <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="h-14 px-8 rounded-2xl bg-white/50 backdrop-blur-sm text-zinc-700 border-zinc-200 hover:bg-white text-base font-semibold w-full sm:w-auto"
              >
                <Play className="mr-2 w-4 h-4 fill-zinc-900" /> See How It Works
              </Button>
            </motion.div>
          </motion.div>


          {/* RIGHT: Detailed Engineering Diagram */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center lg:justify-end"
          >
            {/* 
               Updated Diagram: Focusing on User Assistance (AI Script, Teleprompter)
            */}
            <div className="relative w-full max-w-[480px] p-8 bg-zinc-50/50 rounded-2xl border border-zinc-100 flex flex-col gap-8">

              {/* STEP 1: SOURCE */}
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-lg bg-white border border-zinc-200 shadow-sm flex items-center justify-center text-zinc-400 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-900">1. Customer Input</div>
                  <div className="text-xs text-zinc-400 font-mono">Stream: Video / Audio</div>
                </div>
              </div>

              {/* Connector Line 1 */}
              <div className="absolute left-[54px] top-[80px] w-0.5 h-[60px] bg-zinc-200">
                <motion.div
                  animate={{ height: ["0%", "100%", "0%"], top: ["0%", "0%", "100%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute w-full bg-blue-500 opacity-50"
                />
              </div>

              {/* STEP 2: PROCESSING LAYER (Replaces "Vouchy Engine" with AI Assistant steps) */}
              <div className="ml-8 relative z-10 bg-white p-4 rounded-xl border border-blue-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-xs font-bold text-zinc-700">Vouchy AI Assistant</span>
                </div>

                {/* Task 1: Script Gen */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-zinc-50 border border-zinc-100 flex items-center justify-center text-blue-500">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-zinc-700">AI Scripting</div>
                    <div className="text-[10px] text-zinc-400">Generates ideas & structure</div>
                  </div>
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                </div>

                {/* Task 2: Teleprompter */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-zinc-50 border border-zinc-100 flex items-center justify-center text-purple-500">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-zinc-700">Teleprompter</div>
                    <div className="text-[10px] text-zinc-400">Guides recording flow</div>
                  </div>
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                </div>
              </div>

              {/* Connector Line 2 */}
              <div className="absolute left-[54px] top-[260px] w-0.5 h-[60px] bg-zinc-200">
                <motion.div
                  animate={{ height: ["0%", "100%", "0%"], top: ["0%", "0%", "100%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.5 }}
                  className="absolute w-full bg-emerald-500 opacity-50"
                />
              </div>

              {/* STEP 3: OUTPUT */}
              <div className="flex items-center gap-4 relative z-10 pt-4">
                <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 shadow-sm flex items-center justify-center text-white shrink-0">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-900">3. Widget Deployment</div>
                  <div className="text-xs text-zinc-400 font-mono">Output: Optimized Embed</div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}