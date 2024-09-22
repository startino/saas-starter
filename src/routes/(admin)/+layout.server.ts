import type { PostgrestError } from "@supabase/supabase-js"
import { error } from "@sveltejs/kit"

export const load = async ({ locals: { supabase, safeGetSession } }) => {
  const { session, user } = await safeGetSession()

  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(`*`)
      .eq("id", session?.user.id as string)
      .single()

    if (profileError) {
      throw profileError
    }

    return { session, profile, user }
  } catch (err) {
    const postgrestErr = err as PostgrestError
    console.log({ postgrestErr })
    if (postgrestErr.code === "PGRST116") {
      return error(404, "Page not found")
    }
    return error(500, "Something went wrong")
  }
}
