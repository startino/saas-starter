import { superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"

import { deleteAccountSchema } from "$lib/schemas"

export const load = async () => {
  const form = await superValidate(zod(deleteAccountSchema))
  return { form }
}
