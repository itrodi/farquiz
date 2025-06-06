export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      achievements: {
        Row: {
          id: number
          name: string
          description: string | null
          emoji: string | null
          criteria: Json | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          emoji?: string | null
          criteria?: Json | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          emoji?: string | null
          criteria?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: number
          name: string
          emoji: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          emoji?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          emoji?: string | null
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
      challenges: {
        Row: {
          id: string
          challenger_id: string
          recipient_id: string
          quiz_id: string
          challenger_score: number | null
          recipient_score: number | null
          status: string
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          challenger_id: string
          recipient_id: string
          quiz_id: string
          challenger_score?: number | null
          recipient_score?: number | null
          status?: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          challenger_id?: string
          recipient_id?: string
          quiz_id?: string
          challenger_score?: number | null
          recipient_score?: number | null
          status?: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenges_challenger_id_fkey"
            columns: ["challenger_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_quiz_id_fkey"
            columns: ["quiz_id"]
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_recipient_id_fkey"
            columns: ["recipient_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          total_score: number
          quizzes_taken: number
          quizzes_created: number
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          total_score?: number
          quizzes_taken?: number
          quizzes_created?: number
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          total_score?: number
          quizzes_taken?: number
          quizzes_created?: number
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          id: string
          quiz_id: string
          text: string
          question_type: string
          options: Json | null
          correct_answer: string | null
          correct_answers: string[] | null
          image_url: string | null
          map_url: string | null
          map_coordinates: Json | null
          order_index: number | null
          created_at: string
          media: Json | null
          validation: Json | null
          points: number | null
          hint: string | null
          explanation: string | null
          tags: string[] | null
          settings: Json | null
        }
        Insert: {
          id?: string
          quiz_id: string
          text: string
          question_type: string
          options?: Json | null
          correct_answer?: string | null
          correct_answers?: string[] | null
          image_url?: string | null
          map_url?: string | null
          map_coordinates?: Json | null
          order_index?: number | null
          created_at?: string
          media?: Json | null
          validation?: Json | null
          points?: number | null
          hint?: string | null
          explanation?: string | null
          tags?: string[] | null
          settings?: Json | null
        }
        Update: {
          id?: string
          quiz_id?: string
          text?: string
          question_type?: string
          options?: Json | null
          correct_answer?: string | null
          correct_answers?: string[] | null
          image_url?: string | null
          map_url?: string | null
          map_coordinates?: Json | null
          order_index?: number | null
          created_at?: string
          media?: Json | null
          validation?: Json | null
          points?: number | null
          hint?: string | null
          explanation?: string | null
          tags?: string[] | null
          settings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_quiz_id_fkey"
            columns: ["quiz_id"]
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          id: string
          title: string
          description: string | null
          emoji: string | null
          category_id: number | null
          creator_id: string | null
          time_limit: number
          is_published: boolean
          plays: number
          created_at: string
          updated_at: string
          quiz_type: string | null
          settings: Json | null
          tags: string[] | null
          difficulty: string | null
          scoring_type: string | null
          flow_type: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          emoji?: string | null
          category_id?: number | null
          creator_id?: string | null
          time_limit?: number
          is_published?: boolean
          plays?: number
          created_at?: string
          updated_at?: string
          quiz_type?: string | null
          settings?: Json | null
          tags?: string[] | null
          difficulty?: string | null
          scoring_type?: string | null
          flow_type?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          emoji?: string | null
          category_id?: number | null
          creator_id?: string | null
          time_limit?: number
          is_published?: boolean
          plays?: number
          created_at?: string
          updated_at?: string
          quiz_type?: string | null
          settings?: Json | null
          tags?: string[] | null
          difficulty?: string | null
          scoring_type?: string | null
          flow_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: number
          progress: number
          max_progress: number
          unlocked: boolean
          unlocked_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: number
          progress?: number
          max_progress?: number
          unlocked?: boolean
          unlocked_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: number
          progress?: number
          max_progress?: number
          unlocked?: boolean
          unlocked_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_scores: {
        Row: {
          id: string
          user_id: string
          quiz_id: string
          score: number
          max_score: number
          percentage: number
          time_taken: number | null
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          quiz_id: string
          score: number
          max_score: number
          percentage: number
          time_taken?: number | null
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          quiz_id?: string
          score?: number
          max_score?: number
          percentage?: number
          time_taken?: number | null
          completed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_scores_quiz_id_fkey"
            columns: ["quiz_id"]
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_scores_user_id_fkey"
            columns: ["user_id"]
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type Insertables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"]
export type Updateables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"]
export type Relationships<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Relationships"]

// Enhanced quiz types
export type QuestionType =
  | "multiple-choice"
  | "fill-blank"
  | "image-choice"
  | "map-click"
  | "matching"
  | "ordering"
  | "timeline"
  | "audio"
  | "categorize"
  | "list"

export type MediaType = "image" | "audio" | "video" | "svg"

export type ValidationType = "exact" | "case-insensitive" | "contains" | "regex" | "fuzzy"

export type QuizType = "standard" | "geography" | "image-based" | "timeline" | "categorization" | "word-logic"

export type ScoringType = "standard" | "partial" | "time-bonus" | "penalty" | "streak"

export type FlowType = "sequential" | "random" | "adaptive" | "branching"

export interface Media {
  type: MediaType
  url: string
  alt?: string
}

export interface Option {
  id: string
  text: string
  media?: Media
}

export interface Validation {
  type: ValidationType
  threshold?: number
  alternateAnswers?: string[]
}

export interface QuestionSettings {
  shuffleOptions?: boolean
  timeLimit?: number
}

export interface QuizSettings {
  showFeedbackImmediately?: boolean
  allowSkipping?: boolean
  showProgressBar?: boolean
  showTimer?: boolean
  passingScore?: number
}

export interface EnhancedQuestion {
  id?: string
  text: string
  type: QuestionType
  media?: Media
  options?: Option[]
  correctAnswer?: string | string[] | Record<string, string>
  validation?: Validation
  points?: number
  hint?: string
  explanation?: string
  tags?: string[]
  settings?: QuestionSettings
}

export interface EnhancedQuiz {
  title: string
  description?: string
  emoji?: string
  time_limit: number
  quiz_type?: QuizType
  settings?: QuizSettings
  tags?: string[]
  difficulty?: string
  scoring_type?: ScoringType
  flow_type?: FlowType
  questions: EnhancedQuestion[]
}
