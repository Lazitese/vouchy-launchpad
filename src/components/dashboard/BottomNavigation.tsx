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
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-zinc-200/60 md:hidden safety-padding-bottom shadow-2xl shadow-zinc-900/10">
            <div className="flex items-center justify-around p-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 w-full gap-1.5 relative overflow-hidden group
                            ${activeView === item.id
                                ? "text-zinc-900"
                                : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50"
                            }`}
                    >
                        {activeView === item.id && (
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-100 to-transparent opacity-50" />
                        )}
                        <item.icon className={`w-6 h-6 z-10 ${activeView === item.id ? "stroke-[2.5px]" : "stroke-[1.5px]"}`} />
                        <span className={`text-[10px] font-medium z-10 ${activeView === item.id ? "font-bold" : ""}`}>{item.label}</span>
                        {activeView === item.id && (
                            <div className="absolute top-0 w-8 h-1 bg-zinc-900 rounded-b-full shadow-sm" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};
