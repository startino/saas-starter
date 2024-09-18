import type { Tables } from "$lib/supabase/supabase.types"
import { setContext, getContext } from "svelte"

const ENVIRONMENT_KEY = Symbol("ENVIRONMENT")

export const setEnvironmentState = (environment: Tables<"environments">) => {
  const env = $state(environment)
  return setContext(ENVIRONMENT_KEY, env)
}

export const getEnvironmentState = () =>
  getContext<ReturnType<typeof setEnvironmentState>>(ENVIRONMENT_KEY)
