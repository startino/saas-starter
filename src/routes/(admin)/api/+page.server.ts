import { fail, redirect } from "@sveltejs/kit"
import { sendAdminEmail, sendUserEmail } from "$lib/mailer"
import { zod } from "sveltekit-superforms/adapters"
import { setError, superValidate } from "sveltekit-superforms"
import {
  profileSchema,
  emailSchema,
  changePasswordSchema,
  deleteAccountSchema,
} from "$lib/schemas"

export const actions = {
  toggleEmailSubscription: async ({ locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()

    if (!session) {
      redirect(303, "/login")
    }

    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("unsubscribed")
      .eq("id", session.user.id)
      .single()

    const newUnsubscribedStatus = !currentProfile?.unsubscribed

    const { error } = await supabase
      .from("profiles")
      .update({ unsubscribed: newUnsubscribedStatus })
      .eq("id", session.user.id)

    if (error) {
      return fail(500, { message: "Failed to update subscription status" })
    }

    return {
      unsubscribed: newUnsubscribedStatus,
    }
  },
  updateEmail: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()
    if (!session) {
      redirect(303, "/login")
    }

    const form = await superValidate(request, zod(emailSchema))

    if (!form.valid) {
      return fail(400, { form })
    }
    // Supabase does not change the email until the user verifies both
    // if 'Secure email change' is enabled in the Supabase dashboard
    const { error } = await supabase.auth.updateUser({ email: form.data.email })

    if (error) {
      console.error(error)
      return setError(
        form,
        "Unknown error. If this persists please contact us.",
        {
          status: 500,
        },
      )
    }

    redirect(303, `/login/confirm?email=${form.data.email}`)
  },
  updatePassword: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()
    if (!session) {
      redirect(303, "/login")
    }

    const form = await superValidate(request, zod(changePasswordSchema))

    const isRecoverySession =
      session.user.recovery_sent_at && !form.data.currentPassword

    // if this is password recovery session, check timestamp of recovery session
    if (isRecoverySession) {
      const timeSinceLogin =
        Date.now() - Date.parse(session.user.recovery_sent_at as string) * 1000
      if (timeSinceLogin > 1000 * 60 * 15) {
        // 15 mins in milliseconds
        return setError(
          form,
          'Recovery code expired. Please log out, then use "Forgot Password" on the sign in page to reset your password. Codes are valid for 15 minutes.',
          {
            status: 400,
          },
        )
      }
    }

    if (!form.valid) {
      return fail(400, { form })
    }

    // Check current password is correct before updating, but only if they didn't log in with "recover" link
    // Note: to make this truly enforced you need to contact supabase. See: https://www.reddit.com/r/Supabase/comments/12iw7o1/updating_password_in_supabase_seems_insecure/
    // However, having the UI accessible route still verify password is still helpful, and needed once you get the setting above enabled
    if (!isRecoverySession) {
      const { error } = await supabase.auth.signInWithPassword({
        email: session?.user.email || "",
        password: form.data.currentPassword,
      })
      if (error) {
        await supabase.auth.signOut()
        // The user was logged out because of bad password. Redirect to error page explaining.
        redirect(303, "/login/current_password_error")
      }
    }

    const { error } = await supabase.auth.updateUser({
      email: session.user.email,
      password: form.data.newPassword1,
      data: {
        hasPassword: true,
      },
    })
    if (error) {
      console.log(error)

      return setError(
        form,
        "Unknown error. If this persists please contact us.",
        { status: 500 },
      )
    }

    return {
      form,
    }
  },
  deleteAccount: async ({
    request,
    locals: { supabase, supabaseServiceRole, safeGetSession },
  }) => {
    const { session } = await safeGetSession()
    if (!session) {
      redirect(303, "/login")
    }

    const form = await superValidate(request, zod(deleteAccountSchema))

    if (!form.valid) {
      return fail(400, { form })
    }

    // Check current password is correct before deleting account
    const { error: pwError } = await supabase.auth.signInWithPassword({
      email: session?.user.email || "",
      password: form.data.currentPassword,
    })
    if (pwError) {
      // The user was logged out because of bad password. Redirect to error page explaining.
      redirect(303, "/login/current_password_error")
    }

    const { error } = await supabaseServiceRole.auth.admin.deleteUser(
      session.user.id,
      true,
    )
    if (error) {
      return setError(
        form,
        "Unknown error. If this persists please contact us.",
        {
          status: 500,
        },
      )
    }

    await supabase.auth.signOut()
    redirect(303, "/")
  },
  updateProfile: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()
    if (!session) {
      redirect(303, "/login")
    }

    const form = await superValidate(request, zod(profileSchema))

    if (!form.valid) {
      return fail(400, { form })
    }

    // To check if created or updated, check if priorProfile exists
    const { data: priorProfile, error: priorProfileError } = await supabase
      .from("profiles")
      .select(`*`)
      .eq("id", session?.user.id)
      .single()

    const { error } = await supabase
      .from("profiles")
      .upsert({
        ...form.data,
        id: session?.user.id,
        unsubscribed: priorProfile?.unsubscribed ?? false,
      })
      .select()

    if (error) {
      return setError(
        form,
        "Unknown error. If this persists please contact us.",
        {
          status: 500,
        },
      )
    }

    // If the profile was just created, send an email to the user and admin
    const newProfile =
      priorProfile?.updated_at === null && priorProfileError === null
    if (newProfile) {
      await sendAdminEmail({
        subject: "Profile Created",
        body: `Profile created by ${session.user.email}\nFull name: ${form.data.full_name}\nCompany name: ${form.data.company_name}\nWebsite: ${form.data.website}`,
      })

      // Send welcome email
      await sendUserEmail({
        user: session.user,
        subject: "Welcome!",
        from_email: "no-reply@saasstarter.work",
        template_name: "welcome_email",
        template_properties: {
          companyName: "SaaS Starter",
        },
      })
    }

    return {
      form,
    }
  },
  signout: async ({ locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()
    if (session) {
      await supabase.auth.signOut()
      redirect(303, "/")
    } else {
      redirect(303, "/")
    }
  },
}
