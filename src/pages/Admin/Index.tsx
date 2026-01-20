
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Activity } from "lucide-react";

export default function AdminDashboard() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const [
                { count: usersCount },
                { count: workspacesCount }
            ] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('workspaces').select('*', { count: 'exact', head: true })
            ]);

            return {
                users: usersCount || 0,
                workspaces: workspacesCount || 0,
                activeWorkspaces: 0 // Placeholder until we confirm schema
            };
        }
    });

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/50 backdrop-blur-sm border-gray-100 hover:border-blue-100 transition-all hover:shadow-md group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900 tracking-tight">{isLoading ? "..." : stats?.users}</div>
                        <p className="text-xs text-gray-500 mt-1 font-medium">Registered users on platform</p>
                    </CardContent>
                </Card>

                <Card className="bg-white/50 backdrop-blur-sm border-gray-100 hover:border-purple-100 transition-all hover:shadow-md group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Workspaces</CardTitle>
                        <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                            <Briefcase className="w-5 h-5 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900 tracking-tight">{isLoading ? "..." : stats?.workspaces}</div>
                        <p className="text-xs text-gray-500 mt-1 font-medium">Created workspaces</p>
                    </CardContent>
                </Card>

                <Card className="bg-white/50 backdrop-blur-sm border-gray-100 hover:border-emerald-100 transition-all hover:shadow-md group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-gray-500">Active Workspaces</CardTitle>
                        <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                            <Activity className="w-5 h-5 text-emerald-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900 tracking-tight">{isLoading ? "..." : stats?.activeWorkspaces}</div>
                        <p className="text-xs text-gray-500 mt-1 font-medium">Currently active</p>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
