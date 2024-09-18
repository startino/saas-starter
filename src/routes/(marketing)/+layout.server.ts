export const load = async ({ locals: { safeGetSession } }) => {
  const { user } = await safeGetSession()

  return { user }
}
