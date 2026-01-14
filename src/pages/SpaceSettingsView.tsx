
import { useState, useEffect } from "react";
import { ArrowLeft, Trash2, Link as LinkIcon, Save, Settings, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface SpaceSettingsViewProps {
    spaceId: string | null;
    spaces: any[];
    updateSpace: (id: string, updates: any) => Promise<any>;
    deleteSpace: (id: string) => Promise<any>;
    onBack: () => void;
}

export const SpaceSettingsView = ({
    spaceId,
    spaces,
    updateSpace,
    deleteSpace,
    onBack
}: SpaceSettingsViewProps) => {
    const { toast } = useToast();
    const [space, setSpace] = useState<any>(null);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [loading, setLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        if (spaceId && spaces.length > 0) {
            const foundSpace = spaces.find(s => s.id === spaceId);
            if (foundSpace) {
                setSpace(foundSpace);
                setName(foundSpace.name);
                setSlug(foundSpace.slug);
            }
        }
    }, [spaceId, spaces]);

    const handleSave = async () => {
        if (!space) return;
        setLoading(true);

        const { error } = await updateSpace(space.id, { name, slug }); // Note: changing slug might break links, but user should know

        setLoading(false);
        if (error) {
            toast({
                variant: "destructive",
                title: "Error updating space",
                description: "Could not save changes.",
            });
        } else {
            toast({
                title: "Space updated",
                description: "Your changes have been saved.",
            });
        }
    };

    const handleDelete = async () => {
        if (!space) return;

        const { error } = await deleteSpace(space.id);

        if (error) {
            toast({
                variant: "destructive",
                title: "Error deleting space",
                description: "Something went wrong.",
            });
        } else {
            toast({
                title: "Space deleted",
                description: "The space has been removed.",
            });
            onBack();
        }
    };

    const copyLink = () => {
        if (!space) return;
        const url = `${window.location.origin}/collect/${space.slug}`;
        navigator.clipboard.writeText(url);
        toast({ title: "Link copied" });
    };

    if (!space) return null;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <button
                onClick={onBack}
                className="flex items-center text-gray-400 hover:text-black mb-8 transition-colors text-sm font-medium"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </button>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-black">{space.name}</h1>
                    <p className="text-gray-500 mt-1">Manage your collection space settings</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={copyLink} className="rounded-full">
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Copy Link
                    </Button>
                </div>
            </div>

            <div className="grid gap-8">
                {/* General Settings */}
                <div className="organic-card p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <Settings className="w-5 h-5 text-gray-600" />
                        </div>
                        <h2 className="text-xl font-bold text-black">General Settings</h2>
                    </div>

                    <div className="space-y-6 max-w-xl">
                        <div className="space-y-2">
                            <Label>Space Name</Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-gray-50 border-gray-200"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>URL Slug</Label>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 text-sm">{window.location.origin}/collect/</span>
                                <Input
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="bg-gray-50 border-gray-200"
                                />
                            </div>
                            <p className="text-xs text-gray-400">Changing this will invalidate existing links.</p>
                        </div>

                        <div className="pt-4">
                            <Button
                                onClick={handleSave}
                                disabled={loading}
                                className="bg-black text-white hover:bg-gray-800 rounded-full px-8"
                            >
                                {loading && <Save className="w-4 h-4 mr-2 animate-spin" />}
                                {!loading && <Save className="w-4 h-4 mr-2" />}
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Video Settings (Placeholder) */}
                <div className="organic-card p-8 opacity-60 pointer-events-none relative">
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Coming Soon</span>
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <Video className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-black">Video Settings</h2>
                    </div>
                    <p className="text-gray-500">Configure video duration limits and quality settings.</p>
                </div>

                {/* Danger Zone */}
                <div className="organic-card p-8 border border-red-100 bg-red-50/10">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Danger Zone</h2>
                    <p className="text-gray-500 mb-6 text-sm">Once you delete a space, there is no going back. Please be certain.</p>

                    {!confirmDelete ? (
                        <Button
                            variant="destructive"
                            onClick={() => setConfirmDelete(true)}
                            className="bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 rounded-full"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Space
                        </Button>
                    ) : (
                        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4">
                            <p className="text-sm font-bold text-red-600">Are you sure?</p>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 rounded-full"
                            >
                                Yes, delete specifically
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setConfirmDelete(false)}
                                className="text-gray-500 hover:text-black rounded-full"
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
