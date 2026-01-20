
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Trash2, Save } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";

export default function AdminWorkspaceDetail() {
    const { workspaceId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        primary_color: "",
    });

    const { data: workspace, isLoading } = useQuery({
        queryKey: ['admin-workspace', workspaceId],
        queryFn: async () => {
            if (!workspaceId) throw new Error("No workspace ID");
            const { data, error } = await supabase
                .from('workspaces')
                .select('*')
                .eq('id', workspaceId)
                .single();

            if (error) throw error;
            setFormData({
                name: data.name || "",
                primary_color: data.primary_color || ""
            });
            return data;
        }
    });

    const { data: profiles } = useQuery({
        queryKey: ['admin-workspace-owner', workspace?.user_id],
        queryFn: async () => {
            if (!workspace?.user_id) return null;
            const { data } = await supabase.from('profiles').select('*').eq('id', workspace.user_id).single();
            return data;
        },
        enabled: !!workspace?.user_id
    });

    const updateWorkspace = useMutation({
        mutationFn: async () => {
            if (!workspaceId) return;
            const { error } = await supabase
                .from('workspaces')
                .update({
                    name: formData.name,
                    primary_color: formData.primary_color
                })
                .eq('id', workspaceId);

            if (error) throw error;
        },
        onSuccess: () => {
            toast.success("Workspace updated");
            queryClient.invalidateQueries({ queryKey: ['admin-workspace', workspaceId] });
            setIsEditing(false);
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to update workspace");
        }
    });

    const deleteWorkspace = async () => {
        if (!workspaceId) return;
        if (!confirm("Are you sure you want to delete this workspace? This action cannot be undone and will delete all associated data.")) return;

        try {
            const { error } = await supabase
                .from('workspaces')
                .delete()
                .eq('id', workspaceId);

            if (error) throw error;

            toast.success("Workspace deleted");
            navigate("/admin/workspaces");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete workspace");
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                </div>
            </AdminLayout>
        );
    }

    if (!workspace) {
        return (
            <AdminLayout>
                <div className="text-center py-12">Workspace not found</div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-6">
                <Button variant="ghost" className="pl-0 hover:pl-2 transition-all" onClick={() => navigate("/admin/workspaces")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Workspaces
                </Button>
            </div>

            <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                    <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl text-white shadow-lg"
                        style={{ backgroundColor: workspace.primary_color || '#666' }}
                    >
                        {workspace.name?.[0].toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{workspace.name || "Unnamed Workspace"}</h1>
                        <p className="text-gray-500">ID: {workspace.id}</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)} variant="outline">
                            Edit Workspace
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button onClick={() => updateWorkspace.mutate()} disabled={updateWorkspace.isPending}>
                                {updateWorkspace.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </>
                    )}
                    <Button variant="destructive" size="icon" onClick={deleteWorkspace}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Workspace Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Workspace Name</Label>
                                    <Input
                                        disabled={!isEditing}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Brand Color (Hex)</Label>
                                    <div className="flex gap-2">
                                        <div className="w-10 h-10 rounded border" style={{ backgroundColor: formData.primary_color }} />
                                        <Input
                                            disabled={!isEditing}
                                            value={formData.primary_color}
                                            onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Owner Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {profiles ? (
                                <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                                    <div className="flex flex-col">
                                        <span className="font-bold">{profiles.full_name}</span>
                                        <span className="text-sm text-gray-500">{profiles.email}</span>
                                    </div>
                                    <div className="ml-auto">
                                        <Button variant="outline" size="sm" onClick={() => navigate(`/admin/users/${profiles.id}`)}>
                                            View Profile
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">Owner ID: {workspace.user_id} (Profile not found)</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-gray-500">Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Created At</span>
                                <span className="font-medium">{format(new Date(workspace.created_at), 'PPP')}</span>
                            </div>
                            {workspace.updated_at && (
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-gray-500">Last Updated</span>
                                    <span className="font-medium">{format(new Date(workspace.updated_at), 'PPP')}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
