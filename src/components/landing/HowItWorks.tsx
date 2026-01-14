import { motion } from "framer-motion";
import { LinkIcon, Video, Wand2, Layout, Code } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    {
        title: "Create Link",
        description: "Generate a unique collection page.",
        icon: LinkIcon,
        color: "bg-blue-500",
        delay: 0.1
    },
    {
        title: "Collect",
        description: "Customers record video or write text.",
        icon: Video,
        color: "bg-red-500",
        delay: 0.2
    },
    {
        title: "AI Polish",
        description: "Script assistant & teleprompter for users.",
        icon: Wand2,
        color: "bg-purple-500",
        delay: 0.3
    },
    {
        title: "Design",
        description: "Choose from beautiful layouts.",
        icon: Layout,
        color: "bg-amber-500",
        delay: 0.4
    },
    {
        title: "Embed",
        description: "Copy code, paste to website.",
        icon: Code,
        color: "bg-emerald-500",
        delay: 0.5
    }
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-zinc-50 dark:bg-zinc-950">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Header */}
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4"
                    >
                        Workflow
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 mb-6"
                    >
                        How Vouchy works
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-muted-foreground"
                    >
                        Streamlined for speed. Get set up in minutes.
                    </motion.p>
                </div>

                {/* Steps Card Grid - Matching Bento Aesthetics */}
                <div className="grid md:grid-cols-5 gap-4">

                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: feature.delay, duration: 0.5 }}
                            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-all text-center flex flex-col items-center group relative overflow-hidden"
                        >
                            {/* Connector line for mobile */}
                            {index < features.length - 1 && (
                                <div className="md:hidden absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-zinc-200 dark:bg-zinc-800 -mb-6 z-0" />
                            )}

                            {/* Arrow for desktop */}
                            {index < features.length - 1 && (
                                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-6 z-20 text-zinc-300 dark:text-zinc-700 pointer-events-none">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                </div>
                            )}

                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110",
                                "bg-zinc-100 dark:bg-zinc-800"
                            )}>
                                <feature.icon className={cn("w-6 h-6", feature.color.replace("bg-", "text-"))} />
                            </div>

                            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mb-2">{feature.title}</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Number Watermark */}
                            <div className="absolute top-2 right-4 text-[60px] font-black text-zinc-900/[0.03] dark:text-white/[0.03] pointer-events-none -z-10 select-none">
                                {index + 1}
                            </div>

                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
