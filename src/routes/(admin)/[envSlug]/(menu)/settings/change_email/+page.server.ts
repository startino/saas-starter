import { superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"

import { emailSchema } from "$lib/schemas"

export const load = async () => {
  const form = await superValidate(zod(emailSchema))

  return { form }
}
