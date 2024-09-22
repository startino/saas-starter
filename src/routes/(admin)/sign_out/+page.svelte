<script lang="ts">
  import { goto, invalidate } from "$app/navigation"
  import { onMount } from "svelte"

  let { data } = $props()

  let { supabase } = data
  let message = $state("Signing out....")

  onMount(() => {
    supabase.auth.signOut().then(async ({ error }) => {
      if (error) {
        message = "There was an issue signing out."
      } else {
        await invalidate("data:init")
        goto("/")
      }
    })
  })
</script>

<h1 class="text-2xl font-bold m-6">{message}</h1>
