import { memo, useState, useMemo } from 'react';
import { motion, LazyMotion, domAnimation } from 'framer-motion';
import { Quote, Star, Play, ArrowRight, Heart, Sparkles, TrendingUp, Award } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Mock data - memoized to prevent recreating on each render
const demoTestimonial = {
    id: '1',
    content: "Vouchy transformed our user feedback loop. It's incredibly intuitive, and our conversion rate jumped by 24% in the first week.",
    name: 'Sarah Chen',
    title: 'Product Director',
    company: 'TechFlow',
    avatar_url: 'https://i.pravatar.cc/150?u=sarah_chen_vouchy',
    rating: 5
};

// Optimized card preview container with lazy motion
const CardPreviewContainer = memo(({
    children,
    title,
    description,
    colorClass,
    delay
}: {
    children: React.ReactNode;
    title: string;
    description: string;
    colorClass: string;
    delay: number;
}) => {
    return (
        <LazyMotion features={domAnimation}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: delay * 0.08, duration: 0.4, ease: "easeOut" }}
                className='group flex flex-col h-full'
            >
                <div className={`relative flex-1 rounded-3xl overflow-hidden bg-gradient-to-br ${colorClass} p-8 md:p-10 flex items-center justify-center min-h-[300px] shadow-sm border border-black/5 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]`}>
                    {/* Optimized background pattern - using CSS instead of SVG */}
                    <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-[length:16px_16px]" />

                    {/* Floating Effect Wrapper */}
                    <div className="relative z-10 w-full max-w-sm transition-transform duration-500 ease-out group-hover:-translate-y-1">
                        {children}
                    </div>
                </div>

                <div className='mt-5 px-2'>
                    <h3 className='text-lg font-bold text-zinc-900 mb-1.5 tracking-tight'>{title}</h3>
                    <p className='text-zinc-500 text-sm leading-relaxed'>{description}</p>
                </div>
            </motion.div>
        </LazyMotion>
    );
});

CardPreviewContainer.displayName = 'CardPreviewContainer';

// Optimized star component
const StarRating = memo(({ rating = 5, size = 12, color = "#10b981", className = "" }: {
    rating?: number;
    size?: number;
    color?: string;
    className?: string;
}) => {
    const stars = useMemo(() => Array.from({ length: 5 }), []);

    return (
        <div className={`flex gap-0.5 ${className}`}>
            {stars.map((_, i) => (
                <Star
                    key={i}
                    size={size}
                    className={i < rating ? "" : "text-gray-200"}
                    style={{
                        fill: i < rating ? color : "transparent",
                        color: i < rating ? color : undefined
                    }}
                />
            ))}
        </div>
    );
});

StarRating.displayName = 'StarRating';

const TestimonialDesignsOptimized = () => {
    const [showAll, setShowAll] = useState(false);
    const visibleDesigns = showAll ? 8 : 4;

    return (
        <section id="design-showcase" className='py-24 md:py-32 bg-white relative overflow-hidden'>
            {/* Optimized Background - using CSS gradients */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]" />
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-primary/10 opacity-20 blur-[120px] pointer-events-none" />

            <div className='container mx-auto px-6 relative z-10'>
                {/* Header */}
                <div className='text-center mb-16 md:mb-20 max-w-3xl mx-auto'>
                    <LazyMotion features={domAnimation}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-primary/20 shadow-sm mb-6'
                        >
                            <span className='flex h-2 w-2 rounded-full bg-primary animate-pulse' />
                            <span className='text-xs font-bold text-primary uppercase tracking-wider'>Premium Designs</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className='text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 mb-5 leading-[1.1]'
                        >
                            Showcase testimonials,{' '}
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-500 to-primary'>
                                beautifully.
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.15 }}
                            className='text-lg md:text-xl text-zinc-600 leading-relaxed'
                        >
                            Choose from our collection of conversion-optimized designs.
                            <br className="hidden md:block" />
                            Fully customizable to match your brand perfectly.
                        </motion.p>
                    </LazyMotion>
                </div>

                {/* Grid - Optimized with CSS Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16 max-w-[1280px] mx-auto'>

                    {/* Design 1: Glassmorphic Minimal */}
                    {visibleDesigns > 0 && (
                        <CardPreviewContainer
                            title="Glassmorphic"
                            description="Modern glass effect with subtle backdrop blur. Perfect for contemporary SaaS products."
                            colorClass="from-emerald-50/30 to-white"
                            delay={0}
                        >
                            <div className='bg-white/60 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-[0_8px_32px_rgba(16,185,129,0.1)] hover:shadow-[0_8px_32px_rgba(16,185,129,0.15)] transition-shadow duration-300'>
                                <div className='flex justify-between items-start mb-4'>
                                    <div className='flex items-center gap-3'>
                                        <Avatar className="h-11 w-11 ring-2 ring-primary/20 shadow-md">
                                            <AvatarImage src={demoTestimonial.avatar_url} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">SC</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className='font-bold text-sm text-zinc-900'>{demoTestimonial.name}</div>
                                            <div className='text-xs text-primary font-medium'>{demoTestimonial.company}</div>
                                        </div>
                                    </div>
                                    <StarRating rating={5} size={13} color="#10b981" />
                                </div>
                                <p className='text-sm text-zinc-700 leading-relaxed'>
                                    "{demoTestimonial.content}"
                                </p>
                            </div>
                        </CardPreviewContainer>
                    )}

                    {/* Design 2: Premium Quote */}
                    {visibleDesigns > 1 && (
                        <CardPreviewContainer
                            title="Premium Quote"
                            description="Elegant design with emphasis on the testimonial content. Great for trust-building."
                            colorClass="from-slate-50 to-white"
                            delay={1}
                        >
                            <div className='bg-white p-7 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-zinc-100 relative overflow-hidden'>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                                <Quote className='absolute text-primary/10 fill-current top-5 right-5 scale-150' size={40} />
                                <div className='relative z-10'>
                                    <StarRating rating={5} size={14} color="#10b981" className="mb-4" />
                                    <p className='text-base font-medium text-zinc-800 mb-5 leading-relaxed'>
                                        "{demoTestimonial.content}"
                                    </p>
                                    <div className='flex items-center gap-3 pt-4 border-t border-zinc-100'>
                                        <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                                            <AvatarImage src={demoTestimonial.avatar_url} />
                                            <AvatarFallback>SC</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className='text-sm font-bold text-zinc-900'>{demoTestimonial.name}</div>
                                            <div className='text-xs text-primary font-semibold'>{demoTestimonial.title}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardPreviewContainer>
                    )}

                    {/* Design 3: Dark Spotlight */}
                    {visibleDesigns > 2 && (
                        <CardPreviewContainer
                            title="Dark Spotlight"
                            description="High-contrast dark mode design that commands attention. Ideal for hero sections."
                            colorClass="from-zinc-900 to-zinc-800"
                            delay={2}
                        >
                            <div className='bg-zinc-950 p-8 rounded-3xl border border-zinc-800 shadow-2xl relative overflow-hidden'>
                                {/* Animated glow */}
                                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/20 blur-[100px] rounded-full animate-pulse" />

                                <div className='relative z-10 flex flex-col items-center text-center'>
                                    <Avatar className="h-16 w-16 ring-4 ring-zinc-900 mb-4 shadow-xl">
                                        <AvatarImage src={demoTestimonial.avatar_url} />
                                        <AvatarFallback>SC</AvatarFallback>
                                    </Avatar>
                                    <StarRating rating={5} size={14} color="#10b981" className="mb-4" />
                                    <p className='text-zinc-200 text-sm leading-relaxed mb-4'>
                                        "{demoTestimonial.content}"
                                    </p>
                                    <div className='text-white font-bold text-sm'>{demoTestimonial.name}</div>
                                    <div className='text-primary text-xs mt-1 font-medium'>{demoTestimonial.company}</div>
                                </div>
                            </div>
                        </CardPreviewContainer>
                    )}

                    {/* Design 4: Bento Compact */}
                    {visibleDesigns > 3 && (
                        <CardPreviewContainer
                            title="Bento Compact"
                            description="Space-efficient design perfect for grid layouts and dashboards."
                            colorClass="from-emerald-50/40 to-white"
                            delay={3}
                        >
                            <div className='bg-white p-5 rounded-3xl border border-zinc-200/60 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden'>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="bg-primary/10 text-primary text-[10px] uppercase font-bold px-2.5 py-1 rounded-full tracking-wider flex items-center gap-1">
                                        <Award size={10} />
                                        Verified
                                    </div>
                                    <Sparkles size={14} className="text-primary/30" />
                                </div>

                                <h4 className="font-bold text-base text-zinc-900 mb-1 leading-tight">"Game changer!"</h4>
                                <p className="text-zinc-600 text-xs mb-4 line-clamp-2 leading-relaxed">
                                    {demoTestimonial.content}
                                </p>

                                <div className="flex items-center gap-3 pt-3 border-t border-dashed border-zinc-200">
                                    <Avatar className="h-9 w-9 rounded-xl ring-2 ring-primary/10">
                                        <AvatarImage src={demoTestimonial.avatar_url} />
                                        <AvatarFallback>SC</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="text-xs font-bold text-zinc-900">{demoTestimonial.name}</div>
                                        <StarRating rating={5} size={8} color="#10b981" className="mt-1" />
                                    </div>
                                </div>
                            </div>
                        </CardPreviewContainer>
                    )}

                    {/* Design 5: Video Testimonial */}
                    {visibleDesigns > 4 && (
                        <CardPreviewContainer
                            title="Video Testimonial"
                            description="Engaging video format with stacked paper effect to boost interaction."
                            colorClass="from-orange-50/40 to-white"
                            delay={4}
                        >
                            <div className="relative pl-2 pb-2">
                                {/* Stacked layers */}
                                <div className="absolute inset-0 bg-white border border-zinc-200 rounded-2xl rotate-2 opacity-50 scale-[0.97]" />
                                <div className="absolute inset-0 bg-white border border-zinc-200 rounded-2xl rotate-[4deg] opacity-25 scale-[0.94]" />

                                {/* Main Card */}
                                <div className="relative bg-white p-2 rounded-2xl border border-zinc-200 shadow-lg">
                                    <div className="aspect-video bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl relative overflow-hidden group/video cursor-pointer">
                                        <img
                                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80"
                                            alt="Video thumbnail"
                                            className="w-full h-full object-cover opacity-50 group-hover/video:opacity-30 transition-opacity"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl transition-transform duration-300 group-hover/video:scale-110">
                                                <Play size={22} className="text-zinc-900 fill-current translate-x-0.5" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                                            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                                                <Avatar className="h-5 w-5 border border-white/20">
                                                    <AvatarImage src={demoTestimonial.avatar_url} />
                                                    <AvatarFallback>SC</AvatarFallback>
                                                </Avatar>
                                                <span className="text-[10px] text-white font-medium">{demoTestimonial.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-2 pt-2 flex justify-between items-center">
                                        <StarRating rating={5} size={10} color="#f97316" />
                                        <span className="text-[10px] text-zinc-400 font-medium">1:24</span>
                                    </div>
                                </div>
                            </div>
                        </CardPreviewContainer>
                    )}

                    {/* Design 6: Trust Badge */}
                    {visibleDesigns > 5 && (
                        <CardPreviewContainer
                            title="Trust Badge"
                            description="Human-centered design perfect for pricing pages and checkout flows."
                            colorClass="from-rose-50/40 to-white"
                            delay={5}
                        >
                            <div className="mt-8 bg-white rounded-2xl shadow-md border border-rose-100/60 p-6 pt-0 text-center relative">
                                <div className="absolute -top-7 left-1/2 -translate-x-1/2">
                                    <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
                                        <AvatarImage src={demoTestimonial.avatar_url} />
                                        <AvatarFallback>SC</AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1 bg-rose-500 rounded-full p-1.5 border-2 border-white shadow-sm">
                                        <Heart size={9} className="text-white fill-current" />
                                    </div>
                                </div>

                                <div className="mt-11 mb-3">
                                    <div className="font-bold text-zinc-900 text-sm">{demoTestimonial.name}</div>
                                    <div className="text-xs text-rose-600 font-semibold mt-0.5">{demoTestimonial.company}</div>
                                </div>

                                <p className="text-sm text-zinc-600 italic leading-relaxed mb-4">
                                    "{demoTestimonial.content}"
                                </p>

                                <div className="inline-flex gap-1 bg-rose-50 px-3 py-1.5 rounded-full">
                                    <StarRating rating={5} size={10} color="#f43f5e" />
                                </div>
                            </div>
                        </CardPreviewContainer>
                    )}

                    {/* Design 7: Gradient Border */}
                    {visibleDesigns > 6 && (
                        <CardPreviewContainer
                            title="Gradient Border"
                            description="Eye-catching gradient border that draws attention while maintaining elegance."
                            colorClass="from-purple-50/30 to-white"
                            delay={6}
                        >
                            <div className='relative p-[2px] rounded-2xl bg-gradient-to-br from-primary via-emerald-400 to-primary shadow-lg hover:shadow-xl transition-shadow'>
                                <div className='bg-white p-6 rounded-2xl'>
                                    <div className='flex items-start gap-3 mb-4'>
                                        <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                                            <AvatarImage src={demoTestimonial.avatar_url} />
                                            <AvatarFallback>SC</AvatarFallback>
                                        </Avatar>
                                        <div className='flex-1'>
                                            <div className='font-bold text-sm text-zinc-900'>{demoTestimonial.name}</div>
                                            <div className='text-xs text-zinc-500 mb-2'>{demoTestimonial.title}</div>
                                            <StarRating rating={5} size={12} color="#10b981" />
                                        </div>
                                    </div>
                                    <p className='text-sm text-zinc-700 leading-relaxed'>
                                        "{demoTestimonial.content}"
                                    </p>
                                    <div className='mt-4 flex items-center gap-2 text-primary'>
                                        <TrendingUp size={14} />
                                        <span className='text-xs font-bold'>+24% conversion</span>
                                    </div>
                                </div>
                            </div>
                        </CardPreviewContainer>
                    )}

                    {/* Design 8: Floating Card */}
                    {visibleDesigns > 7 && (
                        <CardPreviewContainer
                            title="Floating Card"
                            description="3D floating effect with soft shadows for a premium, modern aesthetic."
                            colorClass="from-cyan-50/30 to-white"
                            delay={7}
                        >
                            <div className='bg-white p-6 rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] hover:shadow-[0_25px_60px_rgba(8,_112,_184,_0.2)] transition-all duration-500 transform hover:-translate-y-1 border border-cyan-100/50'>
                                <div className='flex justify-between items-start mb-4'>
                                    <StarRating rating={5} size={14} color="#06b6d4" />
                                    <Quote size={20} className="text-cyan-200 fill-current" />
                                </div>

                                <p className='text-sm text-zinc-700 leading-relaxed mb-5 font-medium'>
                                    "{demoTestimonial.content}"
                                </p>

                                <div className='flex items-center gap-3 pt-4 border-t border-cyan-100'>
                                    <Avatar className="h-10 w-10 ring-2 ring-cyan-500/20">
                                        <AvatarImage src={demoTestimonial.avatar_url} />
                                        <AvatarFallback>SC</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className='font-bold text-sm text-zinc-900'>{demoTestimonial.name}</div>
                                        <div className='text-xs text-cyan-600 font-medium'>{demoTestimonial.company}</div>
                                    </div>
                                </div>
                            </div>
                        </CardPreviewContainer>
                    )}

                </div>

                {/* See More Button */}
                {!showAll && (
                    <LazyMotion features={domAnimation}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex justify-center mt-16"
                        >
                            <button
                                onClick={() => setShowAll(true)}
                                className="group flex items-center gap-3 px-8 py-4 bg-white border-2 border-primary/20 rounded-full hover:border-primary hover:bg-primary/5 transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-105 active:scale-95"
                            >
                                <span className="text-base font-bold text-zinc-900 group-hover:text-primary transition-colors">
                                    Show All Designs
                                </span>
                                <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    </LazyMotion>
                )}
            </div>
        </section>
    );
};

export default memo(TestimonialDesignsOptimized);
