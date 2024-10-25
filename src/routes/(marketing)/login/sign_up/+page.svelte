<script lang="ts">
  import { Github } from "lucide-svelte"

  import * as Form from "$lib/components/ui/form"
  import * as Card from "$lib/components/ui/card"
  import { superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { signUpSchema } from "$lib/schemas"
  import { Input } from "$lib/components/ui/input"
  import { Button } from "$lib/components/ui/button"
  import { Separator } from "$lib/components/ui/separator"

  let { data } = $props()

  let oauthSigningUp = $state(false)
  let oauthError = $state<string | null>(null)

  const form = superForm(data.form, {
    validators: zodClient(signUpSchema),
  })

  const { form: formData, enhance, delayed, errors, constraints } = form

  let signingUp = $derived(oauthSigningUp || $delayed)

  const oauthSignUp = async (provider: "google" | "github") => {
    oauthSigningUp = true
    oauthError = null

    const { data: oauthData, error } = await data.supabase.auth.linkIdentity({
      provider,
    })

    if (error) {
      console.error({ error })
      oauthError = `${provider} authentication failed. Please try again`
    }

    if (oauthData && oauthData.url) {
      window.location.href = oauthData.url
    }

    oauthSigningUp = false
  }
</script>

<svelte:head>
  <title>Sign up</title>
</svelte:head>

<Card.Root class="mt-6">
  <Card.Header>
    <Card.Title class="text-2xl font-bold text-center">Sign Up</Card.Title>
  </Card.Header>
  <Card.Content>
    {#if oauthError}
      <p class="text-destructive">{oauthError}</p>
    {/if}
    <div class="flex justify-center gap-4">
      <Button
        aria-label="Sign up with github"
        size="icon"
        disabled={signingUp}
        onclick={() => oauthSignUp("github")}><Github /></Button
      >

      <Button
        aria-label="Sign up with google"
        size="icon"
        disabled={signingUp}
        onclick={() => oauthSignUp("google")}
      >
        <svg
          class=" fill-primary-foreground"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 50 50"
          width="24px"
          height="24px"
          ><path
            d="M 25.996094 48 C 13.3125 48 2.992188 37.683594 2.992188 25 C 2.992188 12.316406 13.3125 2 25.996094 2 C 31.742188 2 37.242188 4.128906 41.488281 7.996094 L 42.261719 8.703125 L 34.675781 16.289063 L 33.972656 15.6875 C 31.746094 13.78125 28.914063 12.730469 25.996094 12.730469 C 19.230469 12.730469 13.722656 18.234375 13.722656 25 C 13.722656 31.765625 19.230469 37.269531 25.996094 37.269531 C 30.875 37.269531 34.730469 34.777344 36.546875 30.53125 L 24.996094 30.53125 L 24.996094 20.175781 L 47.546875 20.207031 L 47.714844 21 C 48.890625 26.582031 47.949219 34.792969 43.183594 40.667969 C 39.238281 45.53125 33.457031 48 25.996094 48 Z"
          /></svg
        >
      </Button>
    </div>
    <Separator class="my-4" />
    <form method="post" use:enhance class="grid gap-4">
      <Form.Field {form} name="email">
        <Form.Control let:attrs>
          <Form.Label>Email</Form.Label>
          <Input
            bind:value={$formData.email}
            {...attrs}
            {...$constraints.email}
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="password">
        <Form.Control let:attrs>
          <Form.Label>Password</Form.Label>
          <Input
            bind:value={$formData.password}
            type="password"
            {...attrs}
            {...$constraints.password}
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="confirmPassword">
        <Form.Control let:attrs>
          <Form.Label>Confirm Password</Form.Label>
          <Input
            bind:value={$formData.confirmPassword}
            type="password"
            {...attrs}
            {...$constraints.confirmPassword}
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      {#if $errors._errors}
        <p class="text-destructive text-sm font-bold mt-1">
          {$errors._errors[0]}
        </p>
      {/if}

      <Button type="submit" disabled={signingUp} class="w-full">
        {#if signingUp}
          ...
        {:else}
          Sign Up
        {/if}
      </Button>
    </form>
  </Card.Content>

  <Card.Footer>
    <div class="mt-4 mb-2">
      Have an account? <a class="underline" href="/login/sign_in">Sign in</a>.
    </div>
  </Card.Footer>
</Card.Root>
