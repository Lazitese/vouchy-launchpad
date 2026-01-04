import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type PlanType = "free" | "pro" | "agency";

export interface UserPlan {
  plan: PlanType;
  testimonialLimit: number;
  activeSpacesLimit: number;
  videoDurationSeconds: number;
  aiCredits: number;
  hasTeleprompter: boolean;
  hasCustomBranding: boolean;
  hasWhiteLabel: boolean;
}

const PLAN_FEATURES: Record<PlanType, UserPlan> = {
  free: {
    plan: "free",
    testimonialLimit: 5,
    activeSpacesLimit: 1,
    videoDurationSeconds: 60,
    aiCredits: 0,
    hasTeleprompter: false,
    hasCustomBranding: false,
    hasWhiteLabel: false,
  },
  pro: {
    plan: "pro",
    testimonialLimit: 50,
    activeSpacesLimit: 3,
    videoDurationSeconds: 180, // 3 minutes
    aiCredits: 20,
    hasTeleprompter: true,
    hasCustomBranding: true,
    hasWhiteLabel: false,
  },
  agency: {
    plan: "agency",
    testimonialLimit: 250,
    activeSpacesLimit: 15,
    videoDurationSeconds: 300, // 5 minutes
    aiCredits: 100,
    hasTeleprompter: true,
    hasCustomBranding: true,
    hasWhiteLabel: true,
  },
};

export const useUserPlan = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<PlanType>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPlan();
    } else {
      setPlan("free");
      setLoading(false);
    }
  }, [user?.id]);

  const fetchPlan = async () => {
    if (!user) return;

    try {
      // Check profiles table for plan info - cast to any to handle type sync delay
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;
      
      // Default to free if no plan found
      const userPlan = ((data as any)?.plan as PlanType) || "free";
      setPlan(userPlan);
    } catch (error) {
      console.error("Error fetching user plan:", error);
      setPlan("free");
    } finally {
      setLoading(false);
    }
  };

  const features = PLAN_FEATURES[plan];

  const canUseAI = plan === "pro" || plan === "agency";
  const canUseTeleprompter = plan === "pro" || plan === "agency";
  const canUseTextMagic = plan === "pro" || plan === "agency";
  const canUseVideoSummary = plan === "agency"; // Full AI Suite only

  return {
    plan,
    features,
    loading,
    canUseAI,
    canUseTeleprompter,
    canUseTextMagic,
    canUseVideoSummary,
    isPro: plan === "pro" || plan === "agency",
    isAgency: plan === "agency",
    refetch: fetchPlan,
  };
};

// Hook to use AI features - public collection pages can pass spaceId to check owner's plan
export const useAIFeatures = () => {
  const [loading, setLoading] = useState(false);

  const generateScript = async (keywords: string, questions: string[]): Promise<string | null> => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-features`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            action: 'generate-script',
            data: { keywords, questions },
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to generate script');
      const data = await response.json();
      return data.script;
    } catch (error) {
      console.error('Error generating script:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const enhanceText = async (text: string, mode: 'shorten' | 'simplify' | 'translate'): Promise<string | null> => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-features`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            action: 'enhance-text',
            data: { text, mode },
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to enhance text');
      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Error enhancing text:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const summarizeVideo = async (transcript: string, authorName: string): Promise<{ summary: string; goldenQuote: string } | null> => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-features`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            action: 'summarize-video',
            data: { transcript, authorName },
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to summarize video');
      return await response.json();
    } catch (error) {
      console.error('Error summarizing video:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    generateScript,
    enhanceText,
    summarizeVideo,
  };
};
