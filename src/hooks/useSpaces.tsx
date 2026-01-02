import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "./useWorkspace";
import { Json } from "@/integrations/supabase/types";

export interface Space {
  id: string;
  workspace_id: string;
  name: string;
  slug: string;
  is_active: boolean;
  questions: string[];
  created_at: string;
  updated_at: string;
}

const parseQuestions = (questions: Json): string[] => {
  if (Array.isArray(questions)) {
    return questions.filter((q): q is string => typeof q === "string");
  }
  return [];
};

export const useSpaces = () => {
  const { workspace } = useWorkspace();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (workspace) {
      fetchSpaces();
    } else {
      setSpaces([]);
      setLoading(false);
    }
  }, [workspace]);

  const fetchSpaces = async () => {
    if (!workspace) return;

    try {
      const { data, error } = await supabase
        .from("spaces")
        .select("*")
        .eq("workspace_id", workspace.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSpaces((data || []).map(s => ({
        ...s,
        questions: parseQuestions(s.questions),
      })));
    } catch (error) {
      console.error("Error fetching spaces:", error);
    } finally {
      setLoading(false);
    }
  };

  const createSpace = async (name: string) => {
    if (!workspace) return { error: new Error("No workspace") };

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + 
      "-" + Date.now().toString(36);

    try {
      const { data, error } = await supabase
        .from("spaces")
        .insert({
          workspace_id: workspace.id,
          name,
          slug,
          is_active: true,
          questions: [
            "What problem were you trying to solve?",
            "How has our product helped you?",
            "What results have you seen?",
            "Would you recommend us to others?"
          ],
        })
        .select()
        .single();

      if (error) throw error;
      const parsedData = { ...data, questions: parseQuestions(data.questions) };
      setSpaces([parsedData, ...spaces]);
      return { data: parsedData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateSpace = async (id: string, updates: Partial<Space>) => {
    try {
      const { data, error } = await supabase
        .from("spaces")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      const parsedData = { ...data, questions: parseQuestions(data.questions) };
      setSpaces(spaces.map(s => s.id === id ? parsedData : s));
      return { data: parsedData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const deleteSpace = async (id: string) => {
    try {
      const { error } = await supabase
        .from("spaces")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setSpaces(spaces.filter(s => s.id !== id));
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return {
    spaces,
    loading,
    createSpace,
    updateSpace,
    deleteSpace,
    refetch: fetchSpaces,
  };
};

// Hook to get a space by slug (for public collection page)
export const useSpaceBySlug = (slug: string | undefined) => {
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (slug) {
      fetchSpace();
    }
  }, [slug]);

  const fetchSpace = async () => {
    if (!slug) return;

    try {
      const { data, error } = await supabase
        .from("spaces")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      setSpace(data ? { ...data, questions: parseQuestions(data.questions) } : null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { space, loading, error };
};
