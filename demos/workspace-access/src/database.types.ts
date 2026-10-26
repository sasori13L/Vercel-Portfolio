export type TaskStatus = 'open' | 'complete'

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: { id: string; name: string; created_at: string }
        Insert: { id?: string; name: string; created_at?: string }
        Update: { id?: string; name?: string; created_at?: string }
        Relationships: []
      }
      memberships: {
        Row: { organization_id: string; user_id: string; role: string; created_at: string }
        Insert: { organization_id: string; user_id: string; role?: string; created_at?: string }
        Update: { organization_id?: string; user_id?: string; role?: string; created_at?: string }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string
          organization_id: string
          title: string
          description: string
          status: TaskStatus
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          title: string
          description?: string
          status?: TaskStatus
          created_by?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          title?: string
          description?: string
          status?: TaskStatus
          created_by?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
