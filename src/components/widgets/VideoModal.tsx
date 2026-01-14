import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Play } from "lucide-react";
import { useState } from "react";

interface VideoModalProps {
    videoUrl: string;
    isOpen: boolean;
    onClose: () => void;
}

export const VideoModal = ({ videoUrl, isOpen, onClose }: VideoModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-black border-none aspect-video">
                <video
                    src={videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                />
            </DialogContent>
        </Dialog>
    );
};
