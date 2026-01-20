
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminSettings() {
    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Settings</h1>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Platform Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-500">
                            Manage global settings for the Vouchy platform.
                        </p>
                        <div className="flex gap-4">
                            <Button variant="outline" disabled>Maintenance Mode</Button>
                            <Button variant="outline" disabled>Global Announcement</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Admin Access</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500 mb-4">
                            Current Admin: <span className="font-semibold">You</span>
                        </p>
                        <Button variant="secondary" disabled>Manage Admin Roles</Button>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
