import type { Tables } from "$lib/supabase/supabase.types"
import { setContext, getContext } from "svelte"

const ENVIRONMENT_KEY = Symbol("ENVIRONMENT")

export const setEnvironmentState = (
  environment: Tables<"environments"> | null,
) => {
  const state = $state({ value: environment })
  return setContext(ENVIRONMENT_KEY, state)
}

export const getEnvironmentState = () =>
  getContext<ReturnType<typeof setEnvironmentState>>(ENVIRONMENT_KEY)
