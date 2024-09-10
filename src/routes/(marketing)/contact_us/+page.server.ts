import { fail } from "@sveltejs/kit"
import { setError, superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"

import { sendAdminEmail } from "$lib/mailer.js"
import { contactSchema } from "$lib/schemas"

export const load = async () => {
  const form = await superValidate(zod(contactSchema))

  return { form }
}

export const actions = {
  submitContactUs: async ({ request, locals: { supabaseServiceRole } }) => {
    const form = await superValidate(request, zod(contactSchema))

    if (!form.valid) {
      return fail(400, { form })
    }

    // Save to database
    const { error: insertError } = await supabaseServiceRole
      .from("contact_requests")
      .insert(form.data)

    if (insertError) {
      console.warn({ insertError })
      return setError(form, "Something went wrong", { status: 500 })
    }

    // Send email to admin
    await sendAdminEmail({
      subject: "New contact request",
      body: `New contact request from ${form.data.first_name} ${form.data.last_name}.\n\nEmail: ${form.data.email}\n\nPhone: ${form.data.phone}\n\nCompany: ${form.data.company_name}\n\nMessage: ${form.data.message_body}`,
    })

    return { form }
  },
}
