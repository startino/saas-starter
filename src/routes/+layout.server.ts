export const load = async ({ locals, depends }) => {
  depends("data:init")

  return { auth: locals.auth, environment: locals.environment }
}
