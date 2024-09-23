import { error } from "@sveltejs/kit"

export const load = async ({ locals: { environment, supabase }, params }) => {
  const { data, error: err } = await supabase
    .from("environments")
    .select("id")
    .eq("slug", params.envSlug)
    .single()

  if (err) {
    if (err.code === "PGRST116") {
      return error(404, "Page not found")
    } else {
      return error(500)
    }
  }

  if (data.id !== environment?.id) {
    return error(403, "Not allowed")
  }
}
