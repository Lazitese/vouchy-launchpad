export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      profiles: {
        Row: {
          ai_credits_reset_at: string | null
          ai_credits_used: number | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          plan: string | null
          updated_at: string | null
        }
        Insert: {
          ai_credits_reset_at?: string | null
          ai_credits_used?: number | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          plan?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_credits_reset_at?: string | null
          ai_credits_used?: number | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          plan?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      workspaces: {
        Row: {
          id: string
          user_id: string
          name: string
          logo_url: string | null
          primary_color: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          logo_url?: string | null
          primary_color?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          logo_url?: string | null
          primary_color?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      spaces: {
        Row: {
          id: string
          workspace_id: string
          name: string
          slug: string
          questions: Json | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          slug: string
          questions?: Json | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          slug?: string
          questions?: Json | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spaces_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
      testimonials: {
        Row: {
          id: string
          space_id: string
          type: Database["public"]["Enums"]["testimonial_type"]
          status: Database["public"]["Enums"]["testimonial_status"] | null
          name: string
          email: string | null
          title: string | null
          company: string | null
          avatar_url: string | null
          content: string | null
          video_url: string | null
          rating: number
          ai_summary: string | null
          golden_quote: string | null
          is_favorite: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          space_id: string
          type: Database["public"]["Enums"]["testimonial_type"]
          status?: Database["public"]["Enums"]["testimonial_status"] | null
          name: string
          email?: string | null
          title?: string | null
          company?: string | null
          avatar_url?: string | null
          content?: string | null
          video_url?: string | null
          rating: number
          ai_summary?: string | null
          golden_quote?: string | null
          is_favorite?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          space_id?: string
          type?: Database["public"]["Enums"]["testimonial_type"]
          status?: Database["public"]["Enums"]["testimonial_status"] | null
          name?: string
          email?: string | null
          title?: string | null
          company?: string | null
          avatar_url?: string | null
          content?: string | null
          video_url?: string | null
          rating?: number
          ai_summary?: string | null
          golden_quote?: string | null
          is_favorite?: boolean | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          }
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      widget_settings: {
        Row: {
          id: string
          workspace_id: string
          layout: string | null
          dark_mode: boolean | null
          show_video_first: boolean | null
          appearance: Json | null
          space_filtering: Json | null
          display_limit: number | null
          ordering: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          workspace_id: string
          layout?: string | null
          dark_mode?: boolean | null
          show_video_first?: boolean | null
          appearance?: Json | null
          space_filtering?: Json | null
          display_limit?: number | null
          ordering?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          workspace_id?: string
          layout?: string | null
          dark_mode?: boolean | null
          show_video_first?: boolean | null
          appearance?: Json | null
          space_filtering?: Json | null
          display_limit?: number | null
          ordering?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "widget_settings_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
  | { schema: "public" },
  TableName extends PublicTableNameOrOptions extends { schema: "public" }
  ? keyof (Database["public"]["Tables"] &
    Database["public"]["Views"])
  : never = never,
> = PublicTableNameOrOptions extends { schema: "public" }
  ? (Database["public"]["Tables"] &
    Database["public"]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
    PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
    PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: "public" },
  TableName extends PublicTableNameOrOptions extends { schema: "public" }
  ? keyof Database["public"]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: "public" }
  ? Database["public"]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: "public" },
  TableName extends PublicTableNameOrOptions extends { schema: "public" }
  ? keyof Database["public"]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: "public" }
  ? Database["public"]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof PublicSchema["Enums"]
  | { schema: "public" },
  EnumName extends PublicEnumNameOrOptions extends { schema: "public" }
  ? keyof Database["public"]["Enums"]
  : never = never,
> = PublicEnumNameOrOptions extends { schema: "public" }
  ? Database["public"]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof PublicSchema["CompositeTypes"]
  | { schema: "public" },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: "public"
  }
  ? keyof Database["public"]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: "public" }
  ? Database["public"]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never
