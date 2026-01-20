
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAnalytics() {
    const { data: logs, isLoading } = useQuery({
        queryKey: ['admin-ai-logs'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('ai_usage_logs')
                .select('*, profiles:user_id(email, full_name)')
                .order('created_at', { ascending: false })
                .limit(100);

            if (error) throw error;
            return data;
        },
    });

    const totalCredits = logs?.reduce((acc, log) => acc + (log.credits || 0), 0) || 0;

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Analytics & Logs</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="border border-gray-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Recent AI Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{logs?.length || 0}</div>
                        <p className="text-xs text-gray-500">Last 100 requests</p>
                    </CardContent>
                </Card>
                <Card className="border border-gray-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Credits Consumed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-indigo-600">{totalCredits}</div>
                        <p className="text-xs text-gray-500">In recent logs</p>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/30">
                    <h2 className="text-lg font-semibold text-gray-900">Recent AI Usage Logs</h2>
                </div>

                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead className="min-w-[200px]">User</TableHead>
                                    <TableHead className="min-w-[150px]">Action</TableHead>
                                    <TableHead className="min-w-[150px]">Space ID</TableHead>
                                    <TableHead>Credits</TableHead>
                                    <TableHead className="text-right min-w-[150px]">Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs?.map((log: any) => (
                                    <TableRow key={log.id} className="hover:bg-gray-50/50">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                {log.profiles ? (
                                                    <span className="font-medium text-gray-900">{log.profiles.email}</span>
                                                ) : (
                                                    <span className="text-gray-500">Unknown User</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                {log.action}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-xs font-mono text-gray-500">
                                            {log.space_id ? log.space_id.substring(0, 8) + '...' : '-'}
                                        </TableCell>
                                        <TableCell className="font-semibold text-gray-700">{log.credits}</TableCell>
                                        <TableCell className="text-right text-gray-500 text-sm">
                                            {log.created_at ? format(new Date(log.created_at), 'MMM d, HH:mm') : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
