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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      incidents: {
        Row: {
          assignee: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          incident_id: string
          resolved_at: string | null
          severity: Database["public"]["Enums"]["threat_severity"]
          status: Database["public"]["Enums"]["incident_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assignee?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          incident_id: string
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["threat_severity"]
          status?: Database["public"]["Enums"]["incident_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assignee?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          incident_id?: string
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["threat_severity"]
          status?: Database["public"]["Enums"]["incident_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      monitored_assets: {
        Row: {
          asset_name: string
          asset_type: string
          created_at: string
          hostname: string | null
          id: string
          ip_address: unknown | null
          last_seen: string | null
          operating_system: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          asset_name: string
          asset_type: string
          created_at?: string
          hostname?: string | null
          id?: string
          ip_address?: unknown | null
          last_seen?: string | null
          operating_system?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          asset_name?: string
          asset_type?: string
          created_at?: string
          hostname?: string | null
          id?: string
          ip_address?: unknown | null
          last_seen?: string | null
          operating_system?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      network_logs: {
        Row: {
          bytes_transferred: number | null
          created_at: string
          destination_ip: unknown
          destination_port: number | null
          flags: string[] | null
          id: string
          packet_count: number | null
          protocol: string | null
          source_ip: unknown
          source_port: number | null
          threat_detected: boolean | null
          timestamp: string
        }
        Insert: {
          bytes_transferred?: number | null
          created_at?: string
          destination_ip: unknown
          destination_port?: number | null
          flags?: string[] | null
          id?: string
          packet_count?: number | null
          protocol?: string | null
          source_ip: unknown
          source_port?: number | null
          threat_detected?: boolean | null
          timestamp?: string
        }
        Update: {
          bytes_transferred?: number | null
          created_at?: string
          destination_ip?: unknown
          destination_port?: number | null
          flags?: string[] | null
          id?: string
          packet_count?: number | null
          protocol?: string | null
          source_ip?: unknown
          source_port?: number | null
          threat_detected?: boolean | null
          timestamp?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      security_metrics: {
        Row: {
          created_at: string
          id: string
          measurement_time: string
          metric_change: number | null
          metric_name: string
          metric_value: number
        }
        Insert: {
          created_at?: string
          id?: string
          measurement_time?: string
          metric_change?: number | null
          metric_name: string
          metric_value: number
        }
        Update: {
          created_at?: string
          id?: string
          measurement_time?: string
          metric_change?: number | null
          metric_name?: string
          metric_value?: number
        }
        Relationships: []
      }
      threats: {
        Row: {
          confidence_score: number | null
          created_at: string
          description: string
          detection_method: string | null
          id: string
          raw_data: Json | null
          resolved_at: string | null
          severity: Database["public"]["Enums"]["threat_severity"]
          source_host: string | null
          source_ip: unknown | null
          status: Database["public"]["Enums"]["threat_status"]
          target_host: string | null
          target_ip: unknown | null
          type: string
          updated_at: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          description: string
          detection_method?: string | null
          id?: string
          raw_data?: Json | null
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["threat_severity"]
          source_host?: string | null
          source_ip?: unknown | null
          status?: Database["public"]["Enums"]["threat_status"]
          target_host?: string | null
          target_ip?: unknown | null
          type: string
          updated_at?: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          description?: string
          detection_method?: string | null
          id?: string
          raw_data?: Json | null
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["threat_severity"]
          source_host?: string | null
          source_ip?: unknown | null
          status?: Database["public"]["Enums"]["threat_status"]
          target_host?: string | null
          target_ip?: unknown | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_security_personnel: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "security_analyst" | "viewer"
      incident_status:
        | "open"
        | "investigating"
        | "in-progress"
        | "resolved"
        | "closed"
      threat_severity: "low" | "medium" | "high" | "critical"
      threat_status: "active" | "investigating" | "resolved" | "false_positive"
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
      app_role: ["admin", "security_analyst", "viewer"],
      incident_status: [
        "open",
        "investigating",
        "in-progress",
        "resolved",
        "closed",
      ],
      threat_severity: ["low", "medium", "high", "critical"],
      threat_status: ["active", "investigating", "resolved", "false_positive"],
    },
  },
} as const
