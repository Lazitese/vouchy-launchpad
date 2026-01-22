import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, Camera, Send, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { TextMagic } from "@/components/features/TextMagic";
import { useToast } from "@/hooks/use-toast";
import { FormSettings, mergeFormSettings } from "@/types/formSettings";

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
    formSettings?: FormSettings | null;
}

export const TextForm = ({ canUseAI, onSubmit, onBack, submitting, spaceId, formSettings: providedSettings }: TextFormProps) => {
    const { toast } = useToast();
    const avatarInputRef = useRef<HTMLInputElement>(null);

    // Merge provided settings with defaults
    const formSettings = mergeFormSettings(providedSettings);
    const { fields, theme, messages } = formSettings;

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

        // Dynamic validation based on form settings
        const newErrors: Record<string, string> = {};

        if (fields.name.enabled && fields.name.required) {
            if (!textForm.name.trim() || textForm.name.length < 2) {
                newErrors.name = "Name must be at least 2 characters";
            }
        }

        if (fields.email.enabled && fields.email.required) {
            if (!textForm.email.trim() || !textForm.email.includes("@")) {
                newErrors.email = "Invalid email address";
            }
        }

        if (fields.testimonial.enabled && fields.testimonial.required) {
            const minLength = fields.testimonial.minLength || 10;
            if (!textForm.testimonial.trim() || textForm.testimonial.length < minLength) {
                newErrors.testimonial = `Please write at least ${minLength} characters`;
            }
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

    // Determine card style classes
    const getCardStyle = () => {
        switch (theme.cardStyle) {
            case 'glassmorphism':
                return 'bg-white/70 backdrop-blur-xl border border-white/20 shadow-2xl';
            case 'minimal':
                return 'bg-white border border-gray-100 shadow-sm';
            default: // modern
                return 'bg-white border border-gray-200 shadow-lg';
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
            <div
                className={`p-8 rounded-2xl ${getCardStyle()}`}
                style={{ backgroundColor: theme.backgroundColor }}
            >
                <h2
                    className="text-2xl font-black mb-2 text-center"
                    style={{ color: theme.accentColor }}
                >
                    {messages.title}
                </h2>
                <p className="text-zinc-500 mb-8 text-center">
                    {messages.subtitle}
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Star Rating */}
                    {fields.rating.enabled && (
                        <div className="flex flex-col items-center gap-3 mb-2">
                            <p className="text-sm text-zinc-500">{fields.rating.label}</p>
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
                                                    ? "fill-amber-400 drop-shadow-sm"
                                                    : "text-zinc-200 hover:text-amber-300"
                                                }`}
                                            style={{
                                                color: rating <= textForm.rating ? '#fbbf24' : undefined
                                            }}
                                        />
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Photo Upload */}
                    {fields.avatar.enabled && (
                        <div className="flex flex-col items-center gap-3 p-6 border-dashed border-2 rounded-xl hover:border-opacity-50 transition-colors group/upload"
                            style={{ borderColor: `${theme.accentColor}40` }}
                        >
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
                                    className="relative w-16 h-16 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center cursor-pointer overflow-hidden group-hover/upload:border-opacity-50 transition-colors"
                                    style={{ borderColor: `${theme.accentColor}40` }}
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
                                            <Camera
                                                className="w-6 h-6 text-zinc-400 group-hover/upload:transition-colors"
                                                style={{ color: theme.accentColor }}
                                            />
                                        </div>
                                    )}
                                </motion.div>

                                <div className="text-left cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                                    <p
                                        className="text-sm font-bold group-hover/upload:transition-colors"
                                        style={{ color: theme.accentColor }}
                                    >
                                        {fields.avatar.label}
                                    </p>
                                    <p className="text-xs text-zinc-400">{fields.avatar.helpText || "Optional • JPG, PNG up to 5MB"}</p>
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
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        {fields.name.enabled && (
                            <div>
                                <Input
                                    placeholder={`${fields.name.placeholder || fields.name.label}${fields.name.required ? ' *' : ''}`}
                                    value={textForm.name}
                                    onChange={(e) => setTextForm({ ...textForm, name: e.target.value })}
                                    className={`bg-white border-zinc-200 focus:ring-opacity-20 ${errors.name ? "border-red-500" : ""}`}
                                    style={{
                                        borderColor: errors.name ? undefined : `${theme.accentColor}20`,
                                        '--tw-ring-color': `${theme.accentColor}33`
                                    } as any}
                                    maxLength={100}
                                />
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                            </div>
                        )}
                        {fields.title.enabled && (
                            <Input
                                placeholder={`${fields.title.placeholder || fields.title.label}${fields.title.required ? ' *' : ''}`}
                                value={textForm.title}
                                onChange={(e) => setTextForm({ ...textForm, title: e.target.value })}
                                className="bg-white border-zinc-200"
                                style={{ borderColor: `${theme.accentColor}20` }}
                                maxLength={100}
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {fields.email.enabled && (
                            <div>
                                <Input
                                    type="email"
                                    placeholder={`${fields.email.placeholder || fields.email.label}${fields.email.required ? ' *' : ''}`}
                                    value={textForm.email}
                                    onChange={(e) => setTextForm({ ...textForm, email: e.target.value })}
                                    className={`bg-white border-zinc-200 ${errors.email ? "border-red-500" : ""}`}
                                    style={{ borderColor: errors.email ? undefined : `${theme.accentColor}20` }}
                                    maxLength={255}
                                />
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                            </div>
                        )}
                        {fields.company.enabled && (
                            <Input
                                placeholder={`${fields.company.placeholder || fields.company.label}${fields.company.required ? ' *' : ''}`}
                                value={textForm.company}
                                onChange={(e) => setTextForm({ ...textForm, company: e.target.value })}
                                className="bg-white border-zinc-200"
                                style={{ borderColor: `${theme.accentColor}20` }}
                                maxLength={100}
                            />
                        )}
                    </div>

                    {fields.testimonial.enabled && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm text-zinc-500">{fields.testimonial.label}</label>
                                <TextMagic
                                    text={textForm.testimonial}
                                    onTextUpdated={(newText) => setTextForm({ ...textForm, testimonial: newText })}
                                    isLocked={!canUseAI}
                                    spaceId={spaceId}
                                />
                            </div>
                            <Textarea
                                placeholder={fields.testimonial.placeholder || "Share your experience..."}
                                className={`min-h-[120px] resize-none bg-white border-zinc-200 ${errors.testimonial ? "border-red-500" : ""}`}
                                style={{ borderColor: errors.testimonial ? undefined : `${theme.accentColor}20` }}
                                value={textForm.testimonial}
                                onChange={(e) => setTextForm({ ...textForm, testimonial: e.target.value })}
                                maxLength={fields.testimonial.maxLength || 2000}
                            />
                            {errors.testimonial && (
                                <p className="text-xs text-red-500 mt-1">{errors.testimonial}</p>
                            )}
                        </div>
                    )}

                    <Button
                        variant="default"
                        className="w-full gap-2 py-6 text-base font-semibold text-white shadow-lg"
                        style={{
                            backgroundColor: theme.accentColor,
                            boxShadow: `0 10px 25px -5px ${theme.accentColor}33`
                        }}
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                {messages.submitButton}
                            </>
                        )}
                    </Button>
                </form>
            </div>

            <button
                onClick={onBack}
                className="block mx-auto mt-6 text-sm text-zinc-400 hover:text-primary transition-colors"
            >
                ← Back to options
            </button>
        </motion.div>
    );
};
