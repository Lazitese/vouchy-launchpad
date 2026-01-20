export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_usage_logs: {
        Row: {
          action: string
          created_at: string | null
          credits: number
          id: string
          space_id: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          credits?: number
          id?: string
          space_id?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          credits?: number
          id?: string
          space_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_usage_logs_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_usage_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          active_spaces_limit: number
          ai_credits: number
          created_at: string
          id: string
          name: string
          testimonial_limit: number
          updated_at: string
          video_duration_seconds: number
        }
        Insert: {
          active_spaces_limit: number
          ai_credits: number
          created_at?: string
          id: string
          name: string
          testimonial_limit: number
          updated_at?: string
          video_duration_seconds: number
        }
        Update: {
          active_spaces_limit?: number
          ai_credits?: number
          created_at?: string
          id?: string
          name?: string
          testimonial_limit?: number
          updated_at?: string
          video_duration_seconds?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ai_credits_reset_at: string | null
          ai_credits_used: number
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          override_active_spaces_limit: number | null
          override_ai_credits: number | null
          override_testimonial_limit: number | null
          override_video_duration: number | null
          plan: string | null
          updated_at: string | null
        }
        Insert: {
          ai_credits_reset_at?: string | null
          ai_credits_used?: number
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          override_active_spaces_limit?: number | null
          override_ai_credits?: number | null
          override_testimonial_limit?: number | null
          override_video_duration?: number | null
          plan?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_credits_reset_at?: string | null
          ai_credits_used?: number
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          override_active_spaces_limit?: number | null
          override_ai_credits?: number | null
          override_testimonial_limit?: number | null
          override_video_duration?: number | null
          plan?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      spaces: {
        Row: {
          appearance: Json | null
          created_at: string
          dark_mode: boolean | null
          display_limit: number | null
          id: string
          layout: string | null
          ordering: string | null
          show_video_first: boolean | null
          space_filtering: Json | null
          updated_at: string | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          appearance?: Json | null
          created_at?: string
          dark_mode?: boolean | null
          display_limit?: number | null
          id?: string
          layout?: string | null
          ordering?: string | null
          show_video_first?: boolean | null
          space_filtering?: Json | null
          updated_at?: string | null
          user_id: string
          workspace_id: string
        }
        Update: {
          appearance?: Json | null
          created_at?: string
          dark_mode?: boolean | null
          display_limit?: number | null
          id?: string
          layout?: string | null
          ordering?: string | null
          show_video_first?: boolean | null
          space_filtering?: Json | null
          updated_at?: string | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spaces_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          company: string | null
          content: string | null
          created_at: string
          email: string
          id: string
          is_favorite: boolean | null
          name: string
          rating: number
          space_id: string | null
          status: Database["public"]["Enums"]["testimonial_status"]
          title: string | null
          type: Database["public"]["Enums"]["testimonial_type"]
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          content?: string | null
          created_at?: string
          email: string
          id?: string
          is_favorite?: boolean | null
          name: string
          rating?: number
          space_id?: string | null
          status?: Database["public"]["Enums"]["testimonial_status"]
          title?: string | null
          type?: Database["public"]["Enums"]["testimonial_type"]
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          content?: string | null
          created_at?: string
          email?: string
          id?: string
          is_favorite?: boolean | null
          name?: string
          rating?: number
          space_id?: string | null
          status?: Database["public"]["Enums"]["testimonial_status"]
          title?: string | null
          type?: Database["public"]["Enums"]["testimonial_type"]
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Relationships: []
      }
      widget_settings: {
        Row: {
          background_color: string | null
          card_background: string | null
          created_at: string | null
          id: string
          space_id: string | null
          text_color: string | null
          updated_at: string | null
        }
        Insert: {
          background_color?: string | null
          card_background?: string | null
          created_at?: string | null
          id?: string
          space_id?: string | null
          text_color?: string | null
          updated_at?: string | null
        }
        Update: {
          background_color?: string | null
          card_background?: string | null
          created_at?: string | null
          id?: string
          space_id?: string | null
          text_color?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "widget_settings_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          allow_white_label: boolean | null
          created_at: string
          id: string
          logo_url: string | null
          name: string
          plan: string | null
          primary_color: string | null
          slug: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allow_white_label?: boolean | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          plan?: string | null
          primary_color?: string | null
          slug?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allow_white_label?: boolean | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          plan?: string | null
          primary_color?: string | null
          slug?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      testimonial_status: "pending" | "approved" | "rejected"
      testimonial_type: "video" | "text"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
