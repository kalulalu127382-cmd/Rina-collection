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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      banners: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          description: string | null
          cta_text: string
          cta_link: string
          bg_color: string
          bg_gradient: string | null
          text_color: string
          image_url: string | null
          sort_order: number
          active: boolean
          starts_at: string | null
          ends_at: string | null
          show_timer: boolean
          offer_label: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          description?: string | null
          cta_text?: string
          cta_link?: string
          bg_color?: string
          bg_gradient?: string | null
          text_color?: string
          image_url?: string | null
          sort_order?: number
          active?: boolean
          starts_at?: string | null
          ends_at?: string | null
          show_timer?: boolean
          offer_label?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          description?: string | null
          cta_text?: string
          cta_link?: string
          bg_color?: string
          bg_gradient?: string | null
          text_color?: string
          image_url?: string | null
          sort_order?: number
          active?: boolean
          starts_at?: string | null
          ends_at?: string | null
          show_timer?: boolean
          offer_label?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          color_snapshot: string | null
          created_at: string
          id: string
          line_total: number
          order_id: string
          product_id: string
          product_name_snapshot: string
          quantity: number
          size_snapshot: string | null
          unit_price: number
          variant_id: string | null
        }
        Insert: {
          color_snapshot?: string | null
          created_at?: string
          id?: string
          line_total: number
          order_id: string
          product_id: string
          product_name_snapshot: string
          quantity: number
          size_snapshot?: string | null
          unit_price: number
          variant_id?: string | null
        }
        Update: {
          color_snapshot?: string | null
          created_at?: string
          id?: string
          line_total?: number
          order_id?: string
          product_id?: string
          product_name_snapshot?: string
          quantity?: number
          size_snapshot?: string | null
          unit_price?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          amount_paid: number
          amount_remaining: number
          city: string
          created_at: string
          customer_name: string
          delivery_charge: number
          discount_amount: number
          id: string
          order_number: string | null
          payment_method: string | null
          payment_screenshot_url: string | null
          phone: string
          promo_code_id: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          tracking_token: string | null
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          verification_note: string | null
        }
        Insert: {
          address: string
          amount_paid?: number
          amount_remaining?: number
          city: string
          created_at?: string
          customer_name: string
          delivery_charge?: number
          discount_amount?: number
          id?: string
          order_number?: string | null
          payment_method?: string | null
          payment_screenshot_url?: string | null
          phone: string
          promo_code_id?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          tracking_token?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          verification_note?: string | null
        }
        Update: {
          address?: string
          amount_paid?: number
          amount_remaining?: number
          city?: string
          created_at?: string
          customer_name?: string
          delivery_charge?: number
          discount_amount?: number
          id?: string
          order_number?: string | null
          payment_method?: string | null
          payment_screenshot_url?: string | null
          phone?: string
          promo_code_id?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          tracking_token?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          verification_note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          image_url: string
          is_cover: boolean
          product_id: string
          sort_order: number
          variant_id: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_cover?: boolean
          product_id: string
          sort_order?: number
          variant_id?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_cover?: boolean
          product_id?: string
          sort_order?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          active: boolean
          color: string | null
          created_at: string
          id: string
          product_id: string
          size: string | null
          sku: string | null
          stock: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          color?: string | null
          created_at?: string
          id?: string
          product_id: string
          size?: string | null
          sku?: string | null
          stock?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          color?: string | null
          created_at?: string
          id?: string
          product_id?: string
          size?: string | null
          sku?: string | null
          stock?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          care_instructions: string | null
          created_at: string
          description: string | null
          id: string
          material: string | null
          name: string
          price: number
          sale_price: number | null
          size_fit_notes: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          care_instructions?: string | null
          created_at?: string
          description?: string | null
          id?: string
          material?: string | null
          name: string
          price: number
          sale_price?: number | null
          size_fit_notes?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          care_instructions?: string | null
          created_at?: string
          description?: string | null
          id?: string
          material?: string | null
          name?: string
          price?: number
          sale_price?: number | null
          size_fit_notes?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          active: boolean
          applies_to_delivery: boolean
          code: string
          created_at: string
          expires_at: string | null
          id: string
          max_uses: number | null
          min_order_amount: number | null
          per_customer_limit: number | null
          referrer_name: string | null
          type: Database["public"]["Enums"]["promo_code_type"]
          updated_at: string
          used_count: number
          value: number
        }
        Insert: {
          active?: boolean
          applies_to_delivery?: boolean
          code: string
          created_at?: string
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          min_order_amount?: number | null
          per_customer_limit?: number | null
          referrer_name?: string | null
          type: Database["public"]["Enums"]["promo_code_type"]
          updated_at?: string
          used_count?: number
          value: number
        }
        Update: {
          active?: boolean
          applies_to_delivery?: boolean
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          min_order_amount?: number | null
          per_customer_limit?: number | null
          referrer_name?: string | null
          type?: Database["public"]["Enums"]["promo_code_type"]
          updated_at?: string
          used_count?: number
          value?: number
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      place_order: {
        Args: {
          p_address: string
          p_amount_paid?: number
          p_amount_remaining?: number
          p_city: string
          p_customer_name: string
          p_delivery_charge: number
          p_discount_amount?: number
          p_items?: Json
          p_payment_method?: string
          p_payment_screenshot_url?: string
          p_phone: string
          p_promo_code_id?: string
          p_subtotal: number
          p_total?: number
          p_utm_campaign?: string
          p_utm_medium?: string
          p_utm_source?: string
        }
        Returns: Json
      }
      track_order_by_number_phone: {
        Args: { p_order_number: string; p_phone: string }
        Returns: Json
      }
      track_order_by_token: {
        Args: { p_tracking_token: string }
        Returns: Json
      }
      validate_promo_code: {
        Args: { p_code: string; p_subtotal?: number }
        Returns: Json
      }
    }
    Enums: {
      order_status:
        | "PENDING_VERIFICATION"
        | "CONFIRMED"
        | "PROCESSING"
        | "SHIPPED"
        | "DELIVERED"
        | "PAYMENT_REJECTED"
        | "CANCELLED"
        | "OUT_OF_STOCK"
      promo_code_type: "FLAT" | "PERCENT"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      order_status: [
        "PENDING_VERIFICATION",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "PAYMENT_REJECTED",
        "CANCELLED",
        "OUT_OF_STOCK",
      ],
      promo_code_type: ["FLAT", "PERCENT"],
    },
  },
} as const
