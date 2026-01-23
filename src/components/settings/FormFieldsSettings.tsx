import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FormSettings, FormFieldConfig, defaultFormSettings } from "@/types/formSettings";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Save, Eye, Settings2, Palette, MessageSquare, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface FormFieldsSettingsProps {
    formSettings: FormSettings;
    onSave: (settings: FormSettings) => void;
    loading?: boolean;
}

export const FormFieldsSettings = ({ formSettings, onSave, loading }: FormFieldsSettingsProps) => {
    const [settings, setSettings] = useState<FormSettings>(formSettings || defaultFormSettings);
    const [showPreview, setShowPreview] = useState(false);

    const updateFieldConfig = (fieldName: keyof FormSettings['fields'], updates: Partial<FormFieldConfig>) => {
        setSettings({
            ...settings,
            fields: {
                ...settings.fields,
                [fieldName]: {
                    ...settings.fields[fieldName],
                    ...updates,
                },
            },
        });
    };

    const updateTheme = (updates: Partial<FormSettings['theme']>) => {
        setSettings({
            ...settings,
            theme: {
                ...settings.theme,
                ...updates,
            },
        });
    };

    const updateMessages = (updates: Partial<FormSettings['messages']>) => {
        setSettings({
            ...settings,
            messages: {
                ...settings.messages,
                ...updates,
            },
        });
    };

    const fieldLabels: Record<keyof FormSettings['fields'], string> = {
        name: "Name Field",
        email: "Email Field",
        title: "Job Title Field",
        company: "Company Field",
        rating: "Rating Field",
        avatar: "Photo Upload",
        testimonial: "Testimonial Field",
    };

    return (
        <div className="organic-card p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Settings2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-black">Form Customization</h2>
                        <p className="text-sm text-gray-500 hidden md:block">Configure fields, validation, and appearance</p>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button
                        variant="outline"
                        onClick={() => setShowPreview(!showPreview)}
                        className="rounded-full"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        {showPreview ? "Hide" : "Show"} Preview
                    </Button>
                    <Button
                        onClick={() => onSave(settings)}
                        disabled={loading}
                        className="bg-black text-white hover:bg-gray-800 rounded-full px-6"
                    >
                        {loading ? (
                            <Save className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        Save Changes
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="fields" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 h-auto">
                    {/* Mobile: Stack tabs vertically, Desktop: 3 columns */}
                    <TabsTrigger value="fields" className="flex items-center justify-center py-3">
                        <Settings2 className="w-4 h-4 mr-1 md:mr-2" />
                        <span className="text-xs md:text-sm">Fields</span>
                    </TabsTrigger>
                    <TabsTrigger value="theme" className="flex items-center justify-center py-3">
                        <Palette className="w-4 h-4 mr-1 md:mr-2" />
                        <span className="text-xs md:text-sm">Theme</span>
                    </TabsTrigger>
                    <TabsTrigger value="messages" className="flex items-center justify-center py-3">
                        <MessageSquare className="w-4 h-4 mr-1 md:mr-2" />
                        <span className="text-xs md:text-sm">Messages</span>
                    </TabsTrigger>
                </TabsList>

                {/* Fields Configuration */}
                <TabsContent value="fields" className="space-y-6">
                    {Object.entries(settings.fields).map(([fieldName, config]) => (
                        <motion.div
                            key={fieldName}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 bg-gray-50 rounded-xl border border-gray-200"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-black text-sm md:text-base">
                                        {fieldLabels[fieldName as keyof FormSettings['fields']]}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={config.enabled}
                                            onCheckedChange={(enabled) =>
                                                updateFieldConfig(fieldName as keyof FormSettings['fields'], { enabled })
                                            }
                                        />
                                        <span className="text-xs md:text-sm text-gray-500">
                                            {config.enabled ? "Enabled" : "Disabled"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={config.required}
                                        onCheckedChange={(required) =>
                                            updateFieldConfig(fieldName as keyof FormSettings['fields'], { required })
                                        }
                                        disabled={!config.enabled}
                                    />
                                    <span className="text-xs md:text-sm text-gray-500">Required</span>
                                </div>
                            </div>

                            {config.enabled && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-gray-600">Label</Label>
                                        <Input
                                            value={config.label}
                                            onChange={(e) =>
                                                updateFieldConfig(fieldName as keyof FormSettings['fields'], {
                                                    label: e.target.value,
                                                })
                                            }
                                            className="bg-white"
                                            placeholder="Field label"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-gray-600">Placeholder</Label>
                                        <Input
                                            value={config.placeholder || ""}
                                            onChange={(e) =>
                                                updateFieldConfig(fieldName as keyof FormSettings['fields'], {
                                                    placeholder: e.target.value,
                                                })
                                            }
                                            className="bg-white"
                                            placeholder="Placeholder text"
                                        />
                                    </div>
                                    {fieldName === 'testimonial' && (
                                        <>
                                            <div className="space-y-2">
                                                <Label className="text-xs text-gray-600">Min Length</Label>
                                                <Input
                                                    type="number"
                                                    value={config.minLength || 0}
                                                    onChange={(e) =>
                                                        updateFieldConfig(fieldName as keyof FormSettings['fields'], {
                                                            minLength: parseInt(e.target.value) || 0,
                                                        })
                                                    }
                                                    className="bg-white"
                                                    min={0}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs text-gray-600">Max Length</Label>
                                                <Input
                                                    type="number"
                                                    value={config.maxLength || 2000}
                                                    onChange={(e) =>
                                                        updateFieldConfig(fieldName as keyof FormSettings['fields'], {
                                                            maxLength: parseInt(e.target.value) || 2000,
                                                        })
                                                    }
                                                    className="bg-white"
                                                    max={5000}
                                                />
                                            </div>
                                        </>
                                    )}
                                    {config.helpText !== undefined && (
                                        <div className="space-y-2 col-span-2">
                                            <Label className="text-xs text-gray-600">Help Text</Label>
                                            <Input
                                                value={config.helpText || ""}
                                                onChange={(e) =>
                                                    updateFieldConfig(fieldName as keyof FormSettings['fields'], {
                                                        helpText: e.target.value,
                                                    })
                                                }
                                                className="bg-white"
                                                placeholder="Additional help text"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </TabsContent>

                {/* Theme Configuration */}
                <TabsContent value="theme" className="space-y-6">
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                        <div className="space-y-2">
                            <Label>Accent Color</Label>
                            <div className="flex gap-3">
                                <Input
                                    type="color"
                                    value={settings.theme.accentColor}
                                    onChange={(e) => updateTheme({ accentColor: e.target.value })}
                                    className="w-20 h-12 cursor-pointer"
                                />
                                <Input
                                    value={settings.theme.accentColor}
                                    onChange={(e) => updateTheme({ accentColor: e.target.value })}
                                    className="bg-white flex-1"
                                    placeholder="#10b981"
                                />
                            </div>
                            <p className="text-xs text-gray-500">Primary color for buttons and highlights</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Background Color</Label>
                            <div className="flex gap-3">
                                <Input
                                    type="color"
                                    value={settings.theme.backgroundColor}
                                    onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                                    className="w-20 h-12 cursor-pointer"
                                />
                                <Input
                                    value={settings.theme.backgroundColor}
                                    onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                                    className="bg-white flex-1"
                                    placeholder="#ffffff"
                                />
                            </div>
                            <p className="text-xs text-gray-500">Form background color</p>
                        </div>
                    </div>
                </TabsContent>

                {/* Messages Configuration */}
                <TabsContent value="messages" className="space-y-6">
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                        <div className="space-y-2">
                            <Label>Form Title</Label>
                            <Input
                                value={settings.messages.title}
                                onChange={(e) => updateMessages({ title: e.target.value })}
                                className="bg-white"
                                placeholder="Share your experience"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Form Subtitle</Label>
                            <Textarea
                                value={settings.messages.subtitle}
                                onChange={(e) => updateMessages({ subtitle: e.target.value })}
                                className="bg-white resize-none"
                                rows={2}
                                placeholder="Help others by sharing your honest feedback"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Submit Button Text</Label>
                            <Input
                                value={settings.messages.submitButton}
                                onChange={(e) => updateMessages({ submitButton: e.target.value })}
                                className="bg-white"
                                placeholder="Submit Review"
                            />
                        </div>

                        <div className="border-t border-gray-300 pt-4 mt-4">
                            <h4 className="font-semibold mb-3">Success Message</h4>
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label>Success Title</Label>
                                    <Input
                                        value={settings.messages.successTitle}
                                        onChange={(e) => updateMessages({ successTitle: e.target.value })}
                                        className="bg-white"
                                        placeholder="Thank you!"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Success Message</Label>
                                    <Textarea
                                        value={settings.messages.successMessage}
                                        onChange={(e) => updateMessages({ successMessage: e.target.value })}
                                        className="bg-white resize-none"
                                        rows={3}
                                        placeholder="Your testimonial has been submitted successfully."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Preview Modal */}
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            Live Preview
                        </DialogTitle>
                    </DialogHeader>
                    <div
                        className="p-8 rounded-2xl shadow-lg mx-auto"
                        style={{
                            backgroundColor: settings.theme.backgroundColor,
                            border: `2px solid ${settings.theme.accentColor}20`
                        }}
                    >
                        <h2 className="text-2xl font-bold mb-2 text-center" style={{ color: settings.theme.accentColor }}>
                            {settings.messages.title}
                        </h2>
                        <p className="text-gray-600 mb-6 text-sm text-center">{settings.messages.subtitle}</p>

                        <div className="space-y-4">
                            {settings.fields.rating.enabled && (
                                <div className="text-center">
                                    <p className="text-sm text-gray-500 mb-2">{settings.fields.rating.label}</p>
                                    <div className="flex gap-1 justify-center">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className="w-8 h-8 rounded-full" style={{ backgroundColor: `${settings.theme.accentColor}20` }} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {settings.fields.name.enabled && (
                                    <div className="h-10 bg-gray-100 rounded-lg flex items-center px-3">
                                        <span className="text-xs text-gray-400">{settings.fields.name.placeholder || settings.fields.name.label}</span>
                                    </div>
                                )}
                                {settings.fields.title.enabled && (
                                    <div className="h-10 bg-gray-100 rounded-lg flex items-center px-3">
                                        <span className="text-xs text-gray-400">{settings.fields.title.placeholder || settings.fields.title.label}</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {settings.fields.email.enabled && (
                                    <div className="h-10 bg-gray-100 rounded-lg flex items-center px-3">
                                        <span className="text-xs text-gray-400">{settings.fields.email.placeholder || settings.fields.email.label}</span>
                                    </div>
                                )}
                                {settings.fields.company.enabled && (
                                    <div className="h-10 bg-gray-100 rounded-lg flex items-center px-3">
                                        <span className="text-xs text-gray-400">{settings.fields.company.placeholder || settings.fields.company.label}</span>
                                    </div>
                                )}
                            </div>

                            {settings.fields.testimonial.enabled && (
                                <div className="h-24 bg-gray-100 rounded-lg flex items-start p-3">
                                    <span className="text-xs text-gray-400">{settings.fields.testimonial.placeholder || settings.fields.testimonial.label}</span>
                                </div>
                            )}

                            <button
                                className="w-full py-3 rounded-lg font-semibold text-white transition-all"
                                style={{ backgroundColor: settings.theme.accentColor }}
                            >
                                {settings.messages.submitButton}
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
