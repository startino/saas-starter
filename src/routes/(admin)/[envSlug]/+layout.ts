import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public"
import { createBrowserClient } from "@supabase/ssr"

import type { Tables } from "$lib/supabase/supabase.types"

export const load = async ({ data, depends }) => {
  depends("supabase:auth")

  const supabase = createBrowserClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const profile: Tables<"profiles"> | null = data.profile

  return {
    ...data,
    supabase,
    session,
    profile,
  }
}

export const _hasFullProfile = (profile: Tables<"profiles"> | null) => {
  if (!profile) {
    return false
  }
  if (!profile.full_name) {
    return false
  }
  if (!profile.company_name) {
    return false
  }
  if (!profile.website) {
    return false
  }

  return true
}
