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
      spaces: {
        Row: {
          created_at: string | null
          custom_branding_enabled: boolean | null
          id: string
          name: string
          primary_color: string | null
          slug: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          custom_branding_enabled?: boolean | null
          id?: string
          name: string
          primary_color?: string | null
          slug: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          custom_branding_enabled?: boolean | null
          id?: string
          name?: string
          primary_color?: string | null
          slug?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spaces_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          company: string | null
          content: string | null
          created_at: string | null
          email: string | null
          id: string
          is_favorite: boolean | null
          name: string
          rating: number
          space_id: string
          status: Database["public"]["Enums"]["testimonial_status"] | null
          title: string | null
          type: Database["public"]["Enums"]["testimonial_type"]
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          content?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_favorite?: boolean | null
          name: string
          rating: number
          space_id: string
          status?: Database["public"]["Enums"]["testimonial_status"] | null
          title?: string | null
          type: Database["public"]["Enums"]["testimonial_type"]
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          content?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_favorite?: boolean | null
          name?: string
          rating?: number
          space_id?: string
          status?: Database["public"]["Enums"]["testimonial_status"] | null
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
          },
        ]
      }
      widget_settings: {
        Row: {
          animation: string | null
          background_color: string | null
          border_radius: string | null
          card_background: string | null
          columns: number | null
          created_at: string | null
          display_date: boolean | null
          display_limit: number | null
          display_rating: boolean | null
          display_source: boolean | null
          font_details: string | null
          font_size: string | null
          gap: number | null
          id: string
          layout: string | null
          layout_config: Json | null
          modal_open: boolean | null
          ordering: string | null
          scroll_speed: number | null
          shadow: string | null
          show_border: boolean | null
          show_shadow: boolean | null
          space_filtering: Json | null
          space_id: string
          subtitle_color: string | null
          text_color: string | null
          theme: string | null
          title_color: string | null
          updated_at: string | null
        }
        Insert: {
          animation?: string | null
          background_color?: string | null
          border_radius?: string | null
          card_background?: string | null
          columns?: number | null
          created_at?: string | null
          display_date?: boolean | null
          display_limit?: number | null
          display_rating?: boolean | null
          display_source?: boolean | null
          font_details?: string | null
          font_size?: string | null
          gap?: number | null
          id?: string
          layout?: string | null
          layout_config?: Json | null
          modal_open?: boolean | null
          ordering?: string | null
          scroll_speed?: number | null
          shadow?: string | null
          show_border?: boolean | null
          show_shadow?: boolean | null
          space_filtering?: Json | null
          space_id: string
          subtitle_color?: string | null
          text_color?: string | null
          theme?: string | null
          title_color?: string | null
          updated_at?: string | null
        }
        Update: {
          animation?: string | null
          background_color?: string | null
          border_radius?: string | null
          card_background?: string | null
          columns?: number | null
          created_at?: string | null
          display_date?: boolean | null
          display_limit?: number | null
          display_rating?: boolean | null
          display_source?: boolean | null
          font_details?: string | null
          font_size?: string | null
          gap?: number | null
          id?: string
          layout?: string | null
          layout_config?: Json | null
          modal_open?: boolean | null
          ordering?: string | null
          scroll_speed?: number | null
          shadow?: string | null
          show_border?: boolean | null
          show_shadow?: boolean | null
          space_filtering?: Json | null
          space_id?: string
          subtitle_color?: string | null
          text_color?: string | null
          theme?: string | null
          title_color?: string | null
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
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof PublicSchema["CompositeTypes"]
  | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never
