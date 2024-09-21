<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte"

  let { data } = $props()
</script>

<Button
  data-sveltekit-preload-data="off"
  href={data.confirmationUrl}
  size="lg"
  class=" mt-11 mx-auto">Confirm your email: {data.email}</Button
>
