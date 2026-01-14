import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TbArrowRight, TbCheck } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-4 md:px-6 relative overflow-hidden bg-white">
      <div className="container mx-auto max-w-5xl relative z-10">

        <div className="relative px-8 py-20 text-center">

          {/* Floating Elements - Kept as requested */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-4 md:left-12 hidden md:block"
          >
            <div className="bg-white border border-zinc-200 p-2 rounded-2xl shadow-lg rotate-[-6deg]">
              <Avatar className="w-12 h-12">
                <AvatarImage src="https://i.pravatar.cc/150?u=a" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </motion.div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider">Join Now</span>
          </div>

          {/* Headline */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 max-w-4xl mx-auto leading-[1.1] text-zinc-900">
            Start collecting reviews <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
              in minutes, not days.
            </span>
          </h2>

          {/* Subhead */}
          <p className="text-zinc-500 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            No coding required. Copy and paste one line of code to showcase your social proof and boost credibility instantly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="h-14 px-8 rounded-full bg-zinc-900 text-white font-bold text-lg hover:bg-zinc-800 hover:scale-105 transition-all shadow-xl"
              onClick={() => navigate("/auth", { state: { mode: "signup" } })}
            >
              Get Started for Free
              <TbArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <div className="flex items-center gap-6 text-sm text-zinc-500 font-medium px-4">
              <span className="flex items-center gap-1.5"><TbCheck className="text-primary" /> No credit card</span>
              <span className="flex items-center gap-1.5"><TbCheck className="text-primary" /> Cancel anytime</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}