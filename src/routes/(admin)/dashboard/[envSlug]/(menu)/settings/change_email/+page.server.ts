import { superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"

import { emailSchema } from "$lib/schemas"

export const load = async ({ locals: { auth } }) => {
  const form = await superValidate(
    { email: auth.user?.email },
    zod(emailSchema),
  )

  return { form }
}
