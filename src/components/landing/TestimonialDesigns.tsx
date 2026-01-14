import { motion } from 'framer-motion';
import { Quote, Star, Play, ArrowRight, Heart } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from 'react';

// Mock data
const demoTestimonial = {
  id: '1',
  content: "Vouchy transformed our user feedback loop. It's incredibly intuitive, and our conversion rate jumped by 24% in the first week.",
  author_name: 'Sarah Chen',
  author_title: 'Product Director',
  author_company: 'TechFlow',
  author_avatar_url: 'https://i.pravatar.cc/150?u=sarah_chen_vouchy',
  rating: 5
};

const CardPreviewContainer = ({ children, title, description, colorClass, delay }: { children: React.ReactNode, title: string, description: string, colorClass: string, delay: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      className='group flex flex-col h-full'
    >
      <div className={`relative flex-1 rounded-[32px] overflow-hidden bg-gradient-to-br ${colorClass} p-8 md:p-12 flex items-center justify-center min-h-[320px] shadow-sm border border-black/5 transition-all duration-500 hover:shadow-xl`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Floating Effect Wrapper */}
        <div className="relative z-10 w-full max-w-sm transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.02]">
          {children}
        </div>

        {/* Action Pill (Hidden by default, shows on hover) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <span className="bg-white/90 backdrop-blur-md text-zinc-900 border border-zinc-200 px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
            Preview Template <ArrowRight size={12} />
          </span>
        </div>
      </div>

      <div className='mt-6 px-2'>
        <h3 className='text-xl font-bold text-zinc-900 mb-2 tracking-tight'>{title}</h3>
        <p className='text-zinc-500 text-sm leading-relaxed'>{description}</p>
      </div>
    </motion.div>
  )
}

const TestimonialDesigns = () => {
  return (
    <section className='py-32 bg-zinc-50/50 relative overflow-hidden'>
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

      <div className='container mx-auto px-6 relative z-10'>

        {/* Header */}
        <div className='text-center mb-20 max-w-2xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 shadow-sm mb-8'
          >
            <span className='flex h-2 w-2 rounded-full bg-primary animate-pulse'></span>
            <span className='text-xs font-bold text-zinc-600 uppercase tracking-wider'>Design Library</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className='text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 mb-6 leading-[1.1]'
          >
            Showcase your love, <br />
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500'>beautifully.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className='text-lg text-zinc-500 md:px-8'
          >
            Select from our curation of premium, conversion-optimized testimonial cards.
            Customizable to match your brand's unique aesthetic perfectly.
          </motion.p>
        </div>

        {/* Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 max-w-[1240px] mx-auto'>

          {/* Design 1: Minimal */}
          <CardPreviewContainer
            title="Minimalist"
            description="A clean, distraction-free design that lets the content speak for itself. Perfect for modern SaaS."
            colorClass="from-zinc-100 to-white"
            delay={0}
          >
            {/* Minimal Card Component */}
            <div className='bg-white p-6 rounded-2xl border border-zinc-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow duration-300'>
              <div className='flex justify-between items-start mb-4'>
                <div className='flex items-center gap-3'>
                  <Avatar className="h-10 w-10 ring-2 ring-zinc-50">
                    <AvatarImage src={demoTestimonial.author_avatar_url} />
                    <AvatarFallback className="bg-zinc-100 text-zinc-500">SC</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className='font-bold text-sm text-zinc-900'>{demoTestimonial.author_name}</div>
                    <div className='text-xs text-zinc-500'>{demoTestimonial.author_company}</div>
                  </div>
                </div>
                <div className='flex gap-0.5'>
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-zinc-900 text-zinc-900" />)}
                </div>
              </div>
              <p className='text-sm text-zinc-600 leading-relaxed font-medium'>
                "{demoTestimonial.content}"
              </p>
            </div>
          </CardPreviewContainer>

          {/* Design 2: Classic Quote */}
          <CardPreviewContainer
            title="Classic Quote"
            description="Traditional and trustworthy. Features a prominent quote mark to draw attention to the feedback."
            colorClass="from-blue-50/50 to-white"
            delay={1}
          >
            {/* Classic Card Component */}
            <div className='bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-blue-50 relative'>
              <Quote className='absolute text-blue-100 fill-current top-6 right-6 scale-125' size={48} />
              <div className='relative z-10'>
                <div className='flex text-blue-500 gap-1 mb-4'>
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className='text-lg font-medium text-zinc-800 mb-6 leading-relaxed'>
                  "{demoTestimonial.content}"
                </p>
                <div className='flex items-center gap-3 border-t border-zinc-50 pt-4'>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={demoTestimonial.author_avatar_url} />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    <span className='text-sm font-bold text-zinc-900'>{demoTestimonial.author_name}</span>
                    <span className='text-xs text-blue-600 font-medium'>{demoTestimonial.author_title}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardPreviewContainer>

          {/* Design 3: Dark Mode / Spotlight */}
          <CardPreviewContainer
            title="Midnight Spotlight"
            description="High-contrast dark mode card designed to stand out on any background. Ideal for feature sections."
            colorClass="from-zinc-800 to-zinc-900"
            delay={2}
          >
            {/* Spotlight Card Component */}
            <div className='bg-zinc-950 p-8 rounded-3xl border border-zinc-800 shadow-2xl relative overflow-hidden group/card'>
              {/* Glow effect */}
              <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-purple-500/20 blur-[80px] rounded-full pointer-events-none" />

              <div className='relative z-10 flex flex-col items-center text-center'>
                <Avatar className="h-14 w-14 ring-4 ring-zinc-900 mb-4 shadow-xl">
                  <AvatarImage src={demoTestimonial.author_avatar_url} />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <div className='flex gap-1 text-purple-400 mb-4'>
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className='text-zinc-200 text-base leading-relaxed mb-4'>
                  "{demoTestimonial.content}"
                </p>
                <div>
                  <div className='text-white font-bold text-sm'>{demoTestimonial.author_name}</div>
                  <div className='text-zinc-500 text-xs mt-0.5'>{demoTestimonial.author_company}</div>
                </div>
              </div>
            </div>
          </CardPreviewContainer>

          {/* Design 4: Bento Grid */}
          <CardPreviewContainer
            title="Bento Style"
            description="Compact and structural. Fits perfectly into grid layouts and information-dense dashboards."
            colorClass="from-emerald-50/50 to-white"
            delay={3}
          >
            {/* Bento Card Component */}
            <div className='bg-white p-5 rounded-[24px] border border-zinc-200/60 shadow-sm relative overflow-hidden'>
              <div className="flex justify-between items-start mb-3">
                <div className="bg-emerald-100/50 text-emerald-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider">
                  Verified User
                </div>
                <Quote size={16} className="text-emerald-200 fill-current" />
              </div>

              <h4 className="font-bold text-lg text-zinc-900 mb-1 leading-tight">"Incredible results."</h4>
              <p className="text-zinc-500 text-xs mb-4 line-clamp-2">
                {demoTestimonial.content}
              </p>

              <div className="flex items-center gap-3 pt-3 border-t border-dashed border-zinc-100">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={demoTestimonial.author_avatar_url} />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-xs font-bold text-zinc-900">{demoTestimonial.author_name}</div>
                  <div className="flex text-emerald-500 gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={8} fill="currentColor" />)}
                  </div>
                </div>
              </div>
            </div>
          </CardPreviewContainer>

          {/* Design 5: Video Stack */}
          <CardPreviewContainer
            title="Video Stack"
            description="Engaging video format with a playful stacked paper effect to encourage interaction."
            colorClass="from-orange-50/50 to-white"
            delay={4}
          >
            {/* Stack Card Component */}
            <div className="relative pl-2 pb-2">
              {/* Back layers */}
              <div className="absolute inset-0 bg-white border border-zinc-200 rounded-2xl rotate-3 opacity-60 scale-95 origin-bottom-right" />
              <div className="absolute inset-0 bg-white border border-zinc-200 rounded-2xl rotate-6 opacity-30 scale-90 origin-bottom-right" />

              {/* Main Card */}
              <div className="relative bg-white p-2 rounded-2xl border border-zinc-200 shadow-md">
                <div className="aspect-video bg-zinc-900 rounded-xl relative overflow-hidden group/video cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Video thumbnail"
                    className="w-full h-full object-cover opacity-60 group-hover/video:opacity-40 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-transform duration-300 group-hover/video:scale-110">
                      <Play size={20} className="text-white fill-current translate-x-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5 border border-white/20">
                        <AvatarImage src={demoTestimonial.author_avatar_url} />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      <span className="text-[10px] text-white font-medium">{demoTestimonial.author_name}</span>
                    </div>
                  </div>
                </div>
                <div className="px-1 pt-2 pb-1 flex justify-between items-center">
                  <div className="flex text-orange-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                  </div>
                  <span className="text-[10px] text-zinc-400">0:45s</span>
                </div>
              </div>
            </div>
          </CardPreviewContainer>

          {/* Design 6: Trust Badge / Avatar Top */}
          <CardPreviewContainer
            title="Trust Badge"
            description="Centers the human element. Excellent for building trust on pricing or checkout pages."
            colorClass="from-rose-50/50 to-white"
            delay={5}
          >
            {/* Avatar Top Card Component */}
            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-rose-100 p-6 pt-0 text-center relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <Avatar className="h-14 w-14 ring-4 ring-white shadow-md">
                  <AvatarImage src={demoTestimonial.author_avatar_url} />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-rose-500 rounded-full p-1 border-2 border-white">
                  <Heart size={8} className="text-white fill-current" />
                </div>
              </div>

              <div className="mt-10 mb-3">
                <div className="font-bold text-zinc-900">{demoTestimonial.author_name}</div>
                <div className="text-xs text-rose-500 font-semibold">{demoTestimonial.author_company}</div>
              </div>

              <p className="text-sm text-zinc-600 italic leading-relaxed mb-4">
                "{demoTestimonial.content}"
              </p>

              <div className="inline-flex gap-1 bg-rose-50 px-2 py-1 rounded-full">
                {[...Array(5)].map((_, i) => <Star key={i} size={10} className="fill-rose-500 text-rose-500" />)}
              </div>
            </div>
          </CardPreviewContainer>

        </div>

      </div>
    </section>
  );
};

export default TestimonialDesigns;
