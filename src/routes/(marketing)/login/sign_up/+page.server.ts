import { signUpSchema } from "$lib/schemas"
import { redirect } from "@sveltejs/kit"
import { fail, setError, superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"

export const load = async ({ locals: { safeGetSession } }) => {
  const { user } = await safeGetSession()

  if (!user?.is_anonymous) {
    return redirect(300, "/")
  }

  const form = await superValidate(zod(signUpSchema))

  return { form }
}

export const actions = {
  default: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(signUpSchema))

    if (!form.valid) {
      return fail(400, { form })
    }

    const { error: userError } = await supabase.auth.updateUser({
      password: form.data.password,
      email: form.data.email,
      data: {
        hasPassword: true,
      },
    })

    if (userError) {
      console.error({ userError })

      return setError(form, "Something went wrong...", { status: 500 })
    }

    redirect(300, `/login/confirm?email=${form.data.email}`)
  },
}
