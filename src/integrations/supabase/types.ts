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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          location: string | null
          message: string
          severity: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          message: string
          severity: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          message?: string
          severity?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          is_user: boolean
          message: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_user?: boolean
          message: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_user?: boolean
          message?: string
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      incident_reports: {
        Row: {
          assigned_agent: string | null
          case_id: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string
          evidence_files: string[] | null
          id: string
          incident_date: string | null
          incident_type: string
          is_anonymous: boolean | null
          location: string | null
          status: string | null
          updated_at: string
          urgency: string
          user_id: string
        }
        Insert: {
          assigned_agent?: string | null
          case_id: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description: string
          evidence_files?: string[] | null
          id?: string
          incident_date?: string | null
          incident_type: string
          is_anonymous?: boolean | null
          location?: string | null
          status?: string | null
          updated_at?: string
          urgency: string
          user_id: string
        }
        Update: {
          assigned_agent?: string | null
          case_id?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string
          evidence_files?: string[] | null
          id?: string
          incident_date?: string | null
          incident_type?: string
          is_anonymous?: boolean | null
          location?: string | null
          status?: string | null
          updated_at?: string
          urgency?: string
          user_id?: string
        }
        Relationships: []
      }
      link_checks: {
        Row: {
          created_at: string
          id: string
          is_safe: boolean | null
          risk_level: string | null
          scan_details: Json | null
          threats_detected: string[] | null
          url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_safe?: boolean | null
          risk_level?: string | null
          scan_details?: Json | null
          threats_detected?: string[] | null
          url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_safe?: boolean | null
          risk_level?: string | null
          scan_details?: Json | null
          threats_detected?: string[] | null
          url?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: string
          content: string | null
          created_at: string
          description: string | null
          difficulty_level: string | null
          id: string
          is_featured: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          id?: string
          is_featured?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          id?: string
          is_featured?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_alert_reads: {
        Row: {
          alert_id: string
          id: string
          read_at: string
          user_id: string
        }
        Insert: {
          alert_id: string
          id?: string
          read_at?: string
          user_id: string
        }
        Update: {
          alert_id?: string
          id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_alert_reads_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_case_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
