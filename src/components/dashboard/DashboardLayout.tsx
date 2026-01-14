import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    BarChart2,
    Heart,
    Settings,
    LogOut,
    FlaskConical,
    Menu,
    X,
    CreditCard,
    User,
    Hash,
    Bell,
    Search,
    Folder,
    Play,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
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
                title: `New ${t.type} testimonial from ${t.author_name}`,
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
        <div className="h-screen bg-[#F0F2F5] text-foreground flex overflow-hidden font-sans">

            {/* Sidebar - Desktop (Slim Rail) */}
            <aside className="hidden md:flex w-24 flex-col items-center fixed inset-y-0 left-0 z-50 py-8 bg-transparent">
                {/* Logo */}
                <div className="mb-12">
                    {workspace?.logo_url ? (
                        <img
                            src={workspace.logo_url}
                            alt={workspace.name || 'Workspace'}
                            className="w-10 h-10 rounded-xl object-cover shadow-xl"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xl shadow-xl">
                            {workspace?.name?.charAt(0).toUpperCase() || 'V'}
                        </div>
                    )}
                </div>

                {/* Navigation Rail */}
                <div className="flex-1 flex flex-col gap-6 w-full items-center">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={cn(
                                "nav-icon relative group",
                                activeView === item.id && "active"
                            )}
                            title={item.label}
                        >
                            <item.icon className="w-6 h-6" strokeWidth={2} />

                            {/* Hover Label Tooltip */}
                            <div className="absolute left-14 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-50">
                                {item.label}
                            </div>
                        </button>
                    ))}
                </div>

                {/* User / Logout */}
                <div className="mt-auto flex flex-col gap-4 items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-white hover:text-red-500 transition-colors"
                        onClick={() => signOut()}
                    >
                        <LogOut className="w-5 h-5" />
                    </Button>

                </div>
            </aside>


            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b z-50 flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    {workspace?.logo_url ? (
                        <img
                            src={workspace.logo_url}
                            alt={workspace.name || 'Workspace'}
                            className="w-8 h-8 rounded-lg object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-lg">
                            {workspace?.name?.charAt(0).toUpperCase() || 'V'}
                        </div>
                    )}
                    <span className="font-bold text-lg tracking-tight">{workspace?.name || 'Vouchy'}</span>
                </div>
                <Avatar
                    className="w-8 h-8 shadow-sm cursor-pointer hover:ring-2 hover:ring-black/10 transition-all"
                    onClick={() => setActiveView('settings')}
                >
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-[#ccf381] text-black text-[10px] font-bold">
                        {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-24 min-h-screen relative p-4 md:p-8 pt-20 md:pt-8 pb-24 md:pb-8 overflow-y-auto">
                {/* Top Header Row (Simulating the reference 'Your Schedule / Search' bar) */}
                <header className="hidden md:flex items-center justify-between mb-10 max-w-[1600px] mx-auto">
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                        <h1 className="text-4xl font-light tracking-tight text-black dark:text-white">
                            Hello, <span className="font-semibold">{user?.email?.split('@')[0]}</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="h-12 pl-12 pr-4 bg-white rounded-full border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/5 w-64 transition-all"
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="relative w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                                    <Bell className="w-5 h-5 text-gray-600" />
                                    {/* Show badge if there are new activities */}
                                    {recentActivities.length > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                            {recentActivities.length > 9 ? '9+' : recentActivities.length}
                                        </span>
                                    )}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                                <div className="p-3 border-b">
                                    <h3 className="font-bold text-sm">Recent Activity</h3>
                                    <p className="text-xs text-gray-500">
                                        {recentActivities.length === 0 ? 'No recent activity' : `${recentActivities.length} recent updates`}
                                    </p>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {recentActivities.length === 0 ? (
                                        <div className="p-8 text-center text-gray-400 text-sm">
                                            No recent activity
                                        </div>
                                    ) : (
                                        recentActivities.map((activity, i) => (
                                            <DropdownMenuItem
                                                key={i}
                                                className="p-3 cursor-pointer"
                                                onClick={() => {
                                                    if (activity.type === 'testimonial') {
                                                        setActiveView('wall');
                                                    } else if (activity.type === 'space') {
                                                        setActiveView('manage-spaces');
                                                    }
                                                }}
                                            >
                                                <div className="flex gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${activity.type === 'testimonial' ? 'bg-blue-50' : 'bg-green-50'
                                                        }`}>
                                                        <activity.icon className={`w-4 h-4 ${activity.type === 'testimonial' ? 'text-blue-600' : 'text-green-600'
                                                            }`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {activity.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{activity.time}</p>
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

            {/* Mobile Menu Overlay - Keep for specific settings if needed, but primary nav is now bottom bar */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
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
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="space-y-4 pb-8">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-4 h-14 rounded-2xl text-red-600 hover:bg-red-50 hover:text-red-700"
                                    onClick={() => signOut()}
                                >
                                    <LogOut className="w-6 h-6" />
                                    <span className="text-lg font-medium">Sign Out</span>
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Navigation for Mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-50 flex items-center justify-around px-2 pb-safe-offset-2 h-[4.5rem] shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
                {NAV_ITEMS.map((item) => {
                    const isActive = activeView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 w-16 h-full transition-all duration-300 relative",
                                isActive ? "text-black" : "text-gray-400"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="bottom-nav-indicator"
                                    className="absolute -top-[1px] w-8 h-[3px] bg-black rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <item.icon
                                className={cn(
                                    "w-5 h-5 transition-transform duration-300",
                                    isActive && "scale-110"
                                )}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span className={cn(
                                "text-[10px] font-bold tracking-tight transition-all duration-300",
                                isActive ? "opacity-100" : "opacity-70"
                            )}>
                                {item.label.split(' ')[0]}
                            </span>
                        </button>
                    );
                })}
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="flex flex-col items-center justify-center gap-1 w-16 h-full text-gray-400"
                >
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                        <Menu className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold opacity-70">More</span>
                </button>
            </nav>
        </div>
    );
};
