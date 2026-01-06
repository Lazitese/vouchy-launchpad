import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";

interface Space {
    id: string;
    name: string;
    slug: string;
}

interface SpaceSettingsProps {
    spaces: Space[];
    onCopyLink: (slug: string) => void;
}

export const SpaceSettings = ({ spaces, onCopyLink }: SpaceSettingsProps) => {
    if (spaces.length === 0) {
        return null;
    }

    return (
        <div className="mb-8">
            <h3 className="text-sm font-medium text-subtext mb-3">Your Spaces</h3>
            <div className="flex flex-wrap gap-2">
                {spaces.map((space) => (
                    <div
                        key={space.id}
                        className="px-4 py-2 bg-card border border-border/[0.08] rounded-lg flex items-center gap-3"
                    >
                        <span className="font-medium text-foreground">{space.name}</span>
                        <button
                            onClick={() => onCopyLink(space.slug)}
                            className="p-1 hover:bg-slate rounded transition-colors"
                            title="Copy link"
                        >
                            <Link2 className="w-3 h-3 text-subtext" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
