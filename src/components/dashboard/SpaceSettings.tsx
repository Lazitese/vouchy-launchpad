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
        <div className="mb-8 p-6 bg-white/40 backdrop-blur-md border border-zinc-200/50 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Your Spaces</h3>
            <div className="flex flex-wrap gap-3">
                {spaces.map((space) => (
                    <div
                        key={space.id}
                        className="px-4 py-2.5 bg-white border border-zinc-200 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow group"
                    >
                        <span className="font-semibold text-zinc-900">{space.name}</span>
                        <div className="w-px h-4 bg-zinc-200" />
                        <button
                            onClick={() => onCopyLink(space.slug)}
                            className="p-1 hover:bg-zinc-100 rounded-md transition-colors text-zinc-400 hover:text-zinc-900"
                            title="Copy link"
                        >
                            <Link2 className="w-4 h-4" strokeWidth={2} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
