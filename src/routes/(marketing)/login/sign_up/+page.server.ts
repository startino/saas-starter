import { otpCodeSchema, signUpSchema } from "$lib/schemas"
import { redirect } from "@sveltejs/kit"
import { fail, setError, superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"

export const load = async ({ locals: { safeGetSession } }) => {
  const { user } = await safeGetSession()

  if (!user?.is_anonymous) {
    return redirect(300, "/")
  }

  const signUpForm = await superValidate(zod(signUpSchema))
  const otpForm = await superValidate(zod(otpCodeSchema))

  return { signUpForm, otpForm }
}

export const actions = {
  signup: async ({ request, locals: { supabase } }) => {
    const signUpForm = await superValidate(request, zod(signUpSchema))

    if (!signUpForm.valid) {
      return fail(400, { signUpForm })
    }

    const { error: userError } = await supabase.auth.updateUser(
      {
        password: signUpForm.data.password,
        email: signUpForm.data.email,
      },
      {
        emailRedirectTo: "http://localhost:5173/login/sign_in",
      },
    )

    if (userError) {
      console.error({ userError })

      return setError(signUpForm, "Something went wrong...", { status: 500 })
    }

    return { signUpForm }
  },
  confirm: async ({ request, locals: { supabase } }) => {
    const otpForm = await superValidate(request, zod(otpCodeSchema))

    if (!otpForm.valid) {
      return fail(400, { otpForm })
    }

    const { error } = await supabase.auth.verifyOtp({
      type: "email_change",
      token: otpForm.data.code,
      email: otpForm.data.email,
    })

    if (error) {
      console.error(error)
      return setError(otpForm, "Something went wrond", { status: 500 })
    }

    redirect(300, "/")
  },
}
