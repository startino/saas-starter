import { setContext, getContext } from "svelte"
import { type Writable } from "svelte/store"

const ADMIN_SECTION_KEY = Symbol("ADMIN_SECTION")

export const setAdminSectionState = (section: Writable<string>) =>
  setContext(ADMIN_SECTION_KEY, section)

export const getAdminSectionState = () =>
  getContext<ReturnType<typeof setAdminSectionState>>(ADMIN_SECTION_KEY)
