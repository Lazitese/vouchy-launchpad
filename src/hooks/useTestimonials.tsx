import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type Testimonial = Tables<"testimonials">;

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
      setTestimonials(data || []);
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

  const uploadToSignedUrl = async (signedUrl: string, file: Blob, contentType: string) => {
    const res = await fetch(signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
      },
      body: file,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`Upload failed: ${res.status} ${errText}`);
    }
  };

  const getSignedUpload = async (params: {
    spaceId: string;
    kind: "video" | "avatar";
    contentType: string;
    fileExt?: string;
  }): Promise<{ signedUrl: string; publicUrl: string }> => {
    const { data, error } = await supabase.functions.invoke("signed-upload", {
      body: {
        spaceId: params.spaceId,
        kind: params.kind,
        contentType: params.contentType,
        fileExt: params.fileExt,
      },
    });

    if (error) throw error;
    if (!data?.signedUrl || !data?.publicUrl) {
      throw new Error("Signed upload response missing fields");
    }

    return { signedUrl: data.signedUrl as string, publicUrl: data.publicUrl as string };
  };

  const uploadAvatar = async (spaceId: string, file: File): Promise<string | null> => {
    try {
      if (file.size > 2 * 1024 * 1024) {
        throw new Error("Avatar must be <= 2MB");
      }

      const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      if (!allowed.includes(file.type)) {
        throw new Error("Unsupported avatar type");
      }

      const fileExt = (file.name.split(".").pop() || "png").toLowerCase();
      const { signedUrl, publicUrl } = await getSignedUpload({
        spaceId,
        kind: "avatar",
        contentType: file.type,
        fileExt,
      });

      await uploadToSignedUrl(signedUrl, file, file.type);
      return publicUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      return null;
    }
  };

  const submitTextTestimonial = async (data: {
    spaceId: string;
    name: string;
    email: string;
    company?: string;
    title?: string;
    content: string;
    rating: number;
    avatarFile?: File;
  }) => {
    setLoading(true);
    try {
      let avatarUrl: string | null = null;

      if (data.avatarFile) {
        avatarUrl = await uploadAvatar(data.spaceId, data.avatarFile);
      }

      const { error } = await supabase
        .from("testimonials")
        .insert({
          space_id: data.spaceId,
          type: "text",
          content: data.content,
          name: data.name,
          email: data.email,
          company: data.company || null,
          title: data.title || null,
          avatar_url: avatarUrl,
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
    title?: string;
    content?: string;
    videoBlob: Blob;
    rating: number;
  }) => {
    setLoading(true);
    try {
      const contentType = (data.videoBlob.type || "video/webm").toLowerCase();
      if (contentType !== "video/webm") {
        throw new Error("Unsupported video type (only video/webm is allowed)");
      }

      if (data.videoBlob.size > 25 * 1024 * 1024) {
        throw new Error("Video must be <= 25MB");
      }

      const { signedUrl, publicUrl } = await getSignedUpload({
        spaceId: data.spaceId,
        kind: "video",
        contentType,
        fileExt: "webm",
      });

      await uploadToSignedUrl(signedUrl, data.videoBlob, contentType);

      // Create testimonial record
      const { error } = await supabase
        .from("testimonials")
        .insert({
          space_id: data.spaceId,
          type: "video",
          video_url: publicUrl,
          content: data.content || null,
          name: data.name,
          email: data.email,
          company: data.company || null,
          title: data.title || null,
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

  return {
    loading,
    submitTextTestimonial,
    submitVideoTestimonial,
  };
};
