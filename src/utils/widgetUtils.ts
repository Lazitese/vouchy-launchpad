import { Tables } from "@/integrations/supabase/types";

export type Testimonial = Tables<"testimonials">;

export interface CustomStyles {
    primaryColor: string;
    backgroundColor: string;
    cardBackgroundColor?: string; // New: Specific card BG
    textColor: string;
    authorColor?: string; // New: Author Name
    roleColor?: string; // New: Author Title/Role
    contentColor?: string; // New: Testimonial Text
    borderColor: string;
    borderRadius: string;
    showShadow: boolean;
    showBorder: boolean;
    filterVideo?: boolean;
    filterText?: boolean;
    fontFamily?: string; // New: Font
}

export const defaultStyles: CustomStyles = {
    primaryColor: "#3b82f6",
    backgroundColor: "",
    cardBackgroundColor: "",
    textColor: "",
    authorColor: "",
    roleColor: "",
    contentColor: "",
    borderColor: "",
    borderRadius: "1rem",
    showShadow: true,
    showBorder: true,
    filterVideo: true,
    filterText: true,
    fontFamily: "Inter",
};

export const widgetStyles = [
    // Free Layouts (2)
    { id: "cards", name: "Cards", description: "Modern cards", isPro: false },
    { id: "minimalStacked", name: "Minimal Stacked", description: "Clean vertical list", isPro: false },

    // Premium Layouts (13)
    { id: "bento", name: "Bento", description: "Structured grid", isPro: true },
    { id: "marquee", name: "Marquee", description: "Infinite scroll", isPro: true },
    { id: "timeline", name: "Timeline", description: "Story flow", isPro: true },
    { id: "floating", name: "Floating Cards", description: "3D hover effect", isPro: true },
    { id: "glass", name: "Glass Prism", description: "Refractive masonry", isPro: true },
    { id: "polaroid", name: "Polaroid Stack", description: "Nostalgic moments", isPro: true },
    { id: "parallax", name: "Parallax Scroll", description: "Smooth motion", isPro: true },
    { id: "cinematic", name: "Cinematic", description: "Widescreen slider", isPro: true },
    { id: "orbit", name: "Orbit Ring", description: "Circular showcase", isPro: true },
    { id: "radial", name: "Radial Burst", description: "Explosive energy", isPro: true },
    { id: "news", name: "News Ticker", description: "Featured highlight", isPro: true },
    { id: "masonryWall", name: "Masonry Wall", description: "Dense grid", isPro: true },
    { id: "deck", name: "Deck Stack", description: "Interactive deck", isPro: true },
] as const;

export function hexToHSL(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return "";
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;
    if (max == min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
