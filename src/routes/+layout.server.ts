export const load = async ({ locals }) => {
  return { auth: locals.auth, environment: locals.environment }
}
