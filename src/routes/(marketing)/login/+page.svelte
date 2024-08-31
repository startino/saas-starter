<script lang="ts">
  import { buttonVariants } from "$lib/components/ui/button"
</script>

<svelte:head>
  <title>Log In</title>
</svelte:head>

<div>
  <h1 class="text-xl font-bold mb-2">Get Started</h1>
  <a href="/login/sign_up" class={buttonVariants({ size: "lg" })}> Sign Up </a>

  <h1 class="text-xl mt-6 mb-2">Already have an account?</h1>
  <a
    href="/login/sign_in"
    class={buttonVariants({ size: "lg", variant: "outline" })}
    >Sign In
  </a>
</div>
