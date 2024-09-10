import { superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"

import { passwordSchema } from "$lib/schemas"

export const load = async () => {
  const form = await superValidate(zod(passwordSchema))
  return { form }
}
