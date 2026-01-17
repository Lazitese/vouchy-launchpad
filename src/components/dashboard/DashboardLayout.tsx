import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Heart,
    Settings,
    LogOut,
    FlaskConical,
    Menu,
    X,
    Folder,
    Play,
    MessageSquare,
    Bell,
    Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type View = "spaces" | "analytics" | "wall" | "settings" | "widget" | "space-settings" | "manage-spaces";

interface NavItem {
    id: View;
    label: string;
    icon: any;
}

const NAV_ITEMS: NavItem[] = [
    { id: "spaces", label: "Overview", icon: LayoutDashboard },
    { id: "manage-spaces", label: "Manage Spaces", icon: Folder },
    { id: "wall", label: "Wall of Love", icon: Heart },
    { id: "widget", label: "Widget Lab", icon: FlaskConical },
    { id: "settings", label: "Settings", icon: Settings },
];

interface DashboardLayoutProps {
    children: React.ReactNode;
    activeView: View;
    setActiveView: (view: View) => void;
    user: any;
    testimonials?: any[];
    spaces?: any[];
    workspace?: any;
}

export const DashboardLayout = ({
    children,
    activeView,
    setActiveView,
    user,
    testimonials = [],
    spaces = [],
    workspace
}: DashboardLayoutProps) => {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Calculate recent activities
    const recentActivities = useMemo(() => {
        const activities: any[] = [];

        // Add recent testimonials (last 5)
        const recentTestimonials = [...testimonials]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 3);

        recentTestimonials.forEach(t => {
            activities.push({
                type: 'testimonial',
                icon: t.type === 'video' ? Play : MessageSquare,
                title: `New ${t.type} testimonial from ${t.name}`,
                time: new Date(t.created_at).toLocaleDateString(),
                data: t
            });
        });

        // Add recent spaces (last 2)
        const recentSpaces = [...spaces]
            .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
            .slice(0, 2);

        recentSpaces.forEach(s => {
            activities.push({
                type: 'space',
                icon: Folder,
                title: `Space "${s.name}" created`,
                time: new Date(s.created_at || Date.now()).toLocaleDateString(),
                data: s
            });
        });

        return activities.slice(0, 15);
    }, [testimonials, spaces]);

    return (
        <div className="h-screen bg-engineering-grid text-zinc-900 flex overflow-hidden font-sans selection:bg-[#ccf381] selection:text-black">

            {/* Sidebar - Desktop (Slim Rail) */}
            <aside className="hidden md:flex w-20 flex-col items-center fixed inset-y-0 left-0 z-50 py-8 border-r border-zinc-200/50 bg-white/60 backdrop-blur-xl">
                {/* Logo */}
                <div className="mb-12">
                    {workspace?.logo_url ? (
                        <img
                            src={workspace.logo_url}
                            alt={workspace.name || 'Workspace'}
                            className="w-10 h-10 rounded-xl object-cover shadow-sm ring-1 ring-zinc-100"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-[#14873e] text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-[#14873e]/20">
                            {workspace?.name?.charAt(0).toUpperCase() || 'V'}
                        </div>
                    )}
                </div>

                {/* Navigation Rail */}
                <div className="flex-1 flex flex-col gap-6 w-full items-center">
                    {NAV_ITEMS.map((item) => {
                        const isActive = activeView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveView(item.id)}
                                className={cn(
                                    "relative group w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300",
                                    isActive
                                        ? "bg-[#14873e] text-white shadow-[0_0_20px_-5px_rgba(20,135,62,0.5)]"
                                        : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
                                )}
                            >
                                <item.icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />

                                {/* Hover Label Tooltip */}
                                <div className="absolute left-14 px-3 py-1.5 bg-black text-white text-xs font-semibold rounded-lg opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-xl z-50">
                                    {item.label}
                                    {/* Arrow */}
                                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-black" />
                                </div>
                            </button>
                        )
                    })}
                </div>

                {/* User / Logout */}
                <div className="mt-auto flex flex-col gap-4 items-center mb-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl w-10 h-10 text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => signOut()}
                        title="Sign Out"
                    >
                        <LogOut className="w-5 h-5" strokeWidth={1.5} />
                    </Button>
                </div>
            </aside>


            {/* Mobile Top Bar */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-zinc-200/60 z-50 flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    {workspace?.logo_url ? (
                        <img
                            src={workspace.logo_url}
                            alt={workspace.name || 'Workspace'}
                            className="w-8 h-8 rounded-lg object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-lg bg-[#14873e] text-white flex items-center justify-center font-bold text-lg shadow-md">
                            {workspace?.name?.charAt(0).toUpperCase() || 'V'}
                        </div>
                    )}
                    <span className="font-bold text-lg tracking-tight text-zinc-900">{workspace?.name || 'Vouchy'}</span>
                </div>
                <Avatar
                    className="w-8 h-8 shadow-sm cursor-pointer hover:ring-2 hover:ring-zinc-900/10 transition-all"
                    onClick={() => setActiveView('settings')}
                >
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-[#14873e] text-white text-[10px] font-bold border border-white/10">
                        {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-20 min-h-screen relative p-4 md:p-10 pt-20 md:pt-10 pb-24 md:pb-10 overflow-y-auto w-full max-w-[1920px] mx-auto scrollbar-hide">
                {/* Top Header Row */}
                <header className="hidden md:flex items-center justify-between mb-12">
                    <div>
                        <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                        <h1 className="text-3xl font-medium tracking-tight text-zinc-900">
                            Hello, <span className="font-bold">{user?.email?.split('@')[0]}</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="h-11 pl-11 pr-4 bg-white/60 hover:bg-white focus:bg-white rounded-xl border border-zinc-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#14873e]/50 focus:border-[#14873e] w-64 transition-all placeholder:text-zinc-400 text-sm backdrop-blur-sm"
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="relative w-11 h-11 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm hover:shadow-md hover:border-zinc-300 transition-all group">
                                    <Bell className="w-5 h-5 text-zinc-500 group-hover:text-zinc-900 transition-colors" />
                                    {/* Show badge if there are new activities */}
                                    {recentActivities.length > 0 && (
                                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white">
                                        </span>
                                    )}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80 rounded-2xl border-zinc-200/60 shadow-xl bg-white/80 backdrop-blur-xl p-2 mt-2">
                                <div className="p-3 border-b border-zinc-100 mb-1">
                                    <h3 className="font-bold text-sm text-zinc-900">Recent Activity</h3>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {recentActivities.length === 0 ? (
                                        <div className="p-8 text-center text-zinc-400 text-sm">
                                            No recent activity
                                        </div>
                                    ) : (
                                        recentActivities.map((activity, i) => (
                                            <DropdownMenuItem
                                                key={i}
                                                className="p-3 cursor-pointer rounded-xl focus:bg-zinc-50"
                                                onClick={() => {
                                                    if (activity.type === 'testimonial') {
                                                        setActiveView('wall');
                                                    } else if (activity.type === 'space') {
                                                        setActiveView('manage-spaces');
                                                    }
                                                }}
                                            >
                                                <div className="flex gap-3 items-start">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 shadow-sm ${activity.type === 'testimonial' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-emerald-50 border-emerald-100 text-[#ccf381]-700'
                                                        }`}>
                                                        <activity.icon className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-zinc-900 truncate">
                                                            {activity.title}
                                                        </p>
                                                        <p className="text-[10px] text-zinc-400 mt-0.5">{activity.time}</p>
                                                    </div>
                                                </div>
                                            </DropdownMenuItem>
                                        ))
                                    )}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <div className="max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            className="absolute bottom-0 left-0 right-0 h-auto bg-white p-6 rounded-t-[32px] shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <span className="font-bold text-xl text-black">More Options</span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="space-y-4 pb-8">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-4 h-14 rounded-2xl text-red-600 hover:bg-red-50 hover:text-red-700 font-medium"
                                    onClick={() => signOut()}
                                >
                                    <LogOut className="w-6 h-6" />
                                    <span className="text-lg">Sign Out</span>
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Navigation for Mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-zinc-200/60 z-50 flex items-center justify-around px-2 pb-safe-offset-2 h-[5rem] shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
                {NAV_ITEMS.map((item) => {
                    const isActive = activeView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1.5 w-16 h-full transition-all duration-300 relative group",
                                isActive ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="bottom-nav-indicator"
                                    className="absolute inset-x-3 top-2 bottom-2 bg-zinc-100 rounded-xl -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <item.icon
                                className={cn(
                                    "w-6 h-6 z-10 transition-transform duration-300",
                                    isActive && "scale-110"
                                )}
                                strokeWidth={isActive ? 2.5 : 1.5}
                            />
                            <span className={cn(
                                "text-[10px] font-medium tracking-tight transition-all duration-300 z-10",
                            )}>
                                {item.label.split(' ')[0]}
                            </span>
                        </button>
                    );
                })}
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="flex flex-col items-center justify-center gap-1.5 w-16 h-full text-zinc-400 hover:text-zinc-600 rounded-xl transition-all"
                >
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                        <Menu className="w-4 h-4 text-zinc-600" strokeWidth={2} />
                    </div>
                </button>
            </nav>
        </div>
    );
};
