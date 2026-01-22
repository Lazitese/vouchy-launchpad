// Form Field Configuration Types

export interface FormFieldConfig {
    enabled: boolean;
    required: boolean;
    label: string;
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
    helpText?: string;
}

export interface FormFieldsConfig {
    name: FormFieldConfig;
    email: FormFieldConfig;
    title: FormFieldConfig;
    company: FormFieldConfig;
    rating: FormFieldConfig;
    avatar: FormFieldConfig;
    testimonial: FormFieldConfig;
}

export interface FormThemeConfig {
    accentColor: string;
    backgroundColor: string;
    cardStyle: 'modern' | 'minimal' | 'glassmorphism';
}

export interface FormMessagesConfig {
    title: string;
    subtitle: string;
    submitButton: string;
    successTitle: string;
    successMessage: string;
}

export interface FormSettings {
    fields: FormFieldsConfig;
    theme: FormThemeConfig;
    messages: FormMessagesConfig;
}

// Default form settings
export const defaultFormSettings: FormSettings = {
    fields: {
        name: { enabled: true, required: true, label: "Your name", placeholder: "John Doe" },
        email: { enabled: true, required: true, label: "Email address", placeholder: "john@example.com" },
        title: { enabled: true, required: false, label: "Job title", placeholder: "Product Manager" },
        company: { enabled: true, required: false, label: "Company", placeholder: "Acme Inc." },
        rating: { enabled: true, required: true, label: "Rating" },
        avatar: { enabled: true, required: false, label: "Your photo", helpText: "Optional • JPG, PNG up to 5MB" },
        testimonial: {
            enabled: true,
            required: true,
            label: "Your testimonial",
            minLength: 10,
            maxLength: 2000,
            placeholder: "Share your experience..."
        },
    },
    theme: {
        accentColor: "#10b981",
        backgroundColor: "#ffffff",
        cardStyle: "modern",
    },
    messages: {
        title: "Share your experience",
        subtitle: "Help others by sharing your honest feedback",
        submitButton: "Submit Review",
        successTitle: "Thank you!",
        successMessage: "Your testimonial has been submitted successfully.",
    },
};

// Helper to merge partial form settings with defaults
export const mergeFormSettings = (partial: Partial<FormSettings> | null | undefined): FormSettings => {
    if (!partial) return defaultFormSettings;

    return {
        fields: { ...defaultFormSettings.fields, ...partial.fields },
        theme: { ...defaultFormSettings.theme, ...partial.theme },
        messages: { ...defaultFormSettings.messages, ...partial.messages },
    };
};
