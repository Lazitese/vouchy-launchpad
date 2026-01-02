import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Testimonial {
  id: string;
  space_id: string;
  type: "video" | "text";
  content: string | null;
  video_url: string | null;
  author_name: string;
  author_email: string | null;
  author_title: string | null;
  author_company: string | null;
  author_avatar_url: string | null;
  rating: number | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export const useTestimonials = (spaceIds: string[]) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (spaceIds.length > 0) {
      fetchTestimonials();
    } else {
      setTestimonials([]);
      setLoading(false);
    }
  }, [spaceIds.join(",")]);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .in("space_id", spaceIds)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTestimonials((data as Testimonial[]) || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      setTestimonials(testimonials.map(t => 
        t.id === id ? { ...t, status } : t
      ));
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setTestimonials(testimonials.filter(t => t.id !== id));
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return {
    testimonials,
    loading,
    updateStatus,
    deleteTestimonial,
    refetch: fetchTestimonials,
  };
};

// Hook to submit a testimonial (public)
export const useSubmitTestimonial = () => {
  const [loading, setLoading] = useState(false);

  const submitTextTestimonial = async (data: {
    spaceId: string;
    name: string;
    email: string;
    company?: string;
    content: string;
    rating: number;
  }) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("testimonials")
        .insert({
          space_id: data.spaceId,
          type: "text",
          content: data.content,
          author_name: data.name,
          author_email: data.email,
          author_company: data.company || null,
          rating: data.rating,
          status: "pending",
        });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const submitVideoTestimonial = async (data: {
    spaceId: string;
    name: string;
    email: string;
    company?: string;
    videoBlob: Blob;
  }) => {
    setLoading(true);
    try {
      // Upload video to storage
      const fileName = `${data.spaceId}/${Date.now()}.webm`;
      const { error: uploadError } = await supabase.storage
        .from("testimonials")
        .upload(fileName, data.videoBlob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("testimonials")
        .getPublicUrl(fileName);

      // Create testimonial record
      const { error } = await supabase
        .from("testimonials")
        .insert({
          space_id: data.spaceId,
          type: "video",
          video_url: publicUrl,
          author_name: data.name,
          author_email: data.email,
          author_company: data.company || null,
          status: "pending",
        });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submitTextTestimonial,
    submitVideoTestimonial,
  };
};
