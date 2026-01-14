import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TbArrowRight } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-white to-zinc-50 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="container mx-auto max-w-5xl relative z-10 bg-white border border-zinc-200 p-12 md:p-24 rounded-[3rem] text-center shadow-xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tighter mb-6"
        >
          Ready to skyrocket <br /> your conversion?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-zinc-600 text-lg mb-10 max-w-xl mx-auto"
        >
          Join 500+ companies using Vouchy to turn customer stories into revenue.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          <Button 
            size="lg" 
            className="h-16 px-12 rounded-full bg-primary text-white font-black text-xl hover:scale-105 transition-transform shadow-lg"
            onClick={() => navigate("/auth", { state: { mode: "signup" } })}
          >
            Start for free
            <TbArrowRight className="ml-2 w-6 h-6" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}