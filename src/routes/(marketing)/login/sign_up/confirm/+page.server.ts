import { error } from "@sveltejs/kit"

export const load = async ({ url }) => {
  const confirmationUrl = url.searchParams.get("confirmation_url")
  const email = url.searchParams.get("email")

  if (!confirmationUrl && !email) {
    error(404)
  }

  return { confirmationUrl, email }
}
