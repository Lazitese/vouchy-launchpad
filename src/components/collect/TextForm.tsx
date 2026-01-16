import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, Camera, Send, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { TextMagic } from "@/components/features/TextMagic";
import { useToast } from "@/hooks/use-toast";

interface TextFormProps {
    canUseAI: boolean;
    onSubmit: (formData: {
        name: string;
        email: string;
        company: string;
        title: string;
        testimonial: string;
        rating: number;
    }, avatarFile: File | null) => void;
    onBack: () => void;
    submitting: boolean;
    spaceId?: string;
}

export const TextForm = ({ canUseAI, onSubmit, onBack, submitting, spaceId }: TextFormProps) => {
    const { toast } = useToast();
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const [textForm, setTextForm] = useState({
        name: "",
        email: "",
        company: "",
        title: "",
        testimonial: "",
        rating: 5,
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        const newErrors: Record<string, string> = {};
        if (!textForm.name.trim() || textForm.name.length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }
        if (!textForm.email.trim() || !textForm.email.includes("@")) {
            newErrors.email = "Invalid email address";
        }
        if (!textForm.testimonial.trim() || textForm.testimonial.length < 10) {
            newErrors.testimonial = "Please write at least 10 characters";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        onSubmit(textForm, avatarFile);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    variant: "destructive",
                    title: "File too large",
                    description: "Please upload an image under 5MB.",
                });
                return;
            }
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <motion.div
            className="w-full max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className="text-2xl font-black text-zinc-900 mb-2 text-center">
                Write your review
            </h2>
            <p className="text-zinc-500 mb-8 text-center">
                Share what you loved about your experience
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Star Rating */}
                <div className="flex flex-col items-center gap-3 mb-2">
                    <p className="text-sm text-zinc-500">How would you rate your experience?</p>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <motion.button
                                key={rating}
                                type="button"
                                onClick={() => setTextForm({ ...textForm, rating })}
                                whileHover={{ scale: 1.15, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-1"
                            >
                                <Star
                                    className={`w-9 h-9 transition-all duration-200 ${rating <= textForm.rating
                                        ? "text-amber-400 fill-amber-400 drop-shadow-sm"
                                        : "text-zinc-200 hover:text-amber-300"
                                        }`}
                                />
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Photo Upload */}
                <div className="flex flex-col items-center gap-3 organic-card p-6 border-dashed border-2 hover:border-primary/50 transition-colors group/upload">
                    <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                    />

                    <div className="flex items-center gap-4">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => avatarInputRef.current?.click()}
                            className="relative w-16 h-16 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center cursor-pointer overflow-hidden group-hover/upload:border-primary/50 transition-colors"
                        >
                            {avatarPreview ? (
                                <>
                                    <img
                                        src={avatarPreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-5 h-5 text-white" />
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Camera className="w-6 h-6 text-zinc-400 group-hover/upload:text-primary transition-colors" />
                                </div>
                            )}
                        </motion.div>

                        <div className="text-left cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                            <p className="text-sm font-bold text-zinc-900 group-hover/upload:text-primary transition-colors">Add your photo</p>
                            <p className="text-xs text-zinc-400">Optional • JPG, PNG up to 5MB</p>
                            {avatarPreview && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setAvatarFile(null);
                                        setAvatarPreview(null);
                                    }}
                                    className="text-xs text-red-500 hover:text-red-600 mt-1 font-medium"
                                >
                                    Remove photo
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Input
                            placeholder="Your name *"
                            value={textForm.name}
                            onChange={(e) => setTextForm({ ...textForm, name: e.target.value })}
                            className={`bg-white border-zinc-200 focus:border-primary focus:ring-primary/20 ${errors.name ? "border-red-500" : ""}`}
                            maxLength={100}
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <Input
                        placeholder="Job title (optional)"
                        value={textForm.title}
                        onChange={(e) => setTextForm({ ...textForm, title: e.target.value })}
                        className="bg-white border-zinc-200 focus:border-primary focus:ring-primary/20"
                        maxLength={100}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Input
                            type="email"
                            placeholder="Email address *"
                            value={textForm.email}
                            onChange={(e) => setTextForm({ ...textForm, email: e.target.value })}
                            className={`bg-white border-zinc-200 focus:border-primary focus:ring-primary/20 ${errors.email ? "border-red-500" : ""}`}
                            maxLength={255}
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <Input
                        placeholder="Company (optional)"
                        value={textForm.company}
                        onChange={(e) => setTextForm({ ...textForm, company: e.target.value })}
                        className="bg-white border-zinc-200 focus:border-primary focus:ring-primary/20"
                        maxLength={100}
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm text-zinc-500">Your testimonial</label>
                        <TextMagic
                            text={textForm.testimonial}
                            onTextUpdated={(newText) => setTextForm({ ...textForm, testimonial: newText })}
                            isLocked={!canUseAI}
                            spaceId={spaceId}
                        />
                    </div>
                    <Textarea
                        placeholder="Share your experience..."
                        className={`min-h-[120px] resize-none bg-white border-zinc-200 focus:border-primary focus:ring-primary/20 ${errors.testimonial ? "border-red-500" : ""}`}
                        value={textForm.testimonial}
                        onChange={(e) => setTextForm({ ...textForm, testimonial: e.target.value })}
                        maxLength={2000}
                    />
                    {errors.testimonial && (
                        <p className="text-xs text-red-500 mt-1">{errors.testimonial}</p>
                    )}
                </div>

                <Button
                    variant="default"
                    className="w-full gap-2 py-6 text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                    type="submit"
                    disabled={submitting}
                >
                    {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            Submit Review
                        </>
                    )}
                </Button>
            </form>

            <button
                onClick={onBack}
                className="block mx-auto mt-6 text-sm text-zinc-400 hover:text-primary transition-colors"
            >
                ← Back to options
            </button>
        </motion.div>
    );
};
