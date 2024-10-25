import { superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"

import { profileSchema } from "$lib/schemas"

export const load = async ({ parent }) => {
  const { profile } = await parent()

  const form = await superValidate(
    {
      full_name: profile?.full_name ?? "",
      company_name: profile?.company_name ?? "",
      website: profile?.website ?? "",
    },
    zod(profileSchema),
    { errors: false },
  )

  return { form }
}
