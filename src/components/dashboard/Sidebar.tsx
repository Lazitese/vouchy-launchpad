import { motion } from "framer-motion";
import {
    LayoutGrid,
    BarChart3,
    Heart,
    Settings,
    Plus,
    Palette,
    ChevronDown,
    Menu,
    LogOut,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import logoIcon from "@/assets/logo-icon.svg";

export type View = "spaces" | "analytics" | "wall" | "settings" | "widget";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    workspace: any;
    plan: string;
    activeView: View;
    setActiveView: (view: View) => void;
    createDialogOpen: boolean;
    setCreateDialogOpen: (open: boolean) => void;
    newSpaceName: string;
    setNewSpaceName: (name: string) => void;
    handleCreateSpace: () => void;
    creatingSpace: boolean;
    handleSignOut: () => void;
}

const sidebarItems = [
    { id: "spaces" as View, icon: LayoutGrid, label: "Spaces" },
    { id: "analytics" as View, icon: BarChart3, label: "Analytics" },
    { id: "wall" as View, icon: Heart, label: "Wall of Love" },
    { id: "widget" as View, icon: Palette, label: "Widget Lab" },
    { id: "settings" as View, icon: Settings, label: "Settings" },
];

export const Sidebar = ({
    sidebarOpen,
    setSidebarOpen,
    workspace,
    plan,
    activeView,
    setActiveView,
    createDialogOpen,
    setCreateDialogOpen,
    newSpaceName,
    setNewSpaceName,
    handleCreateSpace,
    creatingSpace,
    handleSignOut,
}: SidebarProps) => {
    return (
        <>
            {/* Mobile Overlay */}


            <motion.aside
                className={`hidden md:flex sticky top-0 left-0 h-screen z-50 bg-slate border-r border-border/[0.08] flex-col transition-all duration-300 
                    ${sidebarOpen ? "w-64" : "w-20"}
                `}
                initial={false}
                animate={{ x: 0 }}
            >
                {/* Logo */}
                <div className="p-6 flex items-center justify-between">
                    <img
                        src={logoIcon}
                        alt="Vouchy"
                        className={`transition-all duration-300 ${sidebarOpen ? "h-12 w-12" : "h-10 w-10"}`}
                    />
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-background/50 rounded-lg transition-colors"
                    >
                        <Menu className="w-4 h-4 text-subtext" />
                    </button>
                </div>

                {/* Workspace */}
                <div className="px-4 mb-6">
                    <button className="w-full p-3 bg-background rounded-[8px] flex items-center gap-3 hover:shadow-sm transition-shadow">
                        <div
                            className="w-8 h-8 rounded-[6px] flex items-center justify-center text-white text-sm font-bold"
                            style={{ backgroundColor: workspace?.primary_color || "#1a3f64" }}
                        >
                            {workspace?.name?.charAt(0) || "W"}
                        </div>
                        {sidebarOpen && (
                            <>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-medium text-primary truncate">
                                        {workspace?.name || "My Workspace"}
                                    </p>
                                    <p className="text-xs text-subtext capitalize">{plan} plan</p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-subtext" />
                            </>
                        )}
                    </button>
                </div>

                {/* Nav items */}
                <nav className="flex-1 px-3">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full p-3 mb-1 rounded-[8px] flex items-center gap-3 transition-all duration-200 ${activeView === item.id
                                ? "bg-primary text-primary-foreground"
                                : "text-foreground/70 hover:bg-background/50"
                                }`}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                        </button>
                    ))}


                </nav>

                {/* Bottom actions */}
                <div className="p-4 space-y-2">
                    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="hero" className={`w-full ${!sidebarOpen && "p-2"}`}>
                                <Plus className="w-4 h-4" />
                                {sidebarOpen && <span className="ml-2">New Space</span>}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create new space</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <Input
                                    placeholder="Space name (e.g., Product Reviews)"
                                    value={newSpaceName}
                                    onChange={(e) => setNewSpaceName(e.target.value)}
                                    maxLength={100}
                                />
                                <Button
                                    variant="hero"
                                    className="w-full"
                                    onClick={handleCreateSpace}
                                    disabled={!newSpaceName.trim() || creatingSpace}
                                >
                                    {creatingSpace ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        "Create Space"
                                    )}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Button
                        variant="ghost"
                        className={`w-full text-subtext hover:text-foreground ${!sidebarOpen && "p-2"}`}
                        onClick={handleSignOut}
                    >
                        <LogOut className="w-4 h-4" />
                        {sidebarOpen && <span className="ml-2">Sign Out</span>}
                    </Button>
                </div>
            </motion.aside>
        </>
    );
};
