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
import logoIcon from "@/assets/favicon.svg";

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
            <motion.aside
                className={`hidden md:flex sticky top-0 left-0 h-screen z-50 bg-white/95 backdrop-blur-xl border-r border-zinc-200/60 flex-col transition-all duration-300 
                    ${sidebarOpen ? "w-[260px]" : "w-[80px]"}
                `}
                initial={false}
                animate={{ x: 0 }}
            >
                {/* Logo */}
                <div className="h-[72px] px-6 flex items-center justify-between border-b border-dashed border-zinc-200/60">
                    <div className={`transition-all duration-300 overflow-hidden ${sidebarOpen ? "w-auto" : "w-10"}`}>
                        <img
                            src={logoIcon}
                            alt="Vouchy"
                            className="h-9 w-9"
                        />
                    </div>
                    {sidebarOpen && (
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400 hover:text-zinc-600"
                        >
                            <Menu className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Workspace Dropdown */}
                <div className="p-4">
                    <button className={`w-full bg-zinc-50 border border-zinc-200/60 rounded-xl flex items-center transition-all duration-200 group hover:border-zinc-300 hover:shadow-sm ${sidebarOpen ? "p-3 gap-3" : "p-2 justify-center"}`}>
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm"
                            style={{ backgroundColor: workspace?.primary_color || "#14873e" }}
                        >
                            {workspace?.name?.charAt(0) || "W"}
                        </div>
                        {sidebarOpen && (
                            <>
                                <div className="flex-1 text-left overflow-hidden">
                                    <p className="text-sm font-semibold text-zinc-900 truncate group-hover:text-black">
                                        {workspace?.name || "My Workspace"}
                                    </p>
                                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wide">{plan} plan</p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600" />
                            </>
                        )}
                    </button>
                </div>

                {/* Nav items */}
                <nav className="flex-1 px-4 space-y-1">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full rounded-xl flex items-center transition-all duration-300 relative group overflow-hidden
                                ${sidebarOpen ? "px-4 py-3 gap-3" : "px-0 py-3 justify-center"}
                                ${activeView === item.id
                                    ? "bg-[#14873e] text-white shadow-lg shadow-[#14873e]/20"
                                    : "text-zinc-500 hover:bg-zinc-50 hover:text-black"}
                            `}
                        >
                            <item.icon className={`w-[20px] h-[20px] shrink-0 transition-colors ${activeView === item.id ? "text-white" : "group-hover:text-black"}`} />
                            {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                            {!sidebarOpen && activeView === item.id && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-r-full" />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Bottom actions */}
                <div className="p-4 space-y-3 border-t border-dashed border-zinc-200/60 bg-zinc-50/30">
                    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className={`w-full bg-zinc-500  hover:bg-black text-white rounded-xl shadow-lg shadow-black/5 transition-all duration-300 ${!sidebarOpen && "p-0 aspect-square flex items-center justify-center"}`}
                            >
                                <Plus className="w-5 h-5" />
                                {sidebarOpen && <span className="ml-2 font-medium">New Space</span>}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="organic-card border-none shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">Create new space</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <div className="p-1 bg-zinc-100 rounded-xl">
                                    <Input
                                        placeholder="Space name (e.g., Product Reviews)"
                                        value={newSpaceName}
                                        onChange={(e) => setNewSpaceName(e.target.value)}
                                        maxLength={100}
                                        className="bg-white border-transparent focus:border-white shadow-sm h-12 text-lg"
                                    />
                                </div>
                                <Button
                                    className="w-full bg-[#14873e] hover:bg-[#0f6b30] text-white h-12 rounded-xl font-medium text-base shadow-lg shadow-[#14873e]/20"
                                    onClick={handleCreateSpace}
                                    disabled={!newSpaceName.trim() || creatingSpace}
                                >
                                    {creatingSpace ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        "Create Space"
                                    )}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <button
                        className={`w-full flex items-center text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 ${sidebarOpen ? "px-4 py-3 gap-3" : "px-0 py-3 justify-center"}`}
                        onClick={handleSignOut}
                    >
                        <LogOut className="w-5 h-5" />
                        {sidebarOpen && <span className="text-sm font-medium">Sign Out</span>}
                    </button>

                    {!sidebarOpen && (
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="w-full flex items-center justify-center py-2 text-zinc-300 hover:text-zinc-500"
                        >
                            <Menu className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </motion.aside>
        </>
    );
};
