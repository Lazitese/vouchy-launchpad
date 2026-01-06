import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseRecorderOptions {
    onRecordingComplete?: (blob: Blob) => void;
}

export const useRecorder = (options?: UseRecorderOptions) => {
    const { toast } = useToast();

    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [cameraEnabled, setCameraEnabled] = useState(true);
    const [micEnabled, setMicEnabled] = useState(true);
    const [isCountdownActive, setIsCountdownActive] = useState(false);
    const [countDown, setCountDown] = useState(3);

    // Initialize camera
    const initCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            toast({
                variant: "destructive",
                title: "Camera access denied",
                description: "Please allow camera access to record a video testimonial.",
            });
        }
    };

    // Toggle camera
    const toggleCamera = () => {
        if (stream) {
            stream.getVideoTracks().forEach(track => {
                track.enabled = !cameraEnabled;
            });
            setCameraEnabled(!cameraEnabled);
        }
    };

    // Toggle microphone
    const toggleMic = () => {
        if (stream) {
            stream.getAudioTracks().forEach(track => {
                track.enabled = !micEnabled;
            });
            setMicEnabled(!micEnabled);
        }
    };

    // Start recording with countdown
    const startTeleprompterSession = () => {
        if (!stream) return;
        setIsCountdownActive(true);
        setCountDown(3);

        const timer = setInterval(() => {
            setCountDown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsCountdownActive(false);
                    startRecording();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Start recording
    const startRecording = () => {
        if (!stream) return;

        chunksRef.current = [];
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunksRef.current.push(e.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: "video/webm" });
            setRecordedBlob(blob);
            options?.onRecordingComplete?.(blob);
        };

        mediaRecorder.start();
        setIsRecording(true);
    };

    // Stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            // Clear the live stream from video element so recorded blob can be shown
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        }
    };

    // Retake recording
    const retakeRecording = () => {
        setRecordedBlob(null);
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    return {
        // Refs
        videoRef,

        // State
        isRecording,
        recordedBlob,
        stream,
        cameraEnabled,
        micEnabled,
        isCountdownActive,
        countDown,
        setRecordedBlob,

        // Methods
        initCamera,
        toggleCamera,
        toggleMic,
        startRecording,
        stopRecording,
        retakeRecording,
        startTeleprompterSession,
    };
};
