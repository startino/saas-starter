import { redirect } from "@sveltejs/kit"

export const GET = async ({ locals }) => {
  console.log(locals.environment)

  if (locals.environment) {
    return redirect(300, `/dashboard/${locals.environment?.slug}`)
  }

  return redirect(300, "/onboarding")
}
