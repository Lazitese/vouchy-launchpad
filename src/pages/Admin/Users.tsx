import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Loader2, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsers() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: users, isLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        }
    });

    const deleteUser = useMutation({
        mutationFn: async (userId: string) => {
            const { error } = await supabase.from('profiles').delete().eq('id', userId);
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success("User deleted successfully");
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        },
        onError: (error) => {
            console.error("Delete error:", error);
            toast.error("Failed to delete user");
        }
    });

    const handleDelete = (e: React.MouseEvent, userId: string) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            deleteUser.mutate(userId);
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
                    <p className="text-gray-500 mt-1">Manage all registered users</p>
                </div>
                <Badge variant="outline" className="text-lg py-1 px-4 border-primary/20 bg-primary/5 text-primary">
                    Total: {users?.length || 0}
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
                                    <TableHead className="w-[300px] min-w-[300px]">User Profile</TableHead>
                                    <TableHead className="min-w-[200px]">Email</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead className="text-right min-w-[100px]">Credits Used</TableHead>
                                    <TableHead className="text-right min-w-[150px]">Joined Date</TableHead>
                                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users?.map((user) => (
                                    <TableRow
                                        key={user.id}
                                        className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                                        onClick={() => navigate(`/admin/users/${user.id}`)}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                                    {user.avatar_url ? (
                                                        <img
                                                            src={user.avatar_url}
                                                            alt={user.full_name || ""}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-semibold text-gray-500">
                                                            {(user.full_name?.[0] || user.email?.[0] || "?").toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900 group-hover:text-primary transition-colors">{user.full_name || "N/A"}</span>
                                                    <span className="text-xs text-gray-500 truncate max-w-[150px]">{user.id}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-600">{user.email}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className={
                                                    user.plan === 'pro'
                                                        ? "bg-purple-100 text-purple-700 hover:bg-purple-100"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                                                }
                                            >
                                                {(user.plan || "free").toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-gray-900">{user.ai_credits_used}</TableCell>
                                        <TableCell className="text-right text-gray-500">
                                            {user.created_at ? format(new Date(user.created_at), 'MMM d, yyyy') : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={(e) => handleDelete(e, user.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                                            </div>
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
