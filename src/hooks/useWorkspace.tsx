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
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("logos")
        .getPublicUrl(fileName);

      return { url: publicUrl, error: null };
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
