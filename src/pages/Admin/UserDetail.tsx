
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PLAN_FEATURES, PlanType } from "@/hooks/useUserPlan";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Trash2, Save, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";

export default function AdminUserDetail() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        plan: "",
        ai_credits_used: 0,
        override_testimonial_limit: "" as string | number,
        override_active_spaces_limit: "" as string | number,
        override_video_duration: "" as string | number,
        override_ai_credits: "" as string | number,
    });

    const { data: user, isLoading } = useQuery({
        queryKey: ['admin-user', userId],
        queryFn: async () => {
            if (!userId) throw new Error("No user ID");
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            setFormData({
                full_name: data.full_name || "",
                email: data.email || "",
                plan: data.plan || "free",
                ai_credits_used: data.ai_credits_used || 0,
                override_testimonial_limit: (data as any).override_testimonial_limit ?? "",
                override_active_spaces_limit: (data as any).override_active_spaces_limit ?? "",
                override_video_duration: (data as any).override_video_duration ?? "",
                override_ai_credits: (data as any).override_ai_credits ?? "",
            });
            return data;
        }
    });

    const { data: userWorkspaces } = useQuery({
        queryKey: ['admin-user-workspaces', userId],
        queryFn: async () => {
            if (!userId) return [];
            const { data, error } = await supabase
                .from('workspaces')
                .select('*')
                .eq('user_id', userId);

            if (error) throw error;
            return data;
        },
        enabled: !!userId
    });

    const updateProfile = useMutation({
        mutationFn: async () => {
            if (!userId) return;
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    plan: formData.plan,
                    ai_credits_used: formData.ai_credits_used,
                    override_testimonial_limit: formData.override_testimonial_limit === "" ? null : Number(formData.override_testimonial_limit),
                    override_active_spaces_limit: formData.override_active_spaces_limit === "" ? null : Number(formData.override_active_spaces_limit),
                    override_video_duration: formData.override_video_duration === "" ? null : Number(formData.override_video_duration),
                    override_ai_credits: formData.override_ai_credits === "" ? null : Number(formData.override_ai_credits),
                })
                .eq('id', userId);

            if (error) throw error;
        },
        onSuccess: () => {
            toast.success("User profile updated");
            queryClient.invalidateQueries({ queryKey: ['admin-user', userId] });
            setIsEditing(false);
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to update profile");
        }
    });

    const deleteUser = async () => {
        if (!userId) return;
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

        try {
            // Delete user logic (Note: Deleting from auth.users via client is restricted. 
            // Usually done via Edge Function for full cleanup. 
            // Here we might just delete profile/data if cascade is set, or mark as deleted.)

            // For now, let's try deleting profile primarily. 
            // Ideally, you'd use supabase.auth.admin.deleteUser() in a secure environment.

            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userId);

            if (error) throw error;

            toast.success("User data deleted");
            navigate("/admin/users");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete user. You may need to delete from Auth via Supabase Dashboard directly if client-side delete is restricted.");
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

    if (!user) {
        return (
            <AdminLayout>
                <div className="text-center py-12">User not found</div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-6">
                <Button variant="ghost" className="pl-0 hover:pl-2 transition-all" onClick={() => navigate("/admin/users")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Users
                </Button>
            </div>

            <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                        {user.avatar_url ? (
                            <img
                                src={user.avatar_url}
                                alt={user.full_name || ""}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-2xl font-semibold text-gray-400">
                                {(user.full_name?.[0] || user.email?.[0] || "?").toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{user.full_name || "Unnamed User"}</h1>
                        <p className="text-gray-500">{user.email}</p>
                        <div className="flex gap-2 mt-2">
                            <Badge variant="secondary" className="font-mono text-xs">{user.id}</Badge>
                            <Badge variant={user.plan === 'pro' ? 'default' : 'secondary'}>
                                {user.plan?.toUpperCase()}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)} variant="outline">
                            Edit Profile
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button onClick={() => updateProfile.mutate()} disabled={updateProfile.isPending}>
                                {updateProfile.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </>
                    )}
                    <Button variant="destructive" size="icon" onClick={deleteUser}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Profile Info */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input
                                        disabled={!isEditing}
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input disabled value={formData.email} />
                                    {/* Email usually managed by Auth, separate flow */}
                                </div>
                                <div className="space-y-2">
                                    <Label>Plan</Label>
                                    <Select
                                        disabled={!isEditing}
                                        value={formData.plan}
                                        onValueChange={(val) => setFormData({ ...formData, plan: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="free">Free</SelectItem>
                                            <SelectItem value="pro">Pro</SelectItem>
                                            <SelectItem value="agency">Agency</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>AI Credits Used</Label>
                                    <Input
                                        type="number"
                                        disabled={!isEditing}
                                        value={formData.ai_credits_used}
                                        onChange={(e) => setFormData({ ...formData, ai_credits_used: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Limit Overrides</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-500 mb-4">
                                Set specific limits for this user. Leave empty to inherit defaults from the <strong>{formData.plan.toUpperCase()}</strong> plan.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Max Testimonials</Label>
                                    <Input
                                        type="number"
                                        placeholder={`Inherit (${PLAN_FEATURES[(formData.plan as PlanType) || 'free'].testimonialLimit})`}
                                        disabled={!isEditing}
                                        value={formData.override_testimonial_limit}
                                        onChange={(e) => setFormData({ ...formData, override_testimonial_limit: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Max Active Spaces</Label>
                                    <Input
                                        type="number"
                                        placeholder={`Inherit (${PLAN_FEATURES[(formData.plan as PlanType) || 'free'].activeSpacesLimit})`}
                                        disabled={!isEditing}
                                        value={formData.override_active_spaces_limit}
                                        onChange={(e) => setFormData({ ...formData, override_active_spaces_limit: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Video Duration (sec)</Label>
                                    <Input
                                        type="number"
                                        placeholder={`Inherit (${PLAN_FEATURES[(formData.plan as PlanType) || 'free'].videoDurationSeconds}s)`}
                                        disabled={!isEditing}
                                        value={formData.override_video_duration}
                                        onChange={(e) => setFormData({ ...formData, override_video_duration: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Max AI Credits</Label>
                                    <Input
                                        type="number"
                                        placeholder={`Inherit (${PLAN_FEATURES[(formData.plan as PlanType) || 'free'].aiCredits})`}
                                        disabled={!isEditing}
                                        value={formData.override_ai_credits}
                                        onChange={(e) => setFormData({ ...formData, override_ai_credits: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Workspaces ({userWorkspaces?.length || 0})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {userWorkspaces && userWorkspaces.length > 0 ? (
                                <div className="space-y-2">
                                    {userWorkspaces.map(ws => (
                                        <div key={ws.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-300 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center font-bold text-xs" style={{ color: ws.primary_color }}>
                                                    {ws.name[0]}
                                                </div>
                                                <span className="font-medium text-gray-700">{ws.name}</span>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/workspaces/${ws.id}`)}>
                                                <ExternalLink className="w-4 h-4 text-gray-400" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">No workspaces found.</p>
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
                                <span className="text-gray-500">Joined</span>
                                <span className="font-medium">{format(new Date(user.created_at), 'PPP')}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Last Updated</span>
                                <span className="font-medium">{format(new Date(user.updated_at), 'PPP')}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Credits Reset</span>
                                <span className="font-medium">{user.ai_credits_reset_at ? format(new Date(user.ai_credits_reset_at), 'PPP') : 'Never'}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
