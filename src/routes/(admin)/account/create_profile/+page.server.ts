import { redirect } from "@sveltejs/kit"
import { superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"

import { _hasFullProfile } from "../+layout"

import { profileSchema } from "$lib/schemas"

export const load = async ({ parent }) => {
  const data = await parent()

  // They completed their profile! Redirect to "Select a Plan" screen.
  if (_hasFullProfile(data?.profile)) {
    redirect(303, "/account/select_plan")
  }

  const form = await superValidate(
    {
      full_name: data.profile?.full_name ?? "",
      company_name: data.profile?.company_name ?? "",
      website: data.profile?.website ?? "",
    },
    zod(profileSchema),
    { errors: false },
  )
  return { form }
}
