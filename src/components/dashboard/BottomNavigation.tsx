import {
    LayoutGrid,
    BarChart3,
    Heart,
    Settings,
    Palette,
} from "lucide-react";
import { View } from "./Sidebar";

interface BottomNavigationProps {
    activeView: View;
    setActiveView: (view: View) => void;
}

const navItems = [
    { id: "spaces" as View, icon: LayoutGrid, label: "Spaces" },
    { id: "analytics" as View, icon: BarChart3, label: "Analytics" },
    { id: "wall" as View, icon: Heart, label: "Wall" },
    { id: "widget" as View, icon: Palette, label: "Widget" },
    { id: "settings" as View, icon: Settings, label: "Settings" },
];

export const BottomNavigation = ({ activeView, setActiveView }: BottomNavigationProps) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border/[0.08] md:hidden safety-padding-bottom">
            <div className="flex items-center justify-around p-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 w-full gap-1
                            ${activeView === item.id
                                ? "text-primary"
                                : "text-subtext hover:text-foreground"
                            }`}
                    >
                        <item.icon className={`w-5 h-5 ${activeView === item.id ? "fill-current" : ""}`} />
                        <span className="text-[10px] font-medium">{item.label}</span>
                        {activeView === item.id && (
                            <div className="absolute top-0 w-8 h-0.5 bg-primary rounded-b-full transform -translate-y-1/2" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};
