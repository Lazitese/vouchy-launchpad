import { useState } from "react";
import { User, CreditCard, Layout, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlanUpgradeCard } from "@/components/dashboard/PlanUpgradeCard";

interface SettingsViewProps {
    user: any;
    workspace: any;
    plan: any;
    features: any;
    signOut: () => void;
}

export const SettingsView = ({ user, workspace, plan, features, signOut }: SettingsViewProps) => {
    const [activeTab, setActiveTab] = useState<"profile" | "workspace" | "plan">("profile");

    const tabs = [
        { id: "profile", label: "My Profile", icon: User },
        { id: "workspace", label: "Workspace", icon: Layout },
        { id: "plan", label: "Plan & Billing", icon: CreditCard },
    ];

    return (
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 md:gap-8">
            {/* Left Sidebar for Settings */}
            <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl md:rounded-[24px] shadow-sm border border-black/5 p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`
                                flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl text-xs md:text-sm font-medium transition-all whitespace-nowrap
                                ${activeTab === tab.id
                                    ? "bg-black text-white shadow-md"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-black"}
                            `}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}

                    <div className="hidden lg:block h-px bg-gray-100 my-2 mx-4" />

                    <button
                        onClick={signOut}
                        className="hidden lg:flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full"
                    >
                        <LogOut className="w-4 h-4" />
                        Log Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9 space-y-6">

                {/* Profile Section */}
                {activeTab === "profile" && (
                    <div className="space-y-4 md:space-y-6">
                        <div className="organic-card p-4 md:p-8">
                            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-black">Profile Information</h2>
                            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                                <Avatar className="w-24 h-24 border-4 border-gray-50 shadow-xl">
                                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                                    <AvatarFallback className="bg-gray-100 text-2xl font-bold text-gray-400">
                                        {user?.email?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-3 md:space-y-4 flex-1">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                                            <p className="font-medium text-lg text-black mt-1">{user?.user_metadata?.full_name || "N/A"}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                                            <p className="font-medium text-lg text-black mt-1">{user?.email}</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="rounded-full border-gray-200 w-full md:w-auto" disabled>
                                        Manage Google Account
                                    </Button>
                                </div>
                            </div>
                        </div>


                    </div>
                )}

                {/* Workspace Section */}
                {activeTab === "workspace" && (
                    <div className="space-y-4 md:space-y-6">
                        <div className="organic-card p-4 md:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold text-black">Workspace Settings</h2>
                                    <p className="text-sm text-gray-400">Manage your brand and space details</p>
                                </div>
                                <div className="px-3 py-1 bg-lime-100 text-lime-800 text-xs font-bold rounded-full uppercase">
                                    Active
                                </div>
                            </div>

                            <div className="grid gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Workspace Name</label>
                                    <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                                        <input
                                            value={workspace?.name || ""}
                                            readOnly
                                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black font-medium focus:ring-2 focus:ring-black/5 outline-none"
                                        />
                                        <Button className="bg-black text-white hover:bg-gray-800 rounded-xl h-auto px-6 w-full md:w-auto">Save</Button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Brand Color</label>
                                    <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                                        <div
                                            className="w-12 h-12 rounded-xl shadow-sm border border-white"
                                            style={{ backgroundColor: workspace?.primary_color || '#000000' }}
                                        />
                                        <div>
                                            <p className="font-mono text-sm text-gray-500">{workspace?.primary_color || '#000000'}</p>
                                            <p className="text-xs text-gray-400">Used for buttons and accents in your public page</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Plan Section */}
                {activeTab === "plan" && (
                    <div className="space-y-6">
                        <PlanUpgradeCard
                            currentPlan={plan}
                            features={features}
                            user={user}
                        />
                    </div>
                )}

            </div>
        </div>
    );
};
