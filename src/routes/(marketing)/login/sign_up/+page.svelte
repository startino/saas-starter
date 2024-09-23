<script lang="ts">
  import { Github } from "lucide-svelte"

  import * as Form from "$lib/components/ui/form"
  import * as Card from "$lib/components/ui/card"
  import { superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { otpCodeSchema, signUpSchema } from "$lib/schemas"
  import { Input } from "$lib/components/ui/input"
  import { Button } from "$lib/components/ui/button"
  import { Separator } from "$lib/components/ui/separator"

  let { data } = $props()

  let step: "signup" | "confirmation" = $state("signup")
  let oauthSigningUp = $state(false)
  let oauthError = $state<string | null>(null)

  const signUpForm = superForm(data.signUpForm, {
    validators: zodClient(signUpSchema),
    onUpdated: ({ form: f }) => {
      if (f.valid) {
        otpFormData.update((d) => ({ ...d, email: f.data.email }))
        step = "confirmation"
      }
    },
  })
  const otpForm = superForm(data.otpForm, {
    validators: zodClient(otpCodeSchema),
  })

  const {
    form: signUpFormData,
    enhance: signUpEnhance,
    delayed: signUpDelayed,
    errors: signUpErrors,
    constraints: signUpConstraints,
  } = signUpForm

  const {
    form: otpFormData,
    enhance: otpEnhance,
    delayed: otpDelayed,
    errors: otpErrors,
    constraints: otpConstraints,
  } = otpForm

  let signingUp = $derived(oauthSigningUp || $signUpDelayed)

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

{#if step === "signup"}
  <Card.Root class="mt-6">
    <Card.Header>
      <Card.Title class="text-2xl font-bold text-center">Sign Up</Card.Title>
    </Card.Header>
    <Card.Content>
      <div class="flex justify-center">
        <Button
          aria-label="Sign up with github"
          size="icon"
          disabled={signingUp}
          onclick={() => oauthSignUp("github")}><Github /></Button
        >
      </div>
      <Separator class="my-4" />
      <form
        method="post"
        action="?/signup"
        use:signUpEnhance
        class="grid gap-4"
      >
        <Form.Field form={signUpForm} name="email">
          <Form.Control let:attrs>
            <Form.Label>Email</Form.Label>
            <Input
              bind:value={$signUpFormData.email}
              {...attrs}
              {...$signUpConstraints.email}
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field form={signUpForm} name="password">
          <Form.Control let:attrs>
            <Form.Label>Password</Form.Label>
            <Input
              bind:value={$signUpFormData.password}
              type="password"
              {...attrs}
              {...$signUpConstraints.password}
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field form={signUpForm} name="confirmPassword">
          <Form.Control let:attrs>
            <Form.Label>Confirm Password</Form.Label>
            <Input
              bind:value={$signUpFormData.confirmPassword}
              type="password"
              {...attrs}
              {...$signUpConstraints.confirmPassword}
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        {#if $signUpErrors._errors}
          <p class="text-destructive text-sm font-bold mt-1">
            {$signUpErrors._errors[0]}
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
{:else}
  <Card.Root class="mt-6">
    <Card.Header>
      <Card.Title class="text-2xl font-bold text-center"
        >Enter your verification code</Card.Title
      >
      <Card.Description
        >A 6-digit confirmation code has been sent to your email</Card.Description
      >
    </Card.Header>
    <Card.Content>
      <form method="post" action="?/confirm" use:otpEnhance class="grid gap-4">
        <input name="email" bind:value={$otpFormData.email} hidden />
        <Form.Field form={otpForm} name="code">
          <Form.Control let:attrs>
            <Form.Label>6-digit code</Form.Label>
            <Input
              bind:value={$otpFormData.code}
              {...attrs}
              {...$otpConstraints.code}
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        {#if $otpErrors._errors}
          <p class="text-destructive text-sm font-bold mt-1">
            {$otpErrors._errors[0]}
          </p>
        {/if}

        <Button type="submit" disabled={$otpDelayed} class="w-full">
          {#if $otpDelayed}
            ...
          {:else}
            Verify
          {/if}
        </Button>
      </form>
    </Card.Content>
  </Card.Root>
{/if}

<!-- <h1 class="text-2xl font-bold mb-6">Sign Up</h1>
<Auth
  supabaseClient={data.supabase}
  view="sign_up"
  redirectTo={`${data.url}/auth/callback`}
  showLinks={false}
  providers={oauthProviders}
  socialLayout="horizontal"
  appearance={sharedAppearance}
  additionalData={undefined}
/> -->
