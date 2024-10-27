export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      albums: {
        Row: {
          artist_id: string;
          created_at: string;
          id: string;
          image: string;
          name: string;
          updated_at: string;
          copyright: string[];
          release_date: string;
        };
        Insert: {
          artist_id?: string;
          created_at?: string;
          id?: string;
          image?: string;
          name?: string;
          updated_at?: string;
          copyright?: string[];
          release_date?: string;
        };
        Update: {
          artist_id?: string;
          created_at?: string;
          id?: string;
          image?: string;
          name?: string;
          updated_at?: string;
          copyright?: string[];
          release_date?: string;
        };
        Relationships: [
          {
            foreignKeyName: "albums_artist_id_fkey";
            columns: ["artist_id"];
            isOneToOne: false;
            referencedRelation: "artists";
            referencedColumns: ["id"];
          }
        ];
      };
      artists: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
          description: string | null;
          listeners: number;
          social: JSON | null;
          is_verified: boolean;
          avatar: string;
          covers: string[] | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
          description?: string | null;
          listeners?: number;
          social?: JSON | null;
          is_verified?: boolean;
          avatar?: string;
          covers?: string[] | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
          description?: string | null;
          listeners?: number;
          social?: JSON | null;
          is_verified?: boolean;
          avatar?: string;
          covers?: string[] | null;
        };
        Relationships: [];
      };
      tracks: {
        Row: {
          album_id: string | null;
          artist_id: string;
          created_at: string;
          id: string;
          image: string;
          name: string;
          order_in_album: number | null;
          song_url: string;
          updated_at: string;
          copyright: string[];
          release_date: string;
          reproductions: number;
          seconds: number;
        };
        Insert: {
          album_id?: string | null;
          artist_id?: string;
          created_at?: string;
          id?: string;
          image?: string;
          name?: string;
          order_in_album?: number | null;
          song_url?: string;
          updated_at?: string;
          copyright?: string[];
          release_date?: string;
          reproductions?: number;
          seconds?: number;
        };
        Update: {
          album_id?: string | null;
          artist_id?: string;
          created_at?: string;
          id?: string;
          image?: string;
          name?: string;
          order_in_album?: number | null;
          song_url?: string;
          updated_at?: string;
          copyright?: string[];
          release_date?: string;
          reproductions?: number;
          seconds?: number;
        };
        Relationships: [
          {
            foreignKeyName: "tracks_album_id_fkey";
            columns: ["album_id"];
            isOneToOne: false;
            referencedRelation: "albums";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tracks_artist_id_fkey";
            columns: ["artist_id"];
            isOneToOne: false;
            referencedRelation: "artists";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
