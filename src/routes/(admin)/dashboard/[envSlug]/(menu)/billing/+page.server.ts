import { redirect, error } from "@sveltejs/kit"
import {
  getOrCreateCustomerId,
  fetchSubscription,
} from "$lib/helpers/subscription_helpers.server"

export const load = async ({
  locals: { safeGetSession, supabaseServiceRole },
}) => {
  const { session } = await safeGetSession()
  if (!session) {
    redirect(303, "/login")
  }

  const { error: idError, customerId } = await getOrCreateCustomerId({
    supabaseServiceRole,
    session,
  })
  if (idError || !customerId) {
    error(500, {
      message: "Unknown error. If issue persists, please contact us.",
    })
  }

  const {
    primarySubscription,
    hasEverHadSubscription,
    error: fetchErr,
  } = await fetchSubscription({
    customerId,
  })
  if (fetchErr) {
    error(500, {
      message: "Unknown error. If issue persists, please contact us.",
    })
  }

  return {
    isActiveCustomer: !!primarySubscription,
    hasEverHadSubscription,
    currentPlanId: primarySubscription?.appSubscription?.id,
  }
}
