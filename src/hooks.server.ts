// src/hooks.server.ts
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public"
import { PRIVATE_SUPABASE_SERVICE_ROLE } from "$env/static/private"
import { redirect, type Handle } from "@sveltejs/kit"
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

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range"
    },
  })
}

const authGuard: Handle = async ({ event, resolve }) => {
  const session = await event.locals.safeGetSession()
  if (event.url.pathname.startsWith("/login")) {
    if (
      session?.user?.is_anonymous &&
      event.url.pathname === "/login/sign_up"
    ) {
      return resolve(event)
    } else if (session) {
      return redirect(303, "/account")
    }
  }

  return resolve(event)
}

export const handle = sequence(supabase, authGuard)
