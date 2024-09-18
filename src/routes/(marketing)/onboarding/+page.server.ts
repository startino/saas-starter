import { setError, superValidate } from "sveltekit-superforms/server"
import { zod } from "sveltekit-superforms/adapters"

import { environmentSchema } from "$lib/schemas"
import { fail, redirect } from "@sveltejs/kit"
import type { PostgrestError } from "@supabase/supabase-js"

export const load = async () => {
  const form = await superValidate(zod(environmentSchema))
  return { form }
}

export const actions = {
  default: async ({
    locals: { safeGetSession, supabaseServiceRole },
    request,
  }) => {
    const { user } = await safeGetSession()
    const form = await superValidate(request, zod(environmentSchema))

    if (!form.valid) {
      return fail(400, { form })
    }

    const slug = form.data.name.trim().toLowerCase().split(" ").join("-")

    try {
      const { error: profileError, data: profile } = await supabaseServiceRole
        .from("profiles")
        .select("id")
        .eq("id", user?.id as string)
        .single()

      if (profileError) {
        throw profileError
      }

      const { error: envError, data: env } = await supabaseServiceRole
        .from("environments")
        .insert({
          ...form.data,
          slug,
        })
        .select("id")
        .single()

      if (envError) {
        throw envError
      }

      await supabaseServiceRole
        .from("environments_profiles")
        .insert({ environment_id: env?.id, profile_id: profile?.id })
    } catch (err) {
      const error = err as PostgrestError

      if (error.code === "23505") {
        return setError(form, "Environment name already taken", { status: 403 })
      }
      return setError(form, "Something went wrong", { status: 500 })
    }

    redirect(300, `/${slug}`)
  },
}
