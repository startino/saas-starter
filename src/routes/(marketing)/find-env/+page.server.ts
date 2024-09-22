import { redirect } from "@sveltejs/kit"

export const load = async ({ locals }) => {
  if (locals.environment) {
    redirect(300, `/${locals.environment?.slug}`)
  }

  redirect(300, "/onboard")
}
