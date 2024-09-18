import type { PostgrestError } from "@supabase/supabase-js"
import { error, redirect } from "@sveltejs/kit"

export const load = async ({
  locals: { supabase, safeGetSession },
  params,
}) => {
  const { session, user } = await safeGetSession()

  try {
    const { data: environment, error: envError } = await supabase
      .from("environments")
      .select()
      .eq("slug", params.envSlug)
      .single()

    if (envError) {
      throw envError
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(`*`)
      .eq("id", session?.user.id as string)
      .single()

    if (profileError) {
      throw profileError
    }

    return { session, profile, user, environment }
  } catch (err) {
    const postgrestErr = err as PostgrestError
    console.log({ postgrestErr })
    if (postgrestErr.code === "PGRST116") {
      return error(404, "Page not found")
    }
    return error(500, "Something went wrong")
  }
}
