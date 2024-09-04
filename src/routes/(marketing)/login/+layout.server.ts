import { redirect } from "@sveltejs/kit"

export const load = async ({ url, locals: { safeGetSession } }) => {
  const { session } = await safeGetSession()

  // if the user is already logged in return them to the account page
  if (session) {
    redirect(303, "/account")
  }

  return {
    session: session,
    url: url.origin,
  }
}
