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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_operations_log: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          operation_type: string
          performed_by: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          operation_type: string
          performed_by?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          operation_type?: string
          performed_by?: string | null
        }
        Relationships: []
      }
      ai_translations: {
        Row: {
          content_type: string | null
          created_at: string | null
          id: string
          model_used: string | null
          quality_score: number | null
          source_text: string
          target_language: string
          translated_text: string
          user_id: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string | null
          id?: string
          model_used?: string | null
          quality_score?: number | null
          source_text: string
          target_language: string
          translated_text: string
          user_id?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string | null
          id?: string
          model_used?: string | null
          quality_score?: number | null
          source_text?: string
          target_language?: string
          translated_text?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ai_usage_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          execution_time_ms: number | null
          function_type: string
          id: string
          model_used: string
          prompt_length: number | null
          response_length: number | null
          source_language: string | null
          success: boolean
          target_language: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          function_type: string
          id?: string
          model_used: string
          prompt_length?: number | null
          response_length?: number | null
          source_language?: string | null
          success?: boolean
          target_language?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          function_type?: string
          id?: string
          model_used?: string
          prompt_length?: number | null
          response_length?: number | null
          source_language?: string | null
          success?: boolean
          target_language?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      client_categories: {
        Row: {
          category: string
          client_id: string
          created_at: string
          id: string
        }
        Insert: {
          category: string
          client_id: string
          created_at?: string
          id?: string
        }
        Update: {
          category?: string
          client_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_categories_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_categories_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          background_image: string | null
          case_study_images: Json | null
          case_study_results: Json | null
          case_study_team_size: string | null
          case_study_timeline: string | null
          case_study_videos: Json | null
          country: string | null
          created_at: string | null
          display_order: number | null
          featured: boolean | null
          id: string
          industry: string | null
          logo: string
          og_image: string | null
          product_category: string
          slug: string
          twitter_image: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          background_image?: string | null
          case_study_images?: Json | null
          case_study_results?: Json | null
          case_study_team_size?: string | null
          case_study_timeline?: string | null
          case_study_videos?: Json | null
          country?: string | null
          created_at?: string | null
          display_order?: number | null
          featured?: boolean | null
          id?: string
          industry?: string | null
          logo: string
          og_image?: string | null
          product_category: string
          slug: string
          twitter_image?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          background_image?: string | null
          case_study_images?: Json | null
          case_study_results?: Json | null
          case_study_team_size?: string | null
          case_study_timeline?: string | null
          case_study_videos?: Json | null
          country?: string | null
          created_at?: string | null
          display_order?: number | null
          featured?: boolean | null
          id?: string
          industry?: string | null
          logo?: string
          og_image?: string | null
          product_category?: string
          slug?: string
          twitter_image?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      clients_translations: {
        Row: {
          case_study_challenge: string | null
          case_study_images: Json | null
          case_study_results: Json | null
          case_study_solution: string | null
          case_study_team_size: string | null
          case_study_timeline: string | null
          case_study_videos: Json | null
          client_id: string
          created_at: string | null
          description: string | null
          id: string
          language_id: number
          name: string | null
          updated_at: string | null
        }
        Insert: {
          case_study_challenge?: string | null
          case_study_images?: Json | null
          case_study_results?: Json | null
          case_study_solution?: string | null
          case_study_team_size?: string | null
          case_study_timeline?: string | null
          case_study_videos?: Json | null
          client_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          language_id: number
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          case_study_challenge?: string | null
          case_study_images?: Json | null
          case_study_results?: Json | null
          case_study_solution?: string | null
          case_study_team_size?: string | null
          case_study_timeline?: string | null
          case_study_videos?: Json | null
          client_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          language_id?: number
          name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_translations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_clients_translations_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      company_fact_translations: {
        Row: {
          company_fact_id: string
          created_at: string | null
          description: string | null
          id: string
          label: string | null
          language_id: number
          updated_at: string | null
        }
        Insert: {
          company_fact_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          label?: string | null
          language_id: number
          updated_at?: string | null
        }
        Update: {
          company_fact_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          label?: string | null
          language_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_fact_translations_company_fact_id_fkey"
            columns: ["company_fact_id"]
            isOneToOne: false
            referencedRelation: "company_facts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_fact_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      company_facts: {
        Row: {
          created_at: string | null
          display_order: number
          icon_name: string
          id: string
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number
          icon_name: string
          id?: string
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          display_order?: number
          icon_name?: string
          id?: string
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      company_info: {
        Row: {
          created_at: string | null
          founded_year: number | null
          id: string
          image_url: string | null
          language_code: string | null
          updated_at: string | null
          values: string[] | null
        }
        Insert: {
          created_at?: string | null
          founded_year?: number | null
          id?: string
          image_url?: string | null
          language_code?: string | null
          updated_at?: string | null
          values?: string[] | null
        }
        Update: {
          created_at?: string | null
          founded_year?: number | null
          id?: string
          image_url?: string | null
          language_code?: string | null
          updated_at?: string | null
          values?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "company_info_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
        ]
      }
      company_info_translations: {
        Row: {
          approach: string | null
          company_info_id: string
          content: string | null
          created_at: string | null
          history: string | null
          id: string
          language_id: number
          mission: string | null
          team_intro: string | null
          title: string | null
          updated_at: string | null
          vision: string | null
        }
        Insert: {
          approach?: string | null
          company_info_id: string
          content?: string | null
          created_at?: string | null
          history?: string | null
          id?: string
          language_id: number
          mission?: string | null
          team_intro?: string | null
          title?: string | null
          updated_at?: string | null
          vision?: string | null
        }
        Update: {
          approach?: string | null
          company_info_id?: string
          content?: string | null
          created_at?: string | null
          history?: string | null
          id?: string
          language_id?: number
          mission?: string | null
          team_intro?: string | null
          title?: string | null
          updated_at?: string | null
          vision?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_info_translations_company_info_id_fkey"
            columns: ["company_info_id"]
            isOneToOne: false
            referencedRelation: "company_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_info_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      company_metrics: {
        Row: {
          created_at: string | null
          display_order: number | null
          icon_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      company_metrics_translations: {
        Row: {
          company_metric_id: string
          created_at: string | null
          description: string | null
          id: string
          language_id: number
          title: string | null
          updated_at: string | null
          value: string | null
        }
        Insert: {
          company_metric_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          language_id: number
          title?: string | null
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          company_metric_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          language_id?: number
          title?: string | null
          updated_at?: string | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_metrics_translations_company_metric_id_fkey"
            columns: ["company_metric_id"]
            isOneToOne: false
            referencedRelation: "company_metrics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_metrics_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      company_milestone_translations: {
        Row: {
          company_milestone_id: string
          created_at: string | null
          description: string | null
          id: string
          language_id: number
          title: string | null
          updated_at: string | null
        }
        Insert: {
          company_milestone_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          language_id: number
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          company_milestone_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          language_id?: number
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_milestone_translations_company_milestone_id_fkey"
            columns: ["company_milestone_id"]
            isOneToOne: false
            referencedRelation: "company_milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_milestone_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      company_milestones: {
        Row: {
          created_at: string | null
          display_order: number | null
          icon_name: string | null
          id: string
          updated_at: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          updated_at?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      company_team_fact_translations: {
        Row: {
          company_team_fact_id: string
          created_at: string | null
          description: string | null
          id: string
          key: string | null
          language_id: number
          updated_at: string | null
          value: string | null
        }
        Insert: {
          company_team_fact_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string | null
          language_id: number
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          company_team_fact_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string | null
          language_id?: number
          updated_at?: string | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_team_fact_translations_company_team_fact_id_fkey"
            columns: ["company_team_fact_id"]
            isOneToOne: false
            referencedRelation: "company_team_facts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_team_fact_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      company_team_facts: {
        Row: {
          created_at: string | null
          display_order: number | null
          icon_name: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          icon_name: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          icon_name?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      company_testimonial_translations: {
        Row: {
          company: string | null
          company_testimonial_id: string
          created_at: string | null
          id: string
          job_position: string | null
          language_id: number
          name: string | null
          quote: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          company_testimonial_id: string
          created_at?: string | null
          id?: string
          job_position?: string | null
          language_id: number
          name?: string | null
          quote?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          company_testimonial_id?: string
          created_at?: string | null
          id?: string
          job_position?: string | null
          language_id?: number
          name?: string | null
          quote?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_testimonial_translations_company_testimonial_id_fkey"
            columns: ["company_testimonial_id"]
            isOneToOne: false
            referencedRelation: "company_testimonials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_testimonial_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      company_testimonials: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      company_value_translations: {
        Row: {
          company_value_id: string
          created_at: string | null
          description: string | null
          id: string
          language_id: number
          title: string | null
          updated_at: string | null
        }
        Insert: {
          company_value_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          language_id: number
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          company_value_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          language_id?: number
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_value_translations_company_value_id_fkey"
            columns: ["company_value_id"]
            isOneToOne: false
            referencedRelation: "company_values"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_value_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      company_values: {
        Row: {
          created_at: string | null
          display_order: number | null
          icon_name: string
          id: string
          language_code: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          icon_name: string
          id?: string
          language_code?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          icon_name?: string
          id?: string
          language_code?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_values_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
        ]
      }
      contact_info: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          info_type: string
          is_primary: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          info_type: string
          is_primary?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          info_type?: string
          is_primary?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_info_translations: {
        Row: {
          address: string | null
          contact_info_id: string
          created_at: string | null
          description: string | null
          id: string
          label: string | null
          language_id: number
          updated_at: string | null
          value: string | null
        }
        Insert: {
          address?: string | null
          contact_info_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          label?: string | null
          language_id: number
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          address?: string | null
          contact_info_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          label?: string | null
          language_id?: number
          updated_at?: string | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_info_translations_contact_info_id_fkey"
            columns: ["contact_info_id"]
            isOneToOne: false
            referencedRelation: "contact_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_info_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          company: string | null
          created_at: string
          current_page: string | null
          email: string
          id: string
          interest: string
          ip_address: string | null
          language: string | null
          message: string
          name: string
          phone: string | null
          selected_services: string[] | null
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          current_page?: string | null
          email: string
          id?: string
          interest: string
          ip_address?: string | null
          language?: string | null
          message: string
          name: string
          phone?: string | null
          selected_services?: string[] | null
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          current_page?: string | null
          email?: string
          id?: string
          interest?: string
          ip_address?: string | null
          language?: string | null
          message?: string
          name?: string
          phone?: string | null
          selected_services?: string[] | null
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      course_instructors: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          name: string
          photo_url: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          name: string
          photo_url?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
          photo_url?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      course_lessons: {
        Row: {
          bullets: Json | null
          course_id: string
          created_at: string
          day_label: string | null
          day_number: number
          description: string | null
          display_order: number
          end_time: string | null
          id: string
          instructor_id: string | null
          instructor_name_override: string | null
          is_break: boolean
          lesson_date: string | null
          start_time: string | null
          title: string
          updated_at: string
        }
        Insert: {
          bullets?: Json | null
          course_id: string
          created_at?: string
          day_label?: string | null
          day_number?: number
          description?: string | null
          display_order?: number
          end_time?: string | null
          id?: string
          instructor_id?: string | null
          instructor_name_override?: string | null
          is_break?: boolean
          lesson_date?: string | null
          start_time?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          bullets?: Json | null
          course_id?: string
          created_at?: string
          day_label?: string | null
          day_number?: number
          description?: string | null
          display_order?: number
          end_time?: string | null
          id?: string
          instructor_id?: string | null
          instructor_name_override?: string | null
          is_break?: boolean
          lesson_date?: string | null
          start_time?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_lessons_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "course_instructors"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          bundle_price_eur: number | null
          coordinator_id: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          display_order: number
          end_date: string
          id: string
          is_published: boolean
          location: string | null
          mode: string[]
          price_eur: number | null
          slug: string
          start_date: string
          subtitle: string | null
          title: string
          topic: string | null
          updated_at: string
        }
        Insert: {
          bundle_price_eur?: number | null
          coordinator_id?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          end_date: string
          id?: string
          is_published?: boolean
          location?: string | null
          mode?: string[]
          price_eur?: number | null
          slug: string
          start_date: string
          subtitle?: string | null
          title: string
          topic?: string | null
          updated_at?: string
        }
        Update: {
          bundle_price_eur?: number | null
          coordinator_id?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          end_date?: string
          id?: string
          is_published?: boolean
          location?: string | null
          mode?: string[]
          price_eur?: number | null
          slug?: string
          start_date?: string
          subtitle?: string | null
          title?: string
          topic?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_coordinator_id_fkey"
            columns: ["coordinator_id"]
            isOneToOne: false
            referencedRelation: "course_instructors"
            referencedColumns: ["id"]
          },
        ]
      }
      credential_translations: {
        Row: {
          created_at: string | null
          credential_id: string
          description: string | null
          id: string
          language_id: number
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credential_id: string
          description?: string | null
          id?: string
          language_id: number
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credential_id?: string
          description?: string | null
          id?: string
          language_id?: number
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credential_translations_credential_id_fkey"
            columns: ["credential_id"]
            isOneToOne: false
            referencedRelation: "credentials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credential_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      credentials: {
        Row: {
          created_at: string
          display_order: number
          icon_name: string
          id: string
          image_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          icon_name: string
          id?: string
          image_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          icon_name?: string
          id?: string
          image_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      domain_config: {
        Row: {
          created_at: string | null
          domain: string
          homepage_url: string | null
          id: string
          is_primary: boolean | null
          language_code: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain: string
          homepage_url?: string | null
          id?: string
          is_primary?: boolean | null
          language_code: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string
          homepage_url?: string | null
          id?: string
          is_primary?: boolean | null
          language_code?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "domain_config_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
        ]
      }
      hero_content: {
        Row: {
          background_image: string | null
          background_type: string | null
          background_video: string | null
          bunny_video_desktop: string | null
          bunny_video_mobile: string | null
          created_at: string | null
          cta_link: string | null
          desktop_video_id: string | null
          id: string
          language_code: string | null
          mobile_video_id: string | null
          page_name: string
          updated_at: string | null
        }
        Insert: {
          background_image?: string | null
          background_type?: string | null
          background_video?: string | null
          bunny_video_desktop?: string | null
          bunny_video_mobile?: string | null
          created_at?: string | null
          cta_link?: string | null
          desktop_video_id?: string | null
          id?: string
          language_code?: string | null
          mobile_video_id?: string | null
          page_name: string
          updated_at?: string | null
        }
        Update: {
          background_image?: string | null
          background_type?: string | null
          background_video?: string | null
          bunny_video_desktop?: string | null
          bunny_video_mobile?: string | null
          created_at?: string | null
          cta_link?: string | null
          desktop_video_id?: string | null
          id?: string
          language_code?: string | null
          mobile_video_id?: string | null
          page_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hero_content_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
        ]
      }
      hero_content_translations: {
        Row: {
          background_image: string | null
          background_video: string | null
          created_at: string | null
          cta_text: string | null
          heading: string | null
          hero_content_id: string
          id: string
          language_id: number
          subheading: string | null
          updated_at: string | null
        }
        Insert: {
          background_image?: string | null
          background_video?: string | null
          created_at?: string | null
          cta_text?: string | null
          heading?: string | null
          hero_content_id: string
          id?: string
          language_id: number
          subheading?: string | null
          updated_at?: string | null
        }
        Update: {
          background_image?: string | null
          background_video?: string | null
          created_at?: string | null
          cta_text?: string | null
          heading?: string | null
          hero_content_id?: string
          id?: string
          language_id?: number
          subheading?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hero_content_translations_hero_content_id_fkey"
            columns: ["hero_content_id"]
            isOneToOne: false
            referencedRelation: "hero_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hero_content_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      insights: {
        Row: {
          author: string
          canonical_url: string | null
          category: string | null
          created_at: string
          featured_image: string | null
          id: string
          og_image: string | null
          og_url: string | null
          published_date: string
          slug: string
          twitter_image: string | null
          twitter_url: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          author?: string
          canonical_url?: string | null
          category?: string | null
          created_at?: string
          featured_image?: string | null
          id?: string
          og_image?: string | null
          og_url?: string | null
          published_date?: string
          slug: string
          twitter_image?: string | null
          twitter_url?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          author?: string
          canonical_url?: string | null
          category?: string | null
          created_at?: string
          featured_image?: string | null
          id?: string
          og_image?: string | null
          og_url?: string | null
          published_date?: string
          slug?: string
          twitter_image?: string | null
          twitter_url?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      insights_translations: {
        Row: {
          content: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          insights_id: string
          language_id: number
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          insights_id: string
          language_id: number
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          insights_id?: string
          language_id?: number
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insights_translations_insights_id_fkey"
            columns: ["insights_id"]
            isOneToOne: false
            referencedRelation: "insights"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insights_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_translations: {
        Row: {
          benefits: Json | null
          created_at: string | null
          cta_primary_text: string | null
          cta_secondary_text: string | null
          description: string | null
          features: Json | null
          id: string
          investment_id: string
          language_id: number
          short_description: string | null
          tagline: string | null
          testimonials: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          benefits?: Json | null
          created_at?: string | null
          cta_primary_text?: string | null
          cta_secondary_text?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          investment_id: string
          language_id: number
          short_description?: string | null
          tagline?: string | null
          testimonials?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          benefits?: Json | null
          created_at?: string | null
          cta_primary_text?: string | null
          cta_secondary_text?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          investment_id?: string
          language_id?: number
          short_description?: string | null
          tagline?: string | null
          testimonials?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investment_translations_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "investments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investment_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      investments: {
        Row: {
          created_at: string | null
          display_order: number | null
          featured_image: string | null
          id: string
          is_active: boolean | null
          logo: string | null
          og_image: string | null
          slug: string
          twitter_image: string | null
          updated_at: string | null
          website_url: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          featured_image?: string | null
          id?: string
          is_active?: boolean | null
          logo?: string | null
          og_image?: string | null
          slug: string
          twitter_image?: string | null
          updated_at?: string | null
          website_url: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          featured_image?: string | null
          id?: string
          is_active?: boolean | null
          logo?: string | null
          og_image?: string | null
          slug?: string
          twitter_image?: string | null
          updated_at?: string | null
          website_url?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          cover_letter: string | null
          created_at: string
          email: string
          id: string
          job_listing_id: string
          linkedin_url: string | null
          name: string
          phone: string | null
          portfolio_url: string | null
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string
          email: string
          id?: string
          job_listing_id: string
          linkedin_url?: string | null
          name: string
          phone?: string | null
          portfolio_url?: string | null
        }
        Update: {
          cover_letter?: string | null
          created_at?: string
          email?: string
          id?: string
          job_listing_id?: string
          linkedin_url?: string | null
          name?: string
          phone?: string | null
          portfolio_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_listing_id_fkey"
            columns: ["job_listing_id"]
            isOneToOne: false
            referencedRelation: "job_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_listing_translations: {
        Row: {
          benefits: string | null
          created_at: string
          full_description: string | null
          id: string
          job_listing_id: string
          language_id: number
          requirements: string | null
          short_description: string | null
          title: string
          updated_at: string
        }
        Insert: {
          benefits?: string | null
          created_at?: string
          full_description?: string | null
          id?: string
          job_listing_id: string
          language_id: number
          requirements?: string | null
          short_description?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          benefits?: string | null
          created_at?: string
          full_description?: string | null
          id?: string
          job_listing_id?: string
          language_id?: number
          requirements?: string | null
          short_description?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_listing_translations_job_listing_id_fkey"
            columns: ["job_listing_id"]
            isOneToOne: false
            referencedRelation: "job_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_listing_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      job_listings: {
        Row: {
          city: string
          created_at: string
          department: string
          display_order: number
          employment_type: string
          id: string
          is_active: boolean
          slug: string
          updated_at: string
        }
        Insert: {
          city: string
          created_at?: string
          department: string
          display_order?: number
          employment_type?: string
          id?: string
          is_active?: boolean
          slug: string
          updated_at?: string
        }
        Update: {
          city?: string
          created_at?: string
          department?: string
          display_order?: number
          employment_type?: string
          id?: string
          is_active?: boolean
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      languages: {
        Row: {
          code: string
          created_at: string | null
          id: number
          is_active: boolean | null
          is_default: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      learner_profiles: {
        Row: {
          billing_address: string | null
          billing_city: string | null
          billing_company: string | null
          billing_postcode: string | null
          company: string | null
          created_at: string
          email: string | null
          full_name: string | null
          job_title: string | null
          phone: string | null
          tax_office: string | null
          updated_at: string
          user_id: string
          vat_number: string | null
        }
        Insert: {
          billing_address?: string | null
          billing_city?: string | null
          billing_company?: string | null
          billing_postcode?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          job_title?: string | null
          phone?: string | null
          tax_office?: string | null
          updated_at?: string
          user_id: string
          vat_number?: string | null
        }
        Update: {
          billing_address?: string | null
          billing_city?: string | null
          billing_company?: string | null
          billing_postcode?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          job_title?: string | null
          phone?: string | null
          tax_office?: string | null
          updated_at?: string
          user_id?: string
          vat_number?: string | null
        }
        Relationships: []
      }
      metric_translations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          label: string | null
          language_id: number
          metric_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          label?: string | null
          language_id: number
          metric_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          label?: string | null
          language_id?: number
          metric_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metric_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metric_translations_metric_id_fkey"
            columns: ["metric_id"]
            isOneToOne: false
            referencedRelation: "metrics"
            referencedColumns: ["id"]
          },
        ]
      }
      metrics: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: number
        }
        Relationships: []
      }
      navigation_item_translations: {
        Row: {
          created_at: string | null
          description: string | null
          href: string | null
          id: string
          language_id: number
          navigation_item_id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          href?: string | null
          id?: string
          language_id: number
          navigation_item_id: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          href?: string | null
          id?: string
          language_id?: number
          navigation_item_id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "navigation_item_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "navigation_item_translations_navigation_item_id_fkey"
            columns: ["navigation_item_id"]
            isOneToOne: false
            referencedRelation: "navigation_items"
            referencedColumns: ["id"]
          },
        ]
      }
      navigation_items: {
        Row: {
          created_at: string | null
          display_order: number | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          menu_type: string
          parent_id: string | null
          target_blank: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          menu_type?: string
          parent_id?: string | null
          target_blank?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          menu_type?: string
          parent_id?: string | null
          target_blank?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "navigation_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "navigation_items"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          bunny_video_id: string | null
          canonical_url: string | null
          created_at: string
          featured_image: string | null
          id: string
          og_image: string | null
          og_url: string | null
          published_date: string
          slug: string
          thumbnail_url: string | null
          twitter_image: string | null
          twitter_url: string | null
          type: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          bunny_video_id?: string | null
          canonical_url?: string | null
          created_at?: string
          featured_image?: string | null
          id?: string
          og_image?: string | null
          og_url?: string | null
          published_date?: string
          slug: string
          thumbnail_url?: string | null
          twitter_image?: string | null
          twitter_url?: string | null
          type: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          bunny_video_id?: string | null
          canonical_url?: string | null
          created_at?: string
          featured_image?: string | null
          id?: string
          og_image?: string | null
          og_url?: string | null
          published_date?: string
          slug?: string
          thumbnail_url?: string | null
          twitter_image?: string | null
          twitter_url?: string | null
          type?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      news_translations: {
        Row: {
          content: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          language_id: number
          news_id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          language_id: number
          news_id: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          language_id?: number
          news_id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_item_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_item_translations_news_item_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      partner_category_translations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          language_id: number
          name: string | null
          partner_category_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          language_id: number
          name?: string | null
          partner_category_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          language_id?: number
          name?: string | null
          partner_category_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_category_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_category_translations_partner_category_id_fkey"
            columns: ["partner_category_id"]
            isOneToOne: false
            referencedRelation: "partner_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_partner_categories: {
        Row: {
          category: string
          created_at: string
          id: string
          partner_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          partner_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          partner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_partner_categories_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_translations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          language_id: number
          long_description: string | null
          name: string | null
          partner_id: string
          updated_at: string | null
          use_case: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          language_id: number
          long_description?: string | null
          name?: string | null
          partner_id: string
          updated_at?: string | null
          use_case?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          language_id?: number
          long_description?: string | null
          name?: string | null
          partner_id?: string
          updated_at?: string | null
          use_case?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_translations_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          benefits: string[] | null
          category: string
          contact_person: string | null
          display_order: number | null
          featured: boolean
          has_detail_page: boolean
          id: string
          integration_steps: string[] | null
          language_code: string | null
          logo: string
          og_image: string | null
          partnership_type: string | null
          slug: string | null
          twitter_image: string | null
        }
        Insert: {
          benefits?: string[] | null
          category: string
          contact_person?: string | null
          display_order?: number | null
          featured?: boolean
          has_detail_page?: boolean
          id?: string
          integration_steps?: string[] | null
          language_code?: string | null
          logo: string
          og_image?: string | null
          partnership_type?: string | null
          slug?: string | null
          twitter_image?: string | null
        }
        Update: {
          benefits?: string[] | null
          category?: string
          contact_person?: string | null
          display_order?: number | null
          featured?: boolean
          has_detail_page?: boolean
          id?: string
          integration_steps?: string[] | null
          language_code?: string | null
          logo?: string
          og_image?: string | null
          partnership_type?: string | null
          slug?: string | null
          twitter_image?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partners_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
        ]
      }
      product_translations: {
        Row: {
          created_at: string | null
          cta_button_text: string | null
          cta_section_description: string | null
          cta_section_title: string | null
          description: string | null
          features: Json | null
          id: string
          language_id: number
          page_description: string | null
          page_subtitle: string | null
          page_title: string | null
          product_id: string
          stats: Json | null
          testimonials: Json | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cta_button_text?: string | null
          cta_section_description?: string | null
          cta_section_title?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          language_id: number
          page_description?: string | null
          page_subtitle?: string | null
          page_title?: string | null
          product_id: string
          stats?: Json | null
          testimonials?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cta_button_text?: string | null
          cta_section_description?: string | null
          cta_section_title?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          language_id?: number
          page_description?: string | null
          page_subtitle?: string | null
          page_title?: string | null
          product_id?: string
          stats?: Json | null
          testimonials?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_translations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          canonical_url: string | null
          created_at: string
          display_order: number
          features: Json | null
          hero_image: string | null
          highlight_color: string | null
          id: string
          image_url: string | null
          og_image: string | null
          og_url: string | null
          page_background_color: string | null
          slug: string
          stats: Json | null
          testimonials: Json | null
          twitter_image: string | null
          twitter_url: string | null
          updated_at: string
          website_url: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          display_order?: number
          features?: Json | null
          hero_image?: string | null
          highlight_color?: string | null
          id?: string
          image_url?: string | null
          og_image?: string | null
          og_url?: string | null
          page_background_color?: string | null
          slug: string
          stats?: Json | null
          testimonials?: Json | null
          twitter_image?: string | null
          twitter_url?: string | null
          updated_at?: string
          website_url: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          display_order?: number
          features?: Json | null
          hero_image?: string | null
          highlight_color?: string | null
          id?: string
          image_url?: string | null
          og_image?: string | null
          og_url?: string | null
          page_background_color?: string | null
          slug?: string
          stats?: Json | null
          testimonials?: Json | null
          twitter_image?: string | null
          twitter_url?: string | null
          updated_at?: string
          website_url?: string
        }
        Relationships: []
      }
      redirects: {
        Row: {
          created_at: string
          id: string
          new_path: string
          old_path: string
          status_code: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          new_path: string
          old_path: string
          status_code?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          new_path?: string
          old_path?: string
          status_code?: number
          updated_at?: string
        }
        Relationships: []
      }
      registry: {
        Row: {
          can_manage_languages: boolean | null
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          can_manage_languages?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          can_manage_languages?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      route_seo_config: {
        Row: {
          canonical_url: string
          created_at: string | null
          description: string
          id: string
          keywords: string | null
          language_code: string
          og_image: string | null
          og_url: string
          page_type: string | null
          route_path: string
          title: string
          twitter_image: string | null
          twitter_url: string
          updated_at: string | null
        }
        Insert: {
          canonical_url: string
          created_at?: string | null
          description: string
          id?: string
          keywords?: string | null
          language_code: string
          og_image?: string | null
          og_url: string
          page_type?: string | null
          route_path: string
          title: string
          twitter_image?: string | null
          twitter_url: string
          updated_at?: string | null
        }
        Update: {
          canonical_url?: string
          created_at?: string | null
          description?: string
          id?: string
          keywords?: string | null
          language_code?: string
          og_image?: string | null
          og_url?: string
          page_type?: string | null
          route_path?: string
          title?: string
          twitter_image?: string | null
          twitter_url?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "route_seo_config_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      seminar_participants: {
        Row: {
          activity: string | null
          attendance_mode: string
          company: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          language: string | null
          legal_name: string | null
          needs_invoice: boolean
          notes: string | null
          paid_at: string | null
          payment_reference: string | null
          payment_status: string
          phone: string | null
          price: number | null
          registration_status: string
          seminar_id: string
          updated_at: string
          vat_number: string | null
        }
        Insert: {
          activity?: string | null
          attendance_mode?: string
          company?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          language?: string | null
          legal_name?: string | null
          needs_invoice?: boolean
          notes?: string | null
          paid_at?: string | null
          payment_reference?: string | null
          payment_status?: string
          phone?: string | null
          price?: number | null
          registration_status?: string
          seminar_id: string
          updated_at?: string
          vat_number?: string | null
        }
        Update: {
          activity?: string | null
          attendance_mode?: string
          company?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          language?: string | null
          legal_name?: string | null
          needs_invoice?: boolean
          notes?: string | null
          paid_at?: string | null
          payment_reference?: string | null
          payment_status?: string
          phone?: string | null
          price?: number | null
          registration_status?: string
          seminar_id?: string
          updated_at?: string
          vat_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seminar_participants_seminar_id_fkey"
            columns: ["seminar_id"]
            isOneToOne: false
            referencedRelation: "seminars"
            referencedColumns: ["id"]
          },
        ]
      }
      seminars: {
        Row: {
          allows_online: boolean
          allows_onsite: boolean
          created_at: string
          currency: string
          description: string | null
          display_order: number
          end_date: string
          end_time: string | null
          id: string
          instructor: string | null
          language: string
          price_online: number | null
          price_onsite: number
          seats: number
          sessions_label: string | null
          slug: string
          start_date: string
          start_time: string | null
          status: string
          subtitle: string | null
          title: string
          updated_at: string
          venue_address: string | null
          venue_name: string | null
        }
        Insert: {
          allows_online?: boolean
          allows_onsite?: boolean
          created_at?: string
          currency?: string
          description?: string | null
          display_order?: number
          end_date: string
          end_time?: string | null
          id?: string
          instructor?: string | null
          language?: string
          price_online?: number | null
          price_onsite: number
          seats?: number
          sessions_label?: string | null
          slug: string
          start_date: string
          start_time?: string | null
          status?: string
          subtitle?: string | null
          title: string
          updated_at?: string
          venue_address?: string | null
          venue_name?: string | null
        }
        Update: {
          allows_online?: boolean
          allows_onsite?: boolean
          created_at?: string
          currency?: string
          description?: string | null
          display_order?: number
          end_date?: string
          end_time?: string | null
          id?: string
          instructor?: string | null
          language?: string
          price_online?: number | null
          price_onsite?: number
          seats?: number
          sessions_label?: string | null
          slug?: string
          start_date?: string
          start_time?: string | null
          status?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
          venue_address?: string | null
          venue_name?: string | null
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          created_at: string | null
          description: string | null
          hero_image: string | null
          icon_name: string | null
          id: string
          name: string
          og_image: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          twitter_image: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          hero_image?: string | null
          icon_name?: string | null
          id?: string
          name: string
          og_image?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          twitter_image?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          hero_image?: string | null
          icon_name?: string | null
          id?: string
          name?: string
          og_image?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          twitter_image?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      service_category_faq_translations: {
        Row: {
          answer: string
          created_at: string | null
          faq_id: string
          id: string
          language_id: number
          question: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          faq_id: string
          id?: string
          language_id: number
          question: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          faq_id?: string
          id?: string
          language_id?: number
          question?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_category_faq_translations_faq_id_fkey"
            columns: ["faq_id"]
            isOneToOne: false
            referencedRelation: "service_category_faqs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_category_faq_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      service_category_faqs: {
        Row: {
          category_id: string
          created_at: string | null
          display_order: number
          id: string
          is_active: boolean
          updated_at: string | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_category_faqs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      service_category_translations: {
        Row: {
          category_id: string
          created_at: string | null
          description: string | null
          id: string
          language_id: number
          name: string | null
          updated_at: string | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          language_id: number
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          language_id?: number
          name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_category_translations_category_id_fkey1"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_category_translations_language_id_fkey1"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      service_clients: {
        Row: {
          client_id: string
          created_at: string
          display_order: number
          id: string
          is_featured: boolean
          service_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          display_order?: number
          id?: string
          is_featured?: boolean
          service_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          display_order?: number
          id?: string
          is_featured?: boolean
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_clients_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_clients_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_faq_translations: {
        Row: {
          answer: string
          created_at: string
          faq_id: string
          id: string
          language_id: number
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          faq_id: string
          id?: string
          language_id: number
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          faq_id?: string
          id?: string
          language_id?: number
          question?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_faq_translations_faq_id_fkey"
            columns: ["faq_id"]
            isOneToOne: false
            referencedRelation: "service_faqs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_faq_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      service_faqs: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          service_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          service_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          service_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_faqs_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_partners: {
        Row: {
          created_at: string
          display_order: number
          id: string
          partner_id: string
          service_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          partner_id: string
          service_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          partner_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_partners_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_partners_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_testimonial_translations: {
        Row: {
          created_at: string
          id: string
          language_id: number
          quote: string
          testimonial_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          language_id: number
          quote: string
          testimonial_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          language_id?: number
          quote?: string
          testimonial_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_testimonial_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_testimonial_translations_testimonial_id_fkey"
            columns: ["testimonial_id"]
            isOneToOne: false
            referencedRelation: "service_testimonials"
            referencedColumns: ["id"]
          },
        ]
      }
      service_testimonials: {
        Row: {
          author_company: string | null
          author_image: string | null
          author_name: string
          author_role: string | null
          client_id: string | null
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          rating: number | null
          service_id: string
          updated_at: string
        }
        Insert: {
          author_company?: string | null
          author_image?: string | null
          author_name: string
          author_role?: string | null
          client_id?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          rating?: number | null
          service_id: string
          updated_at?: string
        }
        Update: {
          author_company?: string | null
          author_image?: string | null
          author_name?: string
          author_role?: string | null
          client_id?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          rating?: number | null
          service_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_testimonials_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_testimonials_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_translations: {
        Row: {
          child_services_intro: string | null
          created_at: string | null
          id: string
          language_id: number
          long_description: string | null
          meta_description: string | null
          seo_h2_title: string | null
          seo_title: string | null
          service_id: string
          short_description: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          child_services_intro?: string | null
          created_at?: string | null
          id?: string
          language_id: number
          long_description?: string | null
          meta_description?: string | null
          seo_h2_title?: string | null
          seo_title?: string | null
          service_id: string
          short_description?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          child_services_intro?: string | null
          created_at?: string | null
          id?: string
          language_id?: number
          long_description?: string | null
          meta_description?: string | null
          seo_h2_title?: string | null
          seo_title?: string | null
          service_id?: string
          short_description?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_service_translations_language_id"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_service_translations_service_id"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_uvp_translations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          label: string
          language_id: number
          updated_at: string
          uvp_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          label: string
          language_id: number
          updated_at?: string
          uvp_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          label?: string
          language_id?: number
          updated_at?: string
          uvp_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_uvp_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_uvp_translations_uvp_id_fkey"
            columns: ["uvp_id"]
            isOneToOne: false
            referencedRelation: "service_uvps"
            referencedColumns: ["id"]
          },
        ]
      }
      service_uvps: {
        Row: {
          created_at: string
          display_order: number
          icon_name: string
          id: string
          is_active: boolean
          metric_value: string
          service_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          icon_name?: string
          id?: string
          is_active?: boolean
          metric_value: string
          service_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          icon_name?: string
          id?: string
          is_active?: boolean
          metric_value?: string
          service_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_uvps_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          canonical_url: string | null
          category_id: string
          created_at: string
          display_order: number
          emoji: string
          featured_image: string | null
          icon_name: string | null
          id: string
          is_parent: boolean | null
          is_seo_only: boolean
          keywords: string[] | null
          og_image: string | null
          og_url: string | null
          parent_service_id: string | null
          slug: string
          twitter_image: string | null
          twitter_url: string | null
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          category_id: string
          created_at?: string
          display_order?: number
          emoji: string
          featured_image?: string | null
          icon_name?: string | null
          id?: string
          is_parent?: boolean | null
          is_seo_only?: boolean
          keywords?: string[] | null
          og_image?: string | null
          og_url?: string | null
          parent_service_id?: string | null
          slug: string
          twitter_image?: string | null
          twitter_url?: string | null
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          category_id?: string
          created_at?: string
          display_order?: number
          emoji?: string
          featured_image?: string | null
          icon_name?: string | null
          id?: string
          is_parent?: boolean | null
          is_seo_only?: boolean
          keywords?: string[] | null
          og_image?: string | null
          og_url?: string | null
          parent_service_id?: string | null
          slug?: string
          twitter_image?: string | null
          twitter_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_parent_service_id_fkey"
            columns: ["parent_service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services_categories: {
        Row: {
          created_at: string
          id: string
          language_code: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          language_code?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          language_code?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_categories_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
        ]
      }
      services_categories_translations: {
        Row: {
          category_id: string
          created_at: string | null
          description: string | null
          id: string
          language_id: number
          name: string | null
          updated_at: string | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          language_id: number
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          language_id?: number
          name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_category_translations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "services_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_category_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      services_translations: {
        Row: {
          created_at: string | null
          id: string
          language_id: number
          long_description: string | null
          service_id: string
          short_description: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          language_id: number
          long_description?: string | null
          service_id: string
          short_description?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          language_id?: number
          long_description?: string | null
          service_id?: string
          short_description?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_translations_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      startup_applications: {
        Row: {
          business_model: string
          business_model_other: string | null
          competitive_advantage: string
          created_at: string
          email: string
          evaluation_signals: string
          founder_name: string
          id: string
          ip_address: string | null
          is_live: string | null
          language: string | null
          live_product_credentials: string | null
          live_product_url: string | null
          market_tam_sam_som: string
          pitch_deck_filename: string | null
          pitch_deck_link: string | null
          pitch_deck_url: string | null
          problem_solving: string
          stage: string
          startup_name: string
          startup_website: string | null
          target_users: string
          uniqueness: string
          user_agent: string | null
          vertical: string
        }
        Insert: {
          business_model: string
          business_model_other?: string | null
          competitive_advantage: string
          created_at?: string
          email: string
          evaluation_signals: string
          founder_name: string
          id?: string
          ip_address?: string | null
          is_live?: string | null
          language?: string | null
          live_product_credentials?: string | null
          live_product_url?: string | null
          market_tam_sam_som: string
          pitch_deck_filename?: string | null
          pitch_deck_link?: string | null
          pitch_deck_url?: string | null
          problem_solving: string
          stage: string
          startup_name: string
          startup_website?: string | null
          target_users: string
          uniqueness: string
          user_agent?: string | null
          vertical: string
        }
        Update: {
          business_model?: string
          business_model_other?: string | null
          competitive_advantage?: string
          created_at?: string
          email?: string
          evaluation_signals?: string
          founder_name?: string
          id?: string
          ip_address?: string | null
          is_live?: string | null
          language?: string | null
          live_product_credentials?: string | null
          live_product_url?: string | null
          market_tam_sam_som?: string
          pitch_deck_filename?: string | null
          pitch_deck_link?: string | null
          pitch_deck_url?: string | null
          problem_solving?: string
          stage?: string
          startup_name?: string
          startup_website?: string | null
          target_users?: string
          uniqueness?: string
          user_agent?: string | null
          vertical?: string
        }
        Relationships: []
      }
      static_page_translations: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          language_id: number
          meta_description: string | null
          meta_title: string | null
          static_page_id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          language_id: number
          meta_description?: string | null
          meta_title?: string | null
          static_page_id: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          language_id?: number
          meta_description?: string | null
          meta_title?: string | null
          static_page_id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "static_page_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "static_page_translations_static_page_id_fkey"
            columns: ["static_page_id"]
            isOneToOne: false
            referencedRelation: "static_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      static_pages: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          is_published: boolean
          og_image: string | null
          page_type: string
          slug: string
          twitter_image: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_published?: boolean
          og_image?: string | null
          page_type: string
          slug: string
          twitter_image?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_published?: boolean
          og_image?: string | null
          page_type?: string
          slug?: string
          twitter_image?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      team_member_translations: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string
          job_title: string | null
          language_id: number
          name: string | null
          role_description: string | null
          team_member_id: string
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: string
          job_title?: string | null
          language_id: number
          name?: string | null
          role_description?: string | null
          team_member_id: string
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string
          job_title?: string | null
          language_id?: number
          name?: string | null
          role_description?: string | null
          team_member_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_member_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_member_translations_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          achievements: string[] | null
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_leadership: boolean | null
          slug: string | null
          specializations: string[] | null
          updated_at: string | null
        }
        Insert: {
          achievements?: string[] | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_leadership?: boolean | null
          slug?: string | null
          specializations?: string[] | null
          updated_at?: string | null
        }
        Update: {
          achievements?: string[] | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_leadership?: boolean | null
          slug?: string | null
          specializations?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          content: string | null
          created_at: string | null
          field_name: string
          id: string
          language_code: string
          record_id: string
          table_name: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          field_name: string
          id?: string
          language_code: string
          record_id: string
          table_name: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          field_name?: string
          id?: string
          language_code?: string
          record_id?: string
          table_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "translations_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      video_course_purchases: {
        Row: {
          amount_eur: number
          course_id: string
          created_at: string
          id: string
          provider: string | null
          provider_ref: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_eur?: number
          course_id: string
          created_at?: string
          id?: string
          provider?: string | null
          provider_ref?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_eur?: number
          course_id?: string
          created_at?: string
          id?: string
          provider?: string | null
          provider_ref?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_course_purchases_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "video_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      video_courses: {
        Row: {
          cover_image: string | null
          created_at: string
          description: string | null
          display_order: number
          id: string
          language_code: string
          price_eur: number
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          language_code?: string
          price_eur?: number
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          language_code?: string
          price_eur?: number
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _lang_id_from_code: { Args: { p_language_code: string }; Returns: number }
      admin_create_content_backup: {
        Args: { backup_name: string }
        Returns: boolean
      }
      admin_delete_content: {
        Args: { content_id: string; table_name: string }
        Returns: boolean
      }
      admin_get_content_stats: {
        Args: never
        Returns: {
          content_type: string
          draft_count: number
          published_count: number
          total_count: number
        }[]
      }
      admin_get_recent_operations: {
        Args: { limit_count?: number }
        Returns: {
          created_at: string
          description: string
          id: string
          operation_type: string
          performed_by_email: string
        }[]
      }
      admin_get_users_with_roles: {
        Args: never
        Returns: {
          email: string
          roles: string[]
          user_id: string
        }[]
      }
      admin_grant_self_admin: { Args: never; Returns: boolean }
      admin_grant_user_role: {
        Args: {
          target_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Returns: boolean
      }
      categorize_blog_content: {
        Args: { p_content: string; p_title: string }
        Returns: string
      }
      check_auth_rate_limit: { Args: { user_ip: unknown }; Returns: boolean }
      create_initial_admin_role: {
        Args: { admin_user_id: string }
        Returns: boolean
      }
      generate_client_slug: { Args: { client_name: string }; Returns: string }
      generate_slug: { Args: { input_text: string }; Returns: string }
      generate_slug_from_text: { Args: { input_text: string }; Returns: string }
      get_admin_dashboard_stats: {
        Args: never
        Returns: {
          total_blog_posts: number
          total_clients: number
          total_credentials: number
          total_news_items: number
          total_partners: number
          total_products: number
          total_services: number
          total_team_members: number
        }[]
      }
      get_ai_usage_stats: {
        Args: { p_end_date?: string; p_start_date?: string }
        Returns: {
          avg_execution_time_ms: number
          failed_requests: number
          function_type: string
          model_used: string
          successful_requests: number
          total_prompt_length: number
          total_requests: number
          total_response_length: number
        }[]
      }
      get_all_blog_posts_with_translation: {
        Args: { p_language_code: string }
        Returns: {
          author: string
          category: string
          content: string
          excerpt: string
          featured_image: string
          id: string
          language_code: string
          published_date: string
          slug: string
          title: string
        }[]
      }
      get_all_clients_with_translation: {
        Args: { p_language_code: string }
        Returns: {
          background_image: string
          case_study_challenge: string
          case_study_images: Json
          case_study_results: Json
          case_study_solution: string
          case_study_team_size: string
          case_study_timeline: string
          case_study_videos: Json
          country: string
          created_at: string
          description: string
          display_order: number
          featured: boolean
          id: string
          industry: string
          logo: string
          name: string
          product_categories: string[]
          product_category: string
          slug: string
          updated_at: string
          website: string
        }[]
      }
      get_all_company_facts_with_translation: {
        Args: { p_language_code: string }
        Returns: {
          description: string
          display_order: number
          icon_name: string
          id: string
          key: string
          label: string
          value: string
        }[]
      }
      get_all_company_info_with_translation: {
        Args: { p_language_code: string }
        Returns: {
          approach: string
          company_values: string[]
          content: string
          founded_year: number
          history: string
          id: string
          image_url: string
          mission: string
          team_intro: string
          title: string
          vision: string
        }[]
      }
      get_all_company_values_with_translation: {
        Args: { p_language_code: string }
        Returns: {
          description: string
          display_order: number
          icon_name: string
          id: string
          title: string
        }[]
      }
      get_all_credentials_with_translation: {
        Args: { p_language_code: string }
        Returns: {
          description: string
          display_order: number
          icon_name: string
          id: string
          image_url: string
          title: string
        }[]
      }
      get_all_insights_with_translation: {
        Args: { p_language_code: string }
        Returns: {
          author: string
          category: string
          content: string
          excerpt: string
          featured_image: string
          id: string
          published_date: string
          slug: string
          title: string
          type: string
          updated_at: string
        }[]
      }
      get_all_investments_with_translation: {
        Args: { p_language_code: string }
        Returns: {
          benefits: Json
          cta_primary_text: string
          cta_secondary_text: string
          description: string
          display_order: number
          featured_image: string
          features: Json
          id: string
          is_active: boolean
          logo: string
          short_description: string
          slug: string
          tagline: string
          testimonials: Json
          title: string
          website_url: string
        }[]
      }
      get_all_metrics_with_translation: {
        Args: { p_language_code: string }
        Returns: {
          description: string
          id: string
          key: string
          label: string
          value: number
        }[]
      }
      get_all_news_items_with_translation: {
        Args: { p_language_code: string }
        Returns: {
          bunny_video_id: string
          content: string
          created_at: string
          excerpt: string
          featured_image: string
          id: string
          published_date: string
          slug: string
          thumbnail_url: string
          title: string
          type: string
          updated_at: string
          video_url: string
        }[]
      }
      get_all_partners_with_translation: {
        Args: { p_language_code: string }
        Returns: {
          benefits: string[]
          category: string
          contact_person: string
          description: string
          display_order: number
          featured: boolean
          has_detail_page: boolean
          id: string
          integration_steps: string[]
          logo: string
          long_description: string
          name: string
          partnership_type: string
          use_case: string
        }[]
      }
      get_all_partners_with_translation_enhanced: {
        Args: { p_language_code: string }
        Returns: {
          benefits: string[]
          category: string
          contact_person: string
          description: string
          display_order: number
          featured: boolean
          has_detail_page: boolean
          id: string
          integration_steps: string[]
          logo: string
          long_description: string
          name: string
          partnership_type: string
          use_case: string
        }[]
      }
      get_all_products_with_translation: {
        Args: { p_language_code: string }
        Returns: {
          cta_button_text: string
          cta_section_description: string
          cta_section_title: string
          description: string
          display_order: number
          features: Json
          hero_image: string
          highlight_color: string
          id: string
          image_url: string
          page_background_color: string
          page_description: string
          page_subtitle: string
          page_title: string
          slug: string
          stats: Json
          testimonials: Json
          title: string
          website_url: string
        }[]
      }
      get_all_service_categories: {
        Args: { p_language_code: string }
        Returns: {
          description: string
          id: string
          name: string
          slug: string
        }[]
      }
      get_all_service_categories_joined:
        | {
            Args: { p_language_code: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.get_all_service_categories_joined(p_language_code => text), public.get_all_service_categories_joined(p_language_code => varchar). Try renaming the parameters or the function itself in the database so function overloading can be resolved"[]
          }
        | {
            Args: { p_language_code?: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.get_all_service_categories_joined(p_language_code => text), public.get_all_service_categories_joined(p_language_code => varchar). Try renaming the parameters or the function itself in the database so function overloading can be resolved"[]
          }
      get_all_team_members_admin: {
        Args: { p_language_code: string }
        Returns: {
          achievements: string[]
          bio: string
          display_order: number
          id: string
          image_url: string
          is_leadership: boolean
          job_position: string
          name: string
          role_description: string
          specializations: string[]
        }[]
      }
      get_all_team_members_public: {
        Args: { p_language_code: string }
        Returns: {
          achievements: string[]
          bio: string
          display_order: number
          id: string
          image_url: string
          is_leadership: boolean
          job_position: string
          name: string
          role_description: string
          specializations: string[]
        }[]
      }
      get_blog_post_by_id_with_translation: {
        Args: { p_id: string; p_language_code: string }
        Returns: {
          author: string
          category: string
          content: string
          excerpt: string
          featured_image: string
          id: string
          language_code: string
          published_date: string
          slug: string
          title: string
        }[]
      }
      get_blog_post_by_slug_with_translation: {
        Args: { p_language_code: string; p_slug: string }
        Returns: {
          author: string
          category: string
          content: string
          excerpt: string
          featured_image: string
          id: string
          language_code: string
          published_date: string
          slug: string
          title: string
        }[]
      }
      get_blog_post_with_translation: {
        Args: { p_language_code: string; p_post_id: string }
        Returns: {
          author: string
          category: string
          content: string
          excerpt: string
          featured_image: string
          id: string
          language_code: string
          published_date: string
          slug: string
          title: string
          type: string
        }[]
      }
      get_client_by_slug_with_translation: {
        Args: { p_language_code: string; p_slug: string }
        Returns: {
          background_image: string
          case_study_challenge: string
          case_study_images: Json
          case_study_results: Json
          case_study_solution: string
          case_study_team_size: string
          case_study_timeline: string
          case_study_videos: Json
          country: string
          created_at: string
          description: string
          display_order: number
          featured: boolean
          id: string
          industry: string
          logo: string
          name: string
          product_categories: string[]
          product_category: string
          slug: string
          updated_at: string
          website: string
        }[]
      }
      get_client_categories:
        | { Args: never; Returns: string[] }
        | { Args: { p_client_id: string }; Returns: string[] }
      get_client_with_translation: {
        Args: { p_client_id: string; p_language_code: string }
        Returns: {
          background_image: string
          case_study_challenge: string
          case_study_images: Json
          case_study_results: Json
          case_study_solution: string
          case_study_team_size: string
          case_study_timeline: string
          case_study_videos: Json
          country: string
          created_at: string
          description: string
          display_order: number
          featured: boolean
          id: string
          industry: string
          logo: string
          name: string
          product_categories: string[]
          product_category: string
          slug: string
          updated_at: string
          website: string
        }[]
      }
      get_clients_by_category_with_translation: {
        Args: { p_category: string; p_language_code: string }
        Returns: {
          background_image: string
          case_study_challenge: string
          case_study_images: Json
          case_study_results: Json
          case_study_solution: string
          case_study_team_size: string
          case_study_timeline: string
          case_study_videos: Json
          country: string
          description: string
          display_order: number
          featured: boolean
          id: string
          industry: string
          logo: string
          name: string
          product_category: string
          testimonial: string
          website: string
        }[]
      }
      get_company_value_with_translation: {
        Args: { p_language_code: string; p_value_id: string }
        Returns: {
          description: string
          display_order: number
          icon_name: string
          id: string
          title: string
        }[]
      }
      get_contact_info_with_translation: {
        Args: { p_language_code: string }
        Returns: {
          address: string
          description: string
          display_order: number
          id: string
          info_type: string
          is_primary: boolean
          label: string
          value: string
        }[]
      }
      get_credential_with_translation: {
        Args: { p_credential_id: string; p_language_code: string }
        Returns: {
          description: string
          display_order: number
          icon_name: string
          id: string
          image_url: string
          title: string
        }[]
      }
      get_current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_default_language: { Args: never; Returns: string }
      get_hero_content_by_page_with_translation: {
        Args: { p_language_code: string; p_page_name: string }
        Returns: {
          background_image: string
          background_type: string
          background_video: string
          bunny_video_desktop: string
          bunny_video_mobile: string
          cta_link: string
          cta_text: string
          desktop_video_id: string
          heading: string
          id: string
          mobile_video_id: string
          page_name: string
          subheading: string
        }[]
      }
      get_hero_content_with_translation: {
        Args: { p_hero_content_id: string; p_language_code: string }
        Returns: {
          background_type: string
          cta_link: string
          cta_text: string
          heading: string
          id: string
          page_name: string
          subheading: string
        }[]
      }
      get_insight_by_slug_with_translation: {
        Args: { p_language_code: string; p_slug: string }
        Returns: {
          author: string
          content: string
          excerpt: string
          featured_image: string
          id: string
          published_date: string
          slug: string
          title: string
          type: string
          updated_at: string
        }[]
      }
      get_investment_by_slug_with_translation: {
        Args: { p_language_code: string; p_slug: string }
        Returns: {
          benefits: Json
          cta_primary_text: string
          cta_secondary_text: string
          description: string
          display_order: number
          featured_image: string
          features: Json
          id: string
          is_active: boolean
          logo: string
          short_description: string
          slug: string
          tagline: string
          testimonials: Json
          title: string
          website_url: string
        }[]
      }
      get_language_id: { Args: { language_code: string }; Returns: number }
      get_metric_with_translation: {
        Args: { p_language_code: string; p_metric_id: string }
        Returns: {
          description: string
          id: string
          key: string
          label: string
          value: number
        }[]
      }
      get_news_item_by_slug_with_translation: {
        Args: { p_language_code?: string; p_slug: string }
        Returns: {
          bunny_video_id: string
          content: string
          created_at: string
          excerpt: string
          featured_image: string
          id: string
          published_date: string
          slug: string
          thumbnail_url: string
          title: string
          type: string
          updated_at: string
          video_url: string
        }[]
      }
      get_news_item_with_translation: {
        Args: { p_item_id: string; p_language_code: string }
        Returns: {
          bunny_video_id: string
          content: string
          created_at: string
          excerpt: string
          featured_image: string
          id: string
          published_date: string
          slug: string
          thumbnail_url: string
          title: string
          type: string
          updated_at: string
          video_url: string
        }[]
      }
      get_partner_categories: {
        Args: { p_partner_id: string }
        Returns: string[]
      }
      get_partner_with_translation: {
        Args: { p_language_code: string; p_partner_id: string }
        Returns: {
          benefits: string[]
          category: string
          contact_person: string
          description: string
          display_order: number
          featured: boolean
          has_detail_page: boolean
          id: string
          integration_steps: string[]
          logo: string
          long_description: string
          name: string
          partnership_type: string
          use_case: string
        }[]
      }
      get_product_by_slug_with_translation: {
        Args: { p_language_code: string; p_slug: string }
        Returns: {
          cta_button_text: string
          cta_section_description: string
          cta_section_title: string
          description: string
          display_order: number
          features: Json
          hero_image: string
          highlight_color: string
          id: string
          image_url: string
          page_background_color: string
          page_description: string
          page_subtitle: string
          page_title: string
          slug: string
          stats: Json
          testimonials: Json
          title: string
          website_url: string
        }[]
      }
      get_product_with_translation: {
        Args: { p_language_code: string; p_product_id: string }
        Returns: {
          cta_button_text: string
          cta_section_description: string
          cta_section_title: string
          description: string
          display_order: number
          features: Json
          hero_image: string
          highlight_color: string
          id: string
          image_url: string
          page_background_color: string
          page_description: string
          page_subtitle: string
          page_title: string
          slug: string
          stats: Json
          testimonials: Json
          title: string
          website_url: string
        }[]
      }
      get_route_seo_config: {
        Args: { p_language_code?: string; p_route_path: string }
        Returns: {
          canonical_url: string
          created_at: string
          description: string
          id: string
          keywords: string
          language_code: string
          og_image: string
          og_url: string
          page_type: string
          route_path: string
          title: string
          twitter_image: string
          twitter_url: string
          updated_at: string
        }[]
      }
      get_service_by_slug: {
        Args: { p_language_code: string; p_slug: string }
        Returns: {
          category_id: string
          display_order: number
          emoji: string
          id: string
          long_description: string
          short_description: string
          slug: string
          title: string
        }[]
      }
      get_service_by_slug_simple: {
        Args: { p_language_code?: string; p_slug: string }
        Returns: {
          category_id: string
          child_services_intro: string
          display_order: number
          featured_image: string
          icon_name: string
          id: string
          long_description: string
          meta_description: string
          seo_h2_title: string
          seo_title: string
          short_description: string
          slug: string
          title: string
        }[]
      }
      get_service_by_slug_with_translation_fixed: {
        Args: { p_language_code?: string; p_slug: string }
        Returns: {
          category_id: string
          created_at: string
          display_order: number
          emoji: string
          id: string
          long_description: string
          short_description: string
          slug: string
          title: string
          updated_at: string
        }[]
      }
      get_service_case_studies: {
        Args: { p_language_code?: string; p_service_id: string }
        Returns: {
          client_description: string
          client_id: string
          client_logo: string
          client_name: string
          client_slug: string
          display_order: number
          id: string
          is_featured: boolean
        }[]
      }
      get_service_category_by_slug: {
        Args: { p_language_code: string; p_slug: string }
        Returns: {
          description: string
          id: string
          name: string
          slug: string
        }[]
      }
      get_service_category_by_slug_simple: {
        Args: { p_language_code?: string; p_slug: string }
        Returns: {
          description: string
          id: string
          name: string
          slug: string
        }[]
      }
      get_service_category_with_translation: {
        Args: { p_category_id: string; p_language_code: string }
        Returns: {
          description: string
          id: string
          name: string
          slug: string
        }[]
      }
      get_service_faqs: {
        Args: { p_language_code?: string; p_service_id: string }
        Returns: {
          answer: string
          display_order: number
          id: string
          question: string
          service_id: string
        }[]
      }
      get_service_partners: {
        Args: { p_service_id: string }
        Returns: {
          display_order: number
          id: string
          partner_id: string
          partner_logo: string
          partner_name: string
          partner_slug: string
        }[]
      }
      get_service_testimonials: {
        Args: { p_language_code?: string; p_service_id: string }
        Returns: {
          author_company: string
          author_image: string
          author_name: string
          author_role: string
          client_logo: string
          display_order: number
          id: string
          quote: string
          rating: number
          service_id: string
        }[]
      }
      get_service_uvps: {
        Args: { p_language_code?: string; p_service_id: string }
        Returns: {
          description: string
          display_order: number
          icon_name: string
          id: string
          label: string
          metric_value: string
          service_id: string
        }[]
      }
      get_service_with_translation:
        | {
            Args: { p_language_code: string; p_service_id: string }
            Returns: {
              category_id: string
              created_at: string
              display_order: number
              emoji: string
              id: string
              long_description: string
              short_description: string
              slug: string
              title: string
              updated_at: string
            }[]
          }
        | {
            Args: { p_language_code: string; p_service_id: string }
            Returns: {
              category_id: string
              display_order: number
              emoji: string
              id: string
              long_description: string
              short_description: string
              slug: string
              title: string
            }[]
          }
      get_services_by_category_simple: {
        Args: { p_category_slug: string; p_language?: string }
        Returns: {
          category_id: string
          description: string
          display_order: number
          featured_image: string
          icon_name: string
          id: string
          short_description: string
          slug: string
          title: string
        }[]
      }
      get_services_by_category_with_translation: {
        Args: { p_category_id: string; p_language_code: string }
        Returns: {
          category_id: string
          display_order: number
          emoji: string
          id: string
          long_description: string
          short_description: string
          slug: string
          title: string
        }[]
      }
      get_services_hierarchical: {
        Args: { p_category_slug: string; p_language?: string }
        Returns: {
          display_order: number
          featured_image: string
          icon_name: string
          id: string
          is_parent: boolean
          parent_service_id: string
          parent_slug: string
          short_description: string
          slug: string
          title: string
        }[]
      }
      get_static_page_with_translation: {
        Args: { p_language_code: string; p_slug: string }
        Returns: {
          content: string
          id: string
          is_published: boolean
          meta_description: string
          meta_title: string
          page_type: string
          slug: string
          title: string
        }[]
      }
      get_team_member_with_translation: {
        Args: { p_language_code: string; p_team_member_id: string }
        Returns: {
          achievements: string[]
          bio: string
          display_order: number
          email: string
          github_url: string
          id: string
          image_url: string
          instagram_url: string
          is_leadership: boolean
          job_position: string
          linkedin_url: string
          name: string
          role_description: string
          specializations: string[]
          twitter_url: string
        }[]
      }
      get_translation: {
        Args: {
          p_field_name: string
          p_language_code: string
          p_record_id: string
          p_table_name: string
        }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_user: { Args: never; Returns: boolean }
      migrate_blog_post_translations: { Args: never; Returns: number }
      migrate_client_translations: { Args: never; Returns: number }
      migrate_company_value_translations: { Args: never; Returns: number }
      migrate_credential_translations: { Args: never; Returns: number }
      migrate_hero_content_translations: { Args: never; Returns: number }
      migrate_metric_translations: { Args: never; Returns: number }
      migrate_news_item_translations: { Args: never; Returns: number }
      migrate_product_translations: { Args: never; Returns: number }
      migrate_service_category_translations: { Args: never; Returns: number }
      migrate_service_translations: { Args: never; Returns: number }
      migrate_team_member_translations: { Args: never; Returns: number }
      newadmin_delete_client: { Args: { p_id: string }; Returns: boolean }
      newadmin_delete_company_fact: {
        Args: { p_id: string }
        Returns: undefined
      }
      newadmin_delete_company_metric: {
        Args: { p_id: string }
        Returns: undefined
      }
      newadmin_delete_company_value: {
        Args: { p_id: string }
        Returns: undefined
      }
      newadmin_delete_contact_info: {
        Args: { p_id: string }
        Returns: undefined
      }
      newadmin_delete_credential: { Args: { p_id: string }; Returns: boolean }
      newadmin_delete_insight: { Args: { p_id: string }; Returns: boolean }
      newadmin_delete_investment: { Args: { p_id: string }; Returns: boolean }
      newadmin_delete_navigation_item: {
        Args: { p_id: string }
        Returns: undefined
      }
      newadmin_delete_news: { Args: { p_id: string }; Returns: boolean }
      newadmin_delete_partner: { Args: { p_id: string }; Returns: boolean }
      newadmin_delete_product: { Args: { p_id: string }; Returns: boolean }
      newadmin_delete_service: { Args: { p_id: string }; Returns: boolean }
      newadmin_delete_service_category: {
        Args: { p_id: string }
        Returns: undefined
      }
      newadmin_delete_team_member: { Args: { p_id: string }; Returns: boolean }
      newadmin_get_all_clients: {
        Args: never
        Returns: {
          background_image: string
          case_study_team_size: string
          case_study_timeline: string
          categories: string[]
          country: string
          created_at: string
          display_order: number
          featured: boolean
          id: string
          industry: string
          logo: string
          product_category: string
          slug: string
          translations: Json
          updated_at: string
          website: string
        }[]
      }
      newadmin_get_all_company_facts: {
        Args: never
        Returns: {
          display_order: number
          icon_name: string
          id: string
          key: string
          translations: Json
          value: string
        }[]
      }
      newadmin_get_all_company_metrics: {
        Args: never
        Returns: {
          display_order: number
          icon_name: string
          id: string
          translations: Json
        }[]
      }
      newadmin_get_all_company_testimonials: {
        Args: never
        Returns: {
          display_order: number
          id: string
          image_url: string
          translations: Json
        }[]
      }
      newadmin_get_all_company_values: {
        Args: never
        Returns: {
          display_order: number
          icon_name: string
          id: string
          translations: Json
        }[]
      }
      newadmin_get_all_contact_info: {
        Args: never
        Returns: {
          display_order: number
          id: string
          info_type: string
          is_primary: boolean
          translations: Json
        }[]
      }
      newadmin_get_all_credentials: {
        Args: never
        Returns: {
          display_order: number
          icon_name: string
          id: string
          image_url: string
          translations: Json
        }[]
      }
      newadmin_get_all_hero_content: {
        Args: never
        Returns: {
          background_image: string
          background_type: string
          background_video: string
          cta_link: string
          id: string
          page_name: string
          translations: Json
        }[]
      }
      newadmin_get_all_insights: {
        Args: never
        Returns: {
          author: string
          featured_image: string
          id: string
          published_date: string
          slug: string
          translations: Json
          type: string
        }[]
      }
      newadmin_get_all_investments: {
        Args: never
        Returns: {
          display_order: number
          featured_image: string
          id: string
          is_active: boolean
          logo: string
          slug: string
          translations: Json
          website_url: string
        }[]
      }
      newadmin_get_all_navigation_items: {
        Args: never
        Returns: {
          display_order: number
          icon_name: string
          id: string
          is_active: boolean
          menu_type: string
          parent_id: string
          target_blank: boolean
          translations: Json
        }[]
      }
      newadmin_get_all_news: {
        Args: never
        Returns: {
          bunny_video_id: string
          featured_image: string
          id: string
          published_date: string
          slug: string
          thumbnail_url: string
          translations: Json
          type: string
          video_url: string
        }[]
      }
      newadmin_get_all_partners: {
        Args: never
        Returns: {
          benefits: string[]
          categories: string[]
          category: string
          contact_person: string
          display_order: number
          featured: boolean
          has_detail_page: boolean
          id: string
          integration_steps: string[]
          language_code: string
          logo: string
          partnership_type: string
          slug: string
          translations: Json
        }[]
      }
      newadmin_get_all_products: {
        Args: never
        Returns: {
          display_order: number
          hero_image: string
          id: string
          image_url: string
          slug: string
          translations: Json
          website_url: string
        }[]
      }
      newadmin_get_all_service_categories: {
        Args: never
        Returns: {
          id: string
          name: string
          slug: string
        }[]
      }
      newadmin_get_all_services: {
        Args: { p_language_code?: string }
        Returns: {
          category_id: string
          category_name: string
          display_order: number
          emoji: string
          id: string
          language_code: string
          long_description: string
          short_description: string
          slug: string
          title: string
        }[]
      }
      newadmin_get_all_static_pages: {
        Args: never
        Returns: {
          id: string
          is_published: boolean
          page_type: string
          slug: string
          translations: Json
        }[]
      }
      newadmin_get_all_team_members: {
        Args: never
        Returns: {
          achievements: string[]
          display_order: number
          id: string
          image_url: string
          is_leadership: boolean
          slug: string
          specializations: string[]
          translations: Json
        }[]
      }
      newadmin_get_company_info: {
        Args: never
        Returns: {
          founded_year: number
          id: string
          image_url: string
          translations: Json
        }[]
      }
      newadmin_update_client: {
        Args: {
          p_background_image: string
          p_case_study_team_size: string
          p_case_study_timeline: string
          p_categories: string[]
          p_country: string
          p_display_order: number
          p_featured: boolean
          p_id: string
          p_industry: string
          p_logo: string
          p_product_category: string
          p_slug: string
          p_translations: Json
          p_website: string
        }
        Returns: string
      }
      newadmin_update_company_fact: {
        Args: {
          p_display_order: number
          p_icon_name: string
          p_id: string
          p_key: string
          p_translations: string
          p_value: string
        }
        Returns: undefined
      }
      newadmin_update_company_info: {
        Args: {
          p_founded_year: number
          p_id: string
          p_image_url: string
          p_translations: Json
        }
        Returns: boolean
      }
      newadmin_update_company_metric: {
        Args: {
          p_display_order: number
          p_icon_name: string
          p_id: string
          p_translations: string
        }
        Returns: undefined
      }
      newadmin_update_company_testimonial: {
        Args: {
          p_display_order: number
          p_id: string
          p_image_url: string
          p_translations: string
        }
        Returns: undefined
      }
      newadmin_update_company_value:
        | {
            Args: {
              p_display_order: number
              p_icon_name: string
              p_id: string
              p_translations: Json
            }
            Returns: string
          }
        | {
            Args: {
              p_display_order: number
              p_icon_name: string
              p_id: string
              p_translations: string
            }
            Returns: undefined
          }
      newadmin_update_contact_info: {
        Args: {
          p_display_order: number
          p_id: string
          p_info_type: string
          p_is_primary: boolean
          p_translations: string
        }
        Returns: undefined
      }
      newadmin_update_credential: {
        Args: {
          p_display_order?: number
          p_icon_name?: string
          p_id: string
          p_image_url?: string
          p_translations?: Json
        }
        Returns: boolean
      }
      newadmin_update_hero_content: {
        Args: {
          p_background_image: string
          p_background_type: string
          p_background_video: string
          p_cta_link: string
          p_id: string
          p_page_name: string
          p_translations: Json
        }
        Returns: boolean
      }
      newadmin_update_insight: {
        Args: {
          p_author?: string
          p_featured_image?: string
          p_id: string
          p_published_date?: string
          p_slug?: string
          p_translations?: Json
          p_type?: string
        }
        Returns: boolean
      }
      newadmin_update_investment: {
        Args: {
          p_display_order?: number
          p_featured_image?: string
          p_id: string
          p_is_active?: boolean
          p_logo?: string
          p_slug?: string
          p_translations?: Json
          p_website_url?: string
        }
        Returns: boolean
      }
      newadmin_update_navigation_item: {
        Args: {
          p_display_order: number
          p_icon_name: string
          p_id: string
          p_is_active: boolean
          p_menu_type: string
          p_parent_id: string
          p_target_blank: boolean
          p_translations: string
        }
        Returns: undefined
      }
      newadmin_update_news: {
        Args: {
          p_bunny_video_id?: string
          p_featured_image?: string
          p_id: string
          p_published_date?: string
          p_slug?: string
          p_thumbnail_url?: string
          p_translations?: Json
          p_type?: string
          p_video_url?: string
        }
        Returns: boolean
      }
      newadmin_update_partner:
        | {
            Args: {
              p_benefits: string[]
              p_categories: string[]
              p_category: string
              p_contact_person: string
              p_display_order: number
              p_featured: boolean
              p_has_detail_page: boolean
              p_id: string
              p_integration_steps: string[]
              p_logo: string
              p_partnership_type: string
              p_translations: Json
            }
            Returns: boolean
          }
        | {
            Args: {
              p_categories?: string[]
              p_display_order?: number
              p_featured?: boolean
              p_id: string
              p_logo?: string
              p_slug?: string
              p_translations?: Json
              p_website?: string
            }
            Returns: boolean
          }
      newadmin_update_partner_with_slug: {
        Args: {
          p_category: string
          p_id: string
          p_logo: string
          p_partnership_type: string
          p_slug: string
          p_translations: Json
        }
        Returns: undefined
      }
      newadmin_update_product: {
        Args: {
          p_display_order?: number
          p_features?: Json
          p_hero_image?: string
          p_highlight_color?: string
          p_id: string
          p_image_url?: string
          p_page_background_color?: string
          p_slug?: string
          p_stats?: Json
          p_testimonials?: Json
          p_translations?: Json
          p_website_url?: string
        }
        Returns: boolean
      }
      newadmin_update_service: {
        Args: {
          p_category_id: string
          p_display_order: number
          p_icon_name: string
          p_id: string
          p_slug: string
          p_translations: Json
        }
        Returns: string
      }
      newadmin_update_service_category: {
        Args: { p_id: string; p_slug: string; p_translations: string }
        Returns: undefined
      }
      newadmin_update_static_page: {
        Args: {
          p_id: string
          p_is_published: boolean
          p_page_type: string
          p_slug: string
          p_translations: Json
        }
        Returns: boolean
      }
      newadmin_update_team_member: {
        Args: {
          p_achievements?: string[]
          p_display_order?: number
          p_id: string
          p_image_url?: string
          p_is_leadership?: boolean
          p_specializations?: string[]
          p_translations?: Json
        }
        Returns: boolean
      }
      newadmin_update_team_member_with_slug: {
        Args: {
          p_id: string
          p_image_url: string
          p_is_leadership: boolean
          p_slug: string
          p_translations: Json
        }
        Returns: string
      }
      newadmin_upsert_client: {
        Args: {
          p_background_image?: string
          p_case_study_images?: Json
          p_case_study_results?: Json
          p_case_study_team_size?: string
          p_case_study_timeline?: string
          p_case_study_videos?: Json
          p_categories?: string[]
          p_country?: string
          p_display_order?: number
          p_featured?: boolean
          p_id?: string
          p_industry?: string
          p_logo?: string
          p_product_category?: string
          p_slug?: string
          p_translations?: Json
          p_website?: string
        }
        Returns: string
      }
      newadmin_upsert_partner: {
        Args: {
          p_categories?: string[]
          p_display_order?: number
          p_featured?: boolean
          p_id?: string
          p_logo?: string
          p_slug?: string
          p_translations?: Json
          p_website?: string
        }
        Returns: string
      }
      newadmin_upsert_product: {
        Args: {
          p_display_order?: number
          p_features?: Json
          p_hero_image?: string
          p_highlight_color?: string
          p_id?: string
          p_image_url?: string
          p_page_background_color?: string
          p_slug?: string
          p_stats?: Json
          p_testimonials?: Json
          p_translations?: Json
          p_website_url?: string
        }
        Returns: string
      }
      setup_initial_admin:
        | { Args: never; Returns: string }
        | {
            Args: { admin_email: string; admin_password: string }
            Returns: boolean
          }
      update_app_setting: {
        Args: { p_key: string; p_value: string }
        Returns: undefined
      }
      update_client_display_orders: {
        Args: { client_updates: Json }
        Returns: {
          message: string
          success: boolean
        }[]
      }
      user_has_permission: {
        Args: { permission_name: string }
        Returns: boolean
      }
      validate_html_content: {
        Args: { content_html: string }
        Returns: boolean
      }
      validate_password_strength: {
        Args: { password: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "video_learner"
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
      app_role: ["admin", "user", "video_learner"],
    },
  },
} as const
