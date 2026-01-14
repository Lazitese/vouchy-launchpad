import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { TbPlayerPlayFilled, TbHeartFilled, TbStarFilled } from "react-icons/tb";

const ProductShowcase = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section className="py-24 lg:py-32 px-6 overflow-hidden bg-gray-50/50 dark:bg-zinc-900/50" ref={containerRef}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Minimal Copy */}
          <div className="max-w-md">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black tracking-tight mb-6"
            >
              Build trust <br />
              <span className="text-primary">on autopilot.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              Forget chasing clients for reviews. Vouchy automates the entire process so you can focus on building.
            </motion.p>
          </div>

          {/* Right: Storytelling Visual - Autopilot Automation */}
          <div className="relative h-[450px] flex items-center justify-center">

            {/* The Dashboard Card */}
            <motion.div
              style={{ y }}
              className="relative w-full max-w-[400px] bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl border border-border/50 overflow-hidden"
            >

              {/* Header */}
              <div className="border-b border-border/50 p-4 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-[10px] font-bold text-green-700 dark:text-green-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  AUTOPILOT ON
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6">

                {/* Trust Score Gauge */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Trust Score</p>
                    <motion.h3
                      className="text-3xl font-black text-foreground"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                    >
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 2 }}
                      >
                        100
                      </motion.span>
                      <span className="text-sm font-bold text-muted-foreground ml-1">/ 100</span>
                    </motion.h3>
                  </div>
                  {/* Radial Graph */}
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="32" cy="32" r="28" className="stroke-zinc-100 dark:stroke-zinc-800" strokeWidth="6" fill="none" />
                      <motion.circle
                        cx="32" cy="32" r="28"
                        className="stroke-primary"
                        strokeWidth="6" fill="none"
                        strokeDasharray="175"
                        strokeDashoffset="175"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 175 }}
                        whileInView={{ strokeDashoffset: 0 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <TbHeartFilled className="w-5 h-5 text-red-500 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity List */}
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-3 ml-1">Live Activity</p>
                  <div className="space-y-3">
                    {[
                      { name: "Sarah J.", action: "New Video Review", icon: TbPlayerPlayFilled, color: "bg-blue-500", delay: 0.5 },
                      { name: "Mike T.", action: "5 Star Rating", icon: TbHeartFilled, color: "bg-red-500", delay: 1.2 },
                      { name: "Emily R.", action: "New Testimonial", icon: TbStarFilled, color: "bg-yellow-500", delay: 1.9 },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-border/40"
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: item.delay, duration: 0.5 }}
                      >
                        <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-white shadow-sm`}>
                          <item.icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{item.action}</p>
                          <p className="text-[10px] text-muted-foreground truncate">Just now • {item.name}</p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Background Glow */}
              <motion.div
                className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />

            </motion.div>

            {/* Floating Elements (Incoming Reviews) */}
            <div className="absolute top-0 right-0 bottom-0 left-0 pointer-events-none overflow-hidden">
              {[1, 2, 3, 4].map(i => (
                <motion.div
                  key={i}
                  className="absolute bg-white dark:bg-zinc-800 p-2 rounded-xl shadow-lg border border-border/50 text-yellow-500"
                  initial={{
                    x: Math.random() > 0.5 ? 400 : -400,
                    y: Math.random() * 200 - 100,
                    opacity: 0,
                    scale: 0.5
                  }}
                  whileInView={{
                    x: Math.random() * 40 - 20, // Converge to center
                    y: Math.random() * 40 - 20,
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.8,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                >
                  <TbStarFilled className="w-4 h-4" />
                </motion.div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
