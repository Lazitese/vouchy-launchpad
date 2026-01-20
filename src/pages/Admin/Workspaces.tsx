
import { useNavigate } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2, ExternalLink } from "lucide-react";

export default function AdminWorkspaces() {
    const navigate = useNavigate();
    const { data: workspaces, isLoading } = useQuery({
        queryKey: ['admin-workspaces'],
        queryFn: async () => {
            // Try to join profiles based on user_id
            // Note: This relies on a foreign key relationship between workspaces.user_id and profiles.id
            // If it fails, we might need to fetch profiles separately or adjust the query
            const { data, error } = await supabase
                .from('workspaces')
                .select('*, profiles(email, full_name)')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching workspaces:", error);
                // Fallback if join fails
                const { data: fallbackData } = await supabase
                    .from('workspaces')
                    .select('*')
                    .order('created_at', { ascending: false });
                return fallbackData;
            }
            return data;
        }
    });

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Workspaces</h1>
                    <p className="text-gray-500 mt-1">Manage user workspaces</p>
                </div>
                <Badge variant="outline" className="text-lg py-1 px-4 border-primary/20 bg-primary/5 text-primary">
                    Total: {workspaces?.length || 0}
                </Badge>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead className="w-[200px] min-w-[200px]">Workspace Name</TableHead>
                                    <TableHead className="min-w-[200px]">Owner</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right min-w-[150px]">Created</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {workspaces?.map((ws: any) => (
                                    <TableRow
                                        key={ws.id}
                                        className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                                        onClick={() => navigate(`/admin/workspaces/${ws.id}`)}
                                    >
                                        <TableCell className="font-medium text-gray-900 group-hover:text-primary transition-colors">{ws.name}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                {ws.profiles ? (
                                                    <>
                                                        <span className="font-medium text-sm text-gray-900">{ws.profiles.full_name || 'Unknown'}</span>
                                                        <span className="text-xs text-gray-500">{ws.profiles.email}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-sm font-mono text-gray-400">{ws.user_id}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-gray-500">
                                            {ws.created_at ? format(new Date(ws.created_at), 'MMM d, yyyy') : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary" />
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
