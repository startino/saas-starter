import { superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"

import { changePasswordSchema } from "$lib/schemas"

export const load = async () => {
  const form = await superValidate(zod(changePasswordSchema))
  return { form }
}
