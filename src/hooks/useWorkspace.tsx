import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Workspace {
  id: string;
  user_id: string;
  name: string;
  primary_color: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface WidgetSettings {
  id: string;
  workspace_id: string;
  dark_mode: boolean;
  layout: string;
  show_video_first: boolean;
  appearance?: any;
  space_filtering?: string[];
  display_limit?: number;
  ordering?: string;
}

export const useWorkspace = () => {
  const { user } = useAuth();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [widgetSettings, setWidgetSettings] = useState<WidgetSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWorkspace();
    } else {
      setWorkspace(null);
      setWidgetSettings(null);
      setLoading(false);
    }
  }, [user]);

  const fetchWorkspace = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setWorkspace(data);

      if (data) {
        const { data: settings } = await supabase
          .from("widget_settings")
          .select("*")
          .eq("workspace_id", data.id)
          .maybeSingle();

        setWidgetSettings(settings);
      }
    } catch (error) {
      console.error("Error fetching workspace:", error);
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async (name: string, primaryColor: string, logoUrl?: string) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const { data, error } = await supabase
        .from("workspaces")
        .insert({
          user_id: user.id,
          name,
          primary_color: primaryColor,
          logo_url: logoUrl || null,
        })
        .select()
        .single();

      if (error) throw error;
      setWorkspace(data);

      // Create default widget settings
      const { data: settings } = await supabase
        .from("widget_settings")
        .insert({
          workspace_id: data.id,
          dark_mode: false,
          layout: "grid",
          show_video_first: true,
        })
        .select()
        .single();

      setWidgetSettings(settings);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateWorkspace = async (updates: Partial<Workspace>) => {
    if (!workspace) return { error: new Error("No workspace") };

    try {
      const { data, error } = await supabase
        .from("workspaces")
        .update(updates)
        .eq("id", workspace.id)
        .select()
        .single();

      if (error) throw error;
      setWorkspace(data);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateWidgetSettings = async (updates: Partial<WidgetSettings>) => {
    if (!widgetSettings) return { error: new Error("No widget settings") };

    try {
      const { data, error } = await supabase
        .from("widget_settings")
        .update(updates)
        .eq("id", widgetSettings.id)
        .select()
        .single();

      if (error) throw error;
      setWidgetSettings(data);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const uploadLogo = async (file: File) => {
    if (!user) return { error: new Error("Not authenticated") };

    const fileExt = file.name.split(".").pop();

    try {
      // Get presigned URL from R2 upload edge function
      const { data, error: fnError } = await supabase.functions.invoke("r2-upload", {
        body: {
          folder: "logos",
          contentType: file.type,
          fileExt: fileExt,
        },
      });

      if (fnError) throw fnError;
      if (!data?.signedUrl || !data?.publicUrl) {
        throw new Error("Failed to get upload URL");
      }

      // Upload file directly to R2 using presigned URL
      const uploadRes = await fetch(data.signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error(`Upload failed: ${uploadRes.status}`);
      }

      return { url: data.publicUrl, error: null };
    } catch (error) {
      return { url: null, error };
    }
  };

  return {
    workspace,
    widgetSettings,
    loading,
    createWorkspace,
    updateWorkspace,
    updateWidgetSettings,
    uploadLogo,
    refetch: fetchWorkspace,
  };
};
