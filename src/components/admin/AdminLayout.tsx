
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Activity,
    Settings,
    LogOut,
    Scale,
    Menu,
    X
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const { signOut } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { label: "Overview", icon: LayoutDashboard, path: "/admin" },
        { label: "Users", icon: Users, path: "/admin/users" },
        { label: "Workspaces", icon: Briefcase, path: "/admin/workspaces" },
        { label: "Plans", icon: Scale, path: "/admin/plans" },
        { label: "Activity", icon: Activity, path: "/admin/activity" },
        { label: "Settings", icon: Settings, path: "/admin/settings" },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white/50 backdrop-blur-xl border-r border-gray-200/50">
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-primary rounded-sm" />
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">
                        Vouchy
                    </span>
                    <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full ml-2">Admin</span>
                </div>
            </div>

            <nav className="flex-1 px-3 py-6 space-y-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                                    ? "bg-primary/10 text-primary shadow-sm"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-gray-400"}`} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors group"
                >
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-primary rounded-sm" />
                    </div>
                    <span className="font-bold text-gray-900">Vouchy Admin</span>
                </div>
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="w-6 h-6 text-gray-700" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72 border-r border-gray-200">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-72 lg:block">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="lg:pl-72 pt-16 lg:pt-0 min-h-screen transition-all duration-300">
                <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
};
