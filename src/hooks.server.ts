// src/hooks.server.ts
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public"
import { PRIVATE_SUPABASE_SERVICE_ROLE } from "$env/static/private"
import { type Handle } from "@sveltejs/kit"
import { sequence } from "@sveltejs/kit/hooks"
import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"

const supabase: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return event.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            event.cookies.set(name, value, { ...options, path: "/" }),
          )
        },
      },
    },
  )

  event.locals.supabaseServiceRole = createClient(
    PUBLIC_SUPABASE_URL,
    PRIVATE_SUPABASE_SERVICE_ROLE,
    {
      auth: { persistSession: false },
    },
  )

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range"
    },
  })
}

const auth: Handle = async ({ event, resolve }) => {
  /**
   * Unlike `supabase.auth.getSession()`, which returns the session _without_
   * validating the JWT, this function also calls `getUser()` to validate the
   * JWT before returning the session.
   */
  event.locals.safeGetSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession()
    if (!session) {
      const {
        data: { session, user },
      } = await event.locals.supabase.auth.signInAnonymously()

      return { session, user }
    } else {
      return { session, user: session.user }
    }
  }

  event.locals.auth = await event.locals.safeGetSession()

  return resolve(event)
}

const environment: Handle = async ({ event, resolve }) => {
  const { data } = await event.locals.supabase
    .from("environments_profiles")
    .select("env:environments (*)")
    .eq("profile_id", event.locals.auth.user?.id as string)

  event.locals.environment = data?.[0] ? data[0].env : null
  console.log(data)

  return resolve(event)
}

export const handle = sequence(supabase, auth, environment)
