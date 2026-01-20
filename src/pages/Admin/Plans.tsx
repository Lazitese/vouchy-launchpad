
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Save, Undo } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Plan {
    id: string;
    name: string;
    testimonial_limit: number;
    active_spaces_limit: number;
    video_duration_seconds: number;
    ai_credits: number;
}

export default function AdminPlans() {
    const queryClient = useQueryClient();
    const [editingPlan, setEditingPlan] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Plan>>({});

    const { data: plans, isLoading } = useQuery({
        queryKey: ['admin-plans'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('plans')
                .select('*')
                .order('ai_credits', { ascending: true }); // loose ordering by size

            if (error) throw error;
            return data as Plan[];
        }
    });

    const updatePlan = useMutation({
        mutationFn: async (planId: string) => {
            if (!formData) return;
            const { error } = await supabase
                .from('plans')
                .update({
                    testimonial_limit: formData.testimonial_limit,
                    active_spaces_limit: formData.active_spaces_limit,
                    video_duration_seconds: formData.video_duration_seconds,
                    ai_credits: formData.ai_credits,
                })
                .eq('id', planId);

            if (error) throw error;
        },
        onSuccess: () => {
            toast.success("Plan limits updated");
            queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
            setEditingPlan(null);
            setFormData({});
        },
        onError: () => {
            toast.error("Failed to update plan");
        }
    });

    const startEditing = (plan: Plan) => {
        setEditingPlan(plan.id);
        setFormData(plan);
    };

    const cancelEditing = () => {
        setEditingPlan(null);
        setFormData({});
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Plan Configuration</h1>
                <p className="text-gray-500 mt-1">Manage the default limits for each plan tier. Users inheriting limits will be updated immediately.</p>
            </div>

            <Card>
                <CardContent className="p-0 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-[150px]">Plan Name</TableHead>
                                <TableHead>Testimonials</TableHead>
                                <TableHead>Active Spaces</TableHead>
                                <TableHead>Video Duration (s)</TableHead>
                                <TableHead>AI Credits</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {plans?.map((plan) => (
                                <TableRow key={plan.id}>
                                    <TableCell className="font-medium capitalize text-lg text-gray-900">
                                        {plan.name}
                                    </TableCell>

                                    {editingPlan === plan.id ? (
                                        <>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={formData.testimonial_limit}
                                                    onChange={(e) => setFormData({ ...formData, testimonial_limit: parseInt(e.target.value) || 0 })}
                                                    className="w-24"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={formData.active_spaces_limit}
                                                    onChange={(e) => setFormData({ ...formData, active_spaces_limit: parseInt(e.target.value) || 0 })}
                                                    className="w-24"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={formData.video_duration_seconds}
                                                    onChange={(e) => setFormData({ ...formData, video_duration_seconds: parseInt(e.target.value) || 0 })}
                                                    className="w-24"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={formData.ai_credits}
                                                    onChange={(e) => setFormData({ ...formData, ai_credits: parseInt(e.target.value) || 0 })}
                                                    className="w-24"
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" variant="ghost" onClick={cancelEditing}>
                                                        <Undo className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="sm" onClick={() => updatePlan.mutate(plan.id)}>
                                                        <Save className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell>{plan.testimonial_limit}</TableCell>
                                            <TableCell>{plan.active_spaces_limit}</TableCell>
                                            <TableCell>{plan.video_duration_seconds}s</TableCell>
                                            <TableCell>{plan.ai_credits}</TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="outline" onClick={() => startEditing(plan)}>
                                                    Edit
                                                </Button>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
