import { otpCodeSchema } from "$lib/schemas"
import { redirect } from "@sveltejs/kit"
import { fail, setError, superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"

export const load = async ({ url }) => {
  const email = url.searchParams.get("email")

  if (!email) {
    return redirect(303, "/")
  }

  const form = await superValidate({ email }, zod(otpCodeSchema), {
    errors: false,
  })

  return { form }
}

export const actions = {
  default: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(otpCodeSchema))

    if (!form.valid) {
      return fail(400, { form })
    }

    const { error } = await supabase.auth.verifyOtp({
      type: "email_change",
      token: form.data.code,
      email: form.data.email,
    })

    if (error) {
      console.error(error)
      return setError(form, "Something went wrong", { status: 500 })
    }

    redirect(300, "/")
  },
}
