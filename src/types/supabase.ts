export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  next_auth: {
    Tables: {
      accounts: {
        Row: {
          access_token: string | null
          expires_at: number | null
          id: string
          id_token: string | null
          oauth_token: string | null
          oauth_token_secret: string | null
          provider: string
          providerAccountId: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          userId: string | null
        }
        Insert: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          oauth_token?: string | null
          oauth_token_secret?: string | null
          provider: string
          providerAccountId: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          userId?: string | null
        }
        Update: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          oauth_token?: string | null
          oauth_token_secret?: string | null
          provider?: string
          providerAccountId?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          expires: string
          id: string
          sessionToken: string
          userId: string | null
        }
        Insert: {
          expires: string
          id?: string
          sessionToken: string
          userId?: string | null
        }
        Update: {
          expires?: string
          id?: string
          sessionToken?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          birth_date: string | null
          country: string | null
          email: string | null
          emailVerified: string | null
          gender: string | null
          id: string
          image: string | null
          name: string | null
          onboarding_completed: boolean
          role: string | null
        }
        Insert: {
          birth_date?: string | null
          country?: string | null
          email?: string | null
          emailVerified?: string | null
          gender?: string | null
          id?: string
          image?: string | null
          name?: string | null
          onboarding_completed?: boolean
          role?: string | null
        }
        Update: {
          birth_date?: string | null
          country?: string | null
          email?: string | null
          emailVerified?: string | null
          gender?: string | null
          id?: string
          image?: string | null
          name?: string | null
          onboarding_completed?: boolean
          role?: string | null
        }
        Relationships: []
      }
      verification_tokens: {
        Row: {
          expires: string
          identifier: string | null
          token: string
        }
        Insert: {
          expires: string
          identifier?: string | null
          token: string
        }
        Update: {
          expires?: string
          identifier?: string | null
          token?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      gender: "male" | "female"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      book_genres: {
        Row: {
          book_id: string
          genre_id: string
        }
        Insert: {
          book_id?: string
          genre_id?: string
        }
        Update: {
          book_id?: string
          genre_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_genres_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_genres_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          book_author: string
          book_title: string
          created_at: string
          id: string
          image_url_1: string | null
          image_url_2: string | null
          image_url_3: string | null
          isbn: string
          publish_year: number
          publisher: string
        }
        Insert: {
          book_author: string
          book_title: string
          created_at?: string
          id?: string
          image_url_1?: string | null
          image_url_2?: string | null
          image_url_3?: string | null
          isbn: string
          publish_year: number
          publisher: string
        }
        Update: {
          book_author?: string
          book_title?: string
          created_at?: string
          id?: string
          image_url_1?: string | null
          image_url_2?: string | null
          image_url_3?: string | null
          isbn?: string
          publish_year?: number
          publisher?: string
        }
        Relationships: []
      }
      books_detailed: {
        Row: {
          author: string
          cover_img: string | null
          created_at: string
          description: string
          edition: string | null
          genres: string
          id: string
          isbn: string
          language: string
          publish_year: number | null
          publisher: string | null
          series: string
          title: string
        }
        Insert: {
          author: string
          cover_img?: string | null
          created_at?: string
          description: string
          edition?: string | null
          genres: string
          id?: string
          isbn: string
          language: string
          publish_year?: number | null
          publisher?: string | null
          series: string
          title: string
        }
        Update: {
          author?: string
          cover_img?: string | null
          created_at?: string
          description?: string
          edition?: string | null
          genres?: string
          id?: string
          isbn?: string
          language?: string
          publish_year?: number | null
          publisher?: string | null
          series?: string
          title?: string
        }
        Relationships: []
      }
      books_library: {
        Row: {
          book_id: string
          created_at: string
          id: string
          status: Database["public"]["Enums"]["library_status"]
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          status: Database["public"]["Enums"]["library_status"]
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["library_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_library_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books_detailed"
            referencedColumns: ["id"]
          },
        ]
      }
      books_ratings: {
        Row: {
          book_id: string
          created_at: string
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_ratings_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books_detailed"
            referencedColumns: ["id"]
          },
        ]
      }
      genres: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      lists: {
        Row: {
          created_at: string
          created_by: string
          description: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      lists_tags: {
        Row: {
          created_at: string
          genre_id: string
          id: number
          list_id: string
        }
        Insert: {
          created_at?: string
          genre_id: string
          id?: number
          list_id: string
        }
        Update: {
          created_at?: string
          genre_id?: string
          id?: number
          list_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lists_tags_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lists_tags_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
        ]
      }
      lists_votes: {
        Row: {
          book_id: string
          created_at: string
          id: number
          list_id: string
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: number
          list_id: string
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: number
          list_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lists_votes_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lists_votes_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorite_genres: {
        Row: {
          genre_id: string
          user_id: string
        }
        Insert: {
          genre_id: string
          user_id: string
        }
        Update: {
          genre_id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_similar_books: {
        Args: {
          input_book_title: string
        }
        Returns: {
          id: string
          book_title: string
          book_author: string
          image_url_3: string
        }[]
      }
      get_similar_books_v2: {
        Args: {
          input_book_title: string
        }
        Returns: {
          id: string
          author: string
          cover_img: string
          description: string
          edition: string
          genres: string
          isbn: string
          language: string
          publish_year: number
          publisher: string
          series: string
          title: string
        }[]
      }
      get_similar_lists: {
        Args: {
          search_input: string
        }
        Returns: {
          id: string
          name: string
          description: string
          created_by: string
          genres: string[]
        }[]
      }
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      search_books: {
        Args: {
          input_value: string
          filter_type?: string
        }
        Returns: {
          id: string
          author: string
          cover_img: string
          description: string
          edition: string
          genres: string
          isbn: string
          language: string
          publish_year: number
          publisher: string
          series: string
          title: string
        }[]
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
    }
    Enums: {
      library_status: "read" | "wantToRead" | "reading"
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
