import { memo, useState, useMemo } from 'react';
import { motion, LazyMotion, domAnimation } from 'framer-motion';
import { Star, ArrowRight, Sparkles, Heart, Send, CheckCircle2, Upload, Mail, User, Briefcase, Building2 } from 'lucide-react';

// Optimized card preview container with lazy motion
const FormPreviewContainer = memo(({
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
                <div className={`relative flex-1 rounded-3xl overflow-hidden bg-gradient-to-br ${colorClass} p-8 md:p-10 flex items-center justify-center min-h-[320px] shadow-sm border border-black/5 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]`}>
                    {/* Optimized background pattern */}
                    <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-[length:16px_16px]" />

                    {/* Floating Effect Wrapper */}
                    <div className="relative z-10 w-full max-w-md transition-transform duration-500 ease-out group-hover:-translate-y-1">
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

FormPreviewContainer.displayName = 'FormPreviewContainer';

// Optimized star component
const StarRating = memo(({ color = "#10b981" }: { color?: string }) => {
    const stars = useMemo(() => Array.from({ length: 5 }), []);

    return (
        <div className="flex gap-1 justify-center">
            {stars.map((_, i) => (
                <Star
                    key={i}
                    size={20}
                    className="transition-all cursor-pointer hover:scale-110"
                    style={{
                        fill: color,
                        color: color
                    }}
                />
            ))}
        </div>
    );
});

StarRating.displayName = 'StarRating';

const FormCustomizationShowcase = () => {
    const [showAll, setShowAll] = useState(false);
    const visibleDesigns = showAll ? 8 : 4;

    return (
        <section id="form-showcase" className='py-24 md:py-32 bg-white relative overflow-hidden'>
            {/* Optimized Background */}
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
                            <span className='text-xs font-bold text-primary uppercase tracking-wider'>Customizable Forms</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className='text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 mb-5 leading-[1.1]'
                        >
                            Collect testimonials,{' '}
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-500 to-primary'>
                                your way.
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.15 }}
                            className='text-lg md:text-xl text-zinc-600 leading-relaxed'
                        >
                            Choose from beautiful form designs that match your brand.
                            <br className="hidden md:block" />
                            Fully customizable fields, colors, and messaging.
                        </motion.p>
                    </LazyMotion>
                </div>

                {/* Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16 max-w-[1280px] mx-auto'>

                    {/* Design 1: Minimal Clean */}
                    {visibleDesigns > 0 && (
                        <FormPreviewContainer
                            title="Minimal Clean"
                            description="Simple, distraction-free form that focuses on what matters. Perfect for professional brands."
                            colorClass="from-zinc-50 to-white"
                            delay={0}
                        >
                            <div className='bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm'>
                                <div className='text-center mb-6'>
                                    <h3 className='text-2xl font-bold text-zinc-900 mb-2'>Share your experience</h3>
                                    <p className='text-sm text-zinc-500'>Your feedback helps us improve</p>
                                </div>

                                <div className='space-y-4'>
                                    <div>
                                        <label className='text-xs font-medium text-zinc-700 mb-1.5 block'>Your Name</label>
                                        <div className='h-10 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center px-3'>
                                            <span className='text-xs text-zinc-400'>John Doe</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className='text-xs font-medium text-zinc-700 mb-1.5 block'>Email</label>
                                        <div className='h-10 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center px-3'>
                                            <span className='text-xs text-zinc-400'>john@example.com</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className='text-xs font-medium text-zinc-700 mb-1.5 block'>Your Review</label>
                                        <div className='h-20 bg-zinc-50 border border-zinc-200 rounded-lg p-3'>
                                            <span className='text-xs text-zinc-400'>Share your thoughts...</span>
                                        </div>
                                    </div>

                                    <button className='w-full py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-colors'>
                                        Submit Review
                                    </button>
                                </div>
                            </div>
                        </FormPreviewContainer>
                    )}

                    {/* Design 2: Glassmorphic Modern */}
                    {visibleDesigns > 1 && (
                        <FormPreviewContainer
                            title="Glassmorphic"
                            description="Modern glass effect with backdrop blur. Stands out on any background beautifully."
                            colorClass="from-emerald-50/30 to-white"
                            delay={1}
                        >
                            <div className='bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/40 shadow-[0_8px_32px_rgba(16,185,129,0.15)]'>
                                <div className='text-center mb-6'>
                                    <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3'>
                                        <Sparkles size={12} />
                                        Share Your Story
                                    </div>
                                    <h3 className='text-xl font-bold text-zinc-900'>We'd love your feedback</h3>
                                </div>

                                <div className='space-y-3'>
                                    <div className='h-10 bg-white/80 backdrop-blur-sm border border-primary/20 rounded-xl flex items-center px-3 gap-2'>
                                        <User size={14} className="text-primary" />
                                        <span className='text-xs text-zinc-400'>Full name</span>
                                    </div>

                                    <div className='h-10 bg-white/80 backdrop-blur-sm border border-primary/20 rounded-xl flex items-center px-3 gap-2'>
                                        <Mail size={14} className="text-primary" />
                                        <span className='text-xs text-zinc-400'>Email address</span>
                                    </div>

                                    <div className='h-16 bg-white/80 backdrop-blur-sm border border-primary/20 rounded-xl p-3'>
                                        <span className='text-xs text-zinc-400'>Your testimonial...</span>
                                    </div>

                                    <button className='w-full py-2.5 bg-primary text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2'>
                                        <Send size={14} />
                                        Send Feedback
                                    </button>
                                </div>
                            </div>
                        </FormPreviewContainer>
                    )}

                    {/* Design 3: Rating First */}
                    {visibleDesigns > 2 && (
                        <FormPreviewContainer
                            title="Rating First"
                            description="Lead with star rating to capture attention. Great for product reviews and testimonials."
                            colorClass="from-amber-50/40 to-white"
                            delay={2}
                        >
                            <div className='bg-white p-8 rounded-2xl border border-amber-100 shadow-md'>
                                <div className='text-center mb-6'>
                                    <h3 className='text-xl font-bold text-zinc-900 mb-4'>Rate your experience</h3>
                                    <StarRating color="#f59e0b" />
                                    <p className='text-xs text-zinc-500 mt-3'>Tap to rate</p>
                                </div>

                                <div className='space-y-3'>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <div className='h-9 bg-amber-50 border border-amber-200 rounded-lg flex items-center px-2.5'>
                                            <span className='text-xs text-zinc-400'>Name</span>
                                        </div>
                                        <div className='h-9 bg-amber-50 border border-amber-200 rounded-lg flex items-center px-2.5'>
                                            <span className='text-xs text-zinc-400'>Title</span>
                                        </div>
                                    </div>

                                    <div className='h-14 bg-amber-50 border border-amber-200 rounded-lg p-2.5'>
                                        <span className='text-xs text-zinc-400'>Tell us more...</span>
                                    </div>

                                    <button className='w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all'>
                                        Submit Rating
                                    </button>
                                </div>
                            </div>
                        </FormPreviewContainer>
                    )}

                    {/* Design 4: Dark Premium */}
                    {visibleDesigns > 3 && (
                        <FormPreviewContainer
                            title="Dark Premium"
                            description="High-contrast dark theme that commands attention. Perfect for luxury brands."
                            colorClass="from-zinc-900 to-zinc-800"
                            delay={3}
                        >
                            <div className='bg-zinc-950 p-8 rounded-3xl border border-zinc-800 shadow-2xl relative overflow-hidden'>
                                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/20 blur-[100px] rounded-full" />

                                <div className='relative z-10 text-center mb-6'>
                                    <h3 className='text-xl font-bold text-white mb-2'>Share Your Success</h3>
                                    <p className='text-sm text-zinc-400'>Join our community of satisfied clients</p>
                                </div>

                                <div className='relative z-10 space-y-3'>
                                    <div className='h-10 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center px-3'>
                                        <span className='text-xs text-zinc-500'>Your name</span>
                                    </div>

                                    <div className='h-10 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center px-3'>
                                        <span className='text-xs text-zinc-500'>Email address</span>
                                    </div>

                                    <div className='h-16 bg-zinc-900 border border-zinc-700 rounded-xl p-3'>
                                        <span className='text-xs text-zinc-500'>Your testimonial...</span>
                                    </div>

                                    <button className='w-full py-2.5 bg-primary text-zinc-900 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all'>
                                        Submit Testimonial
                                    </button>
                                </div>
                            </div>
                        </FormPreviewContainer>
                    )}

                    {/* Design 5: Card Stack */}
                    {visibleDesigns > 4 && (
                        <FormPreviewContainer
                            title="Card Stack"
                            description="Playful stacked card design that adds depth and personality to your form."
                            colorClass="from-blue-50/40 to-white"
                            delay={4}
                        >
                            <div className="relative pl-2 pb-2">
                                {/* Stacked layers */}
                                <div className="absolute inset-0 bg-white border border-blue-200 rounded-2xl rotate-2 opacity-50 scale-[0.97]" />
                                <div className="absolute inset-0 bg-white border border-blue-200 rounded-2xl rotate-[4deg] opacity-25 scale-[0.94]" />

                                {/* Main Card */}
                                <div className="relative bg-white p-6 rounded-2xl border border-blue-200 shadow-lg">
                                    <div className='mb-5'>
                                        <h3 className='text-lg font-bold text-zinc-900 mb-1'>Quick Feedback</h3>
                                        <p className='text-xs text-zinc-500'>Takes less than 2 minutes</p>
                                    </div>

                                    <div className='space-y-3'>
                                        <div className='h-9 bg-blue-50 border border-blue-200 rounded-lg flex items-center px-3'>
                                            <span className='text-xs text-zinc-400'>Name</span>
                                        </div>

                                        <div className='h-14 bg-blue-50 border border-blue-200 rounded-lg p-2.5'>
                                            <span className='text-xs text-zinc-400'>Your feedback...</span>
                                        </div>

                                        <div className='flex items-center justify-between'>
                                            <span className='text-xs text-zinc-500'>Rate us:</span>
                                            <div className='flex gap-1'>
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <Star key={i} size={14} className="fill-blue-500 text-blue-500" />
                                                ))}
                                            </div>
                                        </div>

                                        <button className='w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors'>
                                            Send Feedback
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </FormPreviewContainer>
                    )}

                    {/* Design 6: Gradient Border */}
                    {visibleDesigns > 5 && (
                        <FormPreviewContainer
                            title="Gradient Border"
                            description="Eye-catching gradient border that draws attention while maintaining elegance."
                            colorClass="from-purple-50/30 to-white"
                            delay={5}
                        >
                            <div className='relative p-[2px] rounded-2xl bg-gradient-to-br from-primary via-emerald-400 to-primary shadow-lg'>
                                <div className='bg-white p-7 rounded-2xl'>
                                    <div className='mb-5'>
                                        <h3 className='text-lg font-bold text-zinc-900 mb-1'>Tell Us More</h3>
                                        <p className='text-xs text-zinc-500'>We value your opinion</p>
                                    </div>

                                    <div className='space-y-3'>
                                        <div className='grid grid-cols-2 gap-2'>
                                            <div className='h-9 bg-gray-50 border border-gray-200 rounded-lg flex items-center px-2.5 gap-1.5'>
                                                <User size={12} className="text-primary" />
                                                <span className='text-xs text-zinc-400'>Name</span>
                                            </div>
                                            <div className='h-9 bg-gray-50 border border-gray-200 rounded-lg flex items-center px-2.5 gap-1.5'>
                                                <Briefcase size={12} className="text-primary" />
                                                <span className='text-xs text-zinc-400'>Role</span>
                                            </div>
                                        </div>

                                        <div className='h-9 bg-gray-50 border border-gray-200 rounded-lg flex items-center px-2.5 gap-1.5'>
                                            <Building2 size={12} className="text-primary" />
                                            <span className='text-xs text-zinc-400'>Company</span>
                                        </div>

                                        <div className='h-14 bg-gray-50 border border-gray-200 rounded-lg p-2.5'>
                                            <span className='text-xs text-zinc-400'>Your review...</span>
                                        </div>

                                        <button className='w-full py-2.5 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all'>
                                            Submit Review
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </FormPreviewContainer>
                    )}

                    {/* Design 7: Compact Inline */}
                    {visibleDesigns > 6 && (
                        <FormPreviewContainer
                            title="Compact Inline"
                            description="Space-efficient design perfect for sidebars and tight spaces."
                            colorClass="from-rose-50/40 to-white"
                            delay={6}
                        >
                            <div className='bg-white p-6 rounded-2xl border border-rose-100 shadow-md'>
                                <div className='flex items-center gap-2 mb-4'>
                                    <div className='w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center'>
                                        <Heart size={18} className="text-rose-500 fill-current" />
                                    </div>
                                    <div>
                                        <h3 className='text-sm font-bold text-zinc-900'>Love our product?</h3>
                                        <p className='text-xs text-zinc-500'>Share your story</p>
                                    </div>
                                </div>

                                <div className='space-y-2.5'>
                                    <div className='h-8 bg-rose-50 border border-rose-200 rounded-lg flex items-center px-2.5'>
                                        <span className='text-xs text-zinc-400'>Name</span>
                                    </div>

                                    <div className='h-12 bg-rose-50 border border-rose-200 rounded-lg p-2'>
                                        <span className='text-xs text-zinc-400'>Quick review...</span>
                                    </div>

                                    <div className='flex gap-1 justify-center py-1'>
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star key={i} size={16} className="fill-rose-500 text-rose-500" />
                                        ))}
                                    </div>

                                    <button className='w-full py-2 bg-rose-500 text-white rounded-lg text-xs font-semibold hover:bg-rose-600 transition-colors flex items-center justify-center gap-1.5'>
                                        <CheckCircle2 size={14} />
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </FormPreviewContainer>
                    )}

                    {/* Design 8: Photo Upload Focus */}
                    {visibleDesigns > 7 && (
                        <FormPreviewContainer
                            title="Photo Upload"
                            description="Emphasizes photo upload for authentic, personal testimonials with faces."
                            colorClass="from-cyan-50/30 to-white"
                            delay={7}
                        >
                            <div className='bg-white p-7 rounded-2xl border border-cyan-100 shadow-md'>
                                <div className='text-center mb-5'>
                                    <h3 className='text-lg font-bold text-zinc-900 mb-1'>Share Your Story</h3>
                                    <p className='text-xs text-zinc-500'>Add a photo for authenticity</p>
                                </div>

                                <div className='space-y-3'>
                                    <div className='h-24 border-2 border-dashed border-cyan-300 rounded-xl bg-cyan-50/50 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-cyan-50 transition-colors'>
                                        <Upload size={20} className="text-cyan-500" />
                                        <span className='text-xs font-medium text-cyan-600'>Upload Photo</span>
                                        <span className='text-[10px] text-zinc-400'>Optional</span>
                                    </div>

                                    <div className='h-9 bg-gray-50 border border-gray-200 rounded-lg flex items-center px-3'>
                                        <span className='text-xs text-zinc-400'>Your name</span>
                                    </div>

                                    <div className='h-14 bg-gray-50 border border-gray-200 rounded-lg p-2.5'>
                                        <span className='text-xs text-zinc-400'>Your testimonial...</span>
                                    </div>

                                    <button className='w-full py-2.5 bg-cyan-600 text-white rounded-lg text-sm font-semibold hover:bg-cyan-700 transition-colors shadow-md'>
                                        Submit Testimonial
                                    </button>
                                </div>
                            </div>
                        </FormPreviewContainer>
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

export default memo(FormCustomizationShowcase);
