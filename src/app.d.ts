import { SupabaseClient, Session, User } from "@supabase/supabase-js"
import { Database, type Tables } from "$lib/supabase/supabase.types"

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>
      supabaseServiceRole: SupabaseClient<Database>
      safeGetSession(): Promise<{ session: Session | null; user: User | null }>
      auth: { session: Session | null; user: User | null }
      environment: Tables<"environments"> | null
    }
    interface PageData {
      session: Session | null
    }
    // interface Error {}
    // interface Platform {}
  }
}

export {}
