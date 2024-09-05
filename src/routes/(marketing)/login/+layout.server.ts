export const load = async ({ url, locals: { safeGetSession } }) => {
  const { session } = await safeGetSession()

  return {
    session: session,
    url: url.origin,
  }
}
