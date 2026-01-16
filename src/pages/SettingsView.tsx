import { useState, useEffect } from "react";
import { User, CreditCard, Layout, Shield, LogOut, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlanUpgradeCard } from "@/components/dashboard/PlanUpgradeCard";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface SettingsViewProps {
    user: any;
    workspace: any;
    plan: any;
    features: any;
    signOut: () => void;
}

export const SettingsView = ({ user, workspace, plan, features, signOut }: SettingsViewProps) => {
    const [activeTab, setActiveTab] = useState<"profile" | "workspace" | "plan">("profile");
    const [usageStats, setUsageStats] = useState<any[]>([]);
    const [loadingUsage, setLoadingUsage] = useState(false);
    const [totalUsed, setTotalUsed] = useState(0);

    const tabs = [
        { id: "profile", label: "My Profile", icon: User },
        { id: "workspace", label: "Workspace", icon: Layout },
        { id: "plan", label: "Plan & Billing", icon: CreditCard },
    ];

    useEffect(() => {
        if (activeTab === "plan" && user) {
            fetchUsageStats();
        }
    }, [activeTab, user]);

    const fetchUsageStats = async () => {
        setLoadingUsage(true);
        try {
            // Fetch logs for the user
            const { data: logs, error } = await supabase
                .from('ai_usage_logs')
                .select('credits, space_id, action, created_at')
                .eq('user_id', user.id);

            if (error) throw error;

            // Fetch spaces to map IDs to names
            const { data: spaces } = await supabase
                .from('spaces')
                .select('id, name');

            const spaceMap = new Map(spaces?.map((s: any) => [s.id, s.name]) || []);

            // Aggregate Usage by Space
            const bySpace: Record<string, number> = {};
            let total = 0;

            logs?.forEach((log: any) => {
                total += log.credits;
                const spaceName = log.space_id ? (spaceMap.get(log.space_id) || 'Unknown Space') : 'Direct Usage';
                bySpace[spaceName] = (bySpace[spaceName] || 0) + log.credits;
            });

            const stats = Object.entries(bySpace)
                .map(([name, credits]) => ({ name, credits }))
                .sort((a, b) => b.credits - a.credits);

            setUsageStats(stats);
            setTotalUsed(total);
        } catch (err) {
            console.error("Error fetching usage stats:", err);
        } finally {
            setLoadingUsage(false);
        }
    };

    return (
        <div className="w-full max-w-5xl py-8">
            <h1 className="text-3xl font-bold mb-8 text-black px-1">Settings</h1>

            {/* Top Navigation Tabs */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div className="flex p-1 bg-zinc-100/80 backdrop-blur-sm rounded-xl md:rounded-full self-start w-full md:w-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`
                                flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg md:rounded-full text-sm font-medium transition-all duration-300
                                ${activeTab === tab.id
                                    ? "bg-white text-black shadow-sm"
                                    : "text-zinc-500 hover:text-black hover:bg-white/50"}
                            `}
                        >
                            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-[#14873e]" : "text-zinc-400"}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <Button
                    onClick={signOut}
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 md:ml-auto w-full md:w-auto justify-start md:justify-center"
                >
                    <LogOut className="w-4 h-4" />
                    Log Out
                </Button>
            </div>

            {/* Main Content Area */}
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Profile Section */}
                {activeTab === "profile" && (
                    <div className="space-y-4 md:space-y-6">
                        <div className="organic-card p-6 md:p-10">
                            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-8 text-black">Profile Information</h2>
                            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8">
                                <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-gray-50 shadow-xl">
                                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                                    <AvatarFallback className="bg-[#14873e] text-white text-4xl font-bold">
                                        {user?.email?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-4 md:space-y-6 flex-1 w-full">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                                            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                                                <p className="font-medium text-lg text-black">{user?.user_metadata?.full_name || "N/A"}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                                            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                                                <p className="font-medium text-lg text-black">{user?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <Button variant="outline" className="rounded-full border-gray-200 w-full md:w-auto" disabled>
                                            Manage Google Account
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Workspace Section */}
                {activeTab === "workspace" && (
                    <div className="space-y-4 md:space-y-6">
                        <div className="organic-card p-6 md:p-10">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold text-black">Workspace Settings</h2>
                                    <p className="text-sm text-gray-400 mt-1">Manage your brand and space details</p>
                                </div>
                                <div className="px-3 py-1 bg-lime-100 text-lime-800 text-xs font-bold rounded-full uppercase tracking-wide">
                                    Active Space
                                </div>
                            </div>

                            <div className="max-w-2xl space-y-8">
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-3">Workspace Name</label>
                                    <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                                        <input
                                            value={workspace?.name || ""}
                                            readOnly
                                            className="flex-1 bg-white border border-zinc-200 rounded-xl px-4 py-3 text-black font-medium focus:ring-2 focus:ring-[#14873e]/20 focus:border-[#14873e] outline-none transition-all shadow-sm"
                                        />
                                        <Button className="bg-[#14873e] text-white hover:bg-[#0f6b30] rounded-xl h-auto px-8 w-full md:w-auto font-medium shadow-lg shadow-[#14873e]/20">Save Changes</Button>
                                    </div>
                                </div>

                                <div className="h-px bg-zinc-100" />

                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-3">Primary Brand Color</label>
                                    <div className="flex items-center gap-4 p-4 border border-zinc-200 rounded-2xl bg-white shadow-sm hover:border-[#14873e]/30 transition-colors cursor-pointer group">
                                        <div
                                            className="w-14 h-14 rounded-xl shadow-md border-2 border-white ring-1 ring-black/5 group-hover:scale-105 transition-transform"
                                            style={{ backgroundColor: workspace?.primary_color || '#000000' }}
                                        />
                                        <div>
                                            <p className="font-mono text-base font-medium text-black">{workspace?.primary_color || '#000000'}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Used for buttons and accents in your public page</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Plan Section */}
                {activeTab === "plan" && (
                    <div className="space-y-8">
                        {/* AI Usage Analytics */}
                        <div className="organic-card p-6 md:p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm border border-purple-100">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-black">AI Credits Usage</h2>
                                    <p className="text-sm text-gray-400 mt-1">Monitor your monthly AI consumption</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-12">
                                {/* Total Usage */}
                                <div className="space-y-6">
                                    <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                                        <p className="text-sm font-medium text-zinc-500 mb-4">Total Usage This Month</p>
                                        <div className="flex items-baseline gap-2 mb-4">
                                            <span className="text-5xl font-black text-black tracking-tight">{totalUsed}</span>
                                            <span className="text-zinc-400 font-medium text-lg">/ {features.aiCredits}</span>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="h-4 bg-zinc-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${totalUsed >= features.aiCredits ? 'bg-red-500' : 'bg-[#14873e]'}`}
                                                    style={{ width: `${Math.min(100, (totalUsed / (Math.max(features.aiCredits, 1))) * 100)}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-xs font-medium text-zinc-400">
                                                <span>0</span>
                                                <span>{Math.round((totalUsed / (Math.max(features.aiCredits, 1))) * 100)}% used</span>
                                            </div>
                                        </div>

                                        {totalUsed >= features.aiCredits && (
                                            <div className="flex items-start gap-3 text-sm text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-100 mt-6">
                                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                                <p>You have reached your monthly AI credit limit. Upgrade your plan or wait for the next cycle.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Usage by Space */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-bold text-zinc-900">Usage by Space</h3>
                                        <span className="text-xs text-zinc-400">Top 5</span>
                                    </div>

                                    <div className="organic-card p-0 border border-zinc-100 overflow-hidden">
                                        {loadingUsage ? (
                                            <div className="flex justify-center py-12">
                                                <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />
                                            </div>
                                        ) : usageStats.length > 0 ? (
                                            <div className="divide-y divide-zinc-50">
                                                {usageStats.slice(0, 5).map((stat, i) => (
                                                    <div key={i} className="flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 font-bold text-xs border border-zinc-200">
                                                                {stat.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-zinc-900 text-sm">{stat.name}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-mono text-sm font-medium text-zinc-600">{stat.credits}</span>
                                                            <span className="text-xs text-zinc-400">creds</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-12 text-center">
                                                <p className="text-sm text-zinc-400 italic">No usage data found.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upgrade Card */}
                        <div className="pt-4">
                            <h2 className="text-xl font-bold text-black mb-6">Manage Subscription</h2>
                            <PlanUpgradeCard
                                currentPlan={plan}
                                features={features}
                                user={user}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
