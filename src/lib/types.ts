export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          bio: string;
          avatar_url: string;
          mood_theme: string;
          message_count: number;
          streak_days: number;
          last_active: string;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string;
          bio?: string;
          avatar_url?: string;
          mood_theme?: string;
          message_count?: number;
          streak_days?: number;
          last_active?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string;
          bio?: string;
          avatar_url?: string;
          mood_theme?: string;
          message_count?: number;
          streak_days?: number;
          last_active?: string;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          recipient_id: string;
          content: string;
          emoji_reaction: string;
          is_favorited: boolean;
          is_archived: boolean;
          is_deleted: boolean;
          is_flagged: boolean;
          public_reply: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipient_id: string;
          content: string;
          emoji_reaction?: string;
          is_favorited?: boolean;
          is_archived?: boolean;
          is_deleted?: boolean;
          is_flagged?: boolean;
          public_reply?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipient_id?: string;
          content?: string;
          emoji_reaction?: string;
          is_favorited?: boolean;
          is_archived?: boolean;
          is_deleted?: boolean;
          is_flagged?: boolean;
          public_reply?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];

export const MOOD_THEMES = {
  cosmic: { label: 'Cosmic', primary: '#4f8ef7', secondary: '#a78bfa', bg: '#0a0a1a' },
  aurora: { label: 'Aurora', primary: '#34d399', secondary: '#6ee7b7', bg: '#0a1a14' },
  nebula: { label: 'Nebula', primary: '#f472b6', secondary: '#ec4899', bg: '#1a0a14' },
  celestial: { label: 'Celestial', primary: '#fbbf24', secondary: '#f59e0b', bg: '#1a1400' },
} as const;
