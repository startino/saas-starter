<script lang="ts">
  import * as Form from "$lib/components/ui/form"
  import * as Card from "$lib/components/ui/card"
  import { superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { otpCodeSchema } from "$lib/schemas"
  import { Input } from "$lib/components/ui/input"
  import { Button } from "$lib/components/ui/button"

  let { data } = $props()

  const form = superForm(data.form, {
    validators: zodClient(otpCodeSchema),
  })

  const { form: formData, enhance, delayed, errors, constraints } = form
</script>

<svelte:head>
  <title>Confirmation</title>
</svelte:head>

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
    <form method="post" use:enhance class="grid gap-4">
      <input name="email" bind:value={$formData.email} hidden />
      <Form.Field {form} name="code">
        <Form.Control let:attrs>
          <Form.Label>6-digit code</Form.Label>
          <Input
            bind:value={$formData.code}
            {...attrs}
            {...$constraints.code}
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      {#if $errors._errors}
        <p class="text-destructive text-sm font-bold mt-1">
          {$errors._errors[0]}
        </p>
      {/if}

      <Button type="submit" disabled={$delayed} class="w-full">
        {#if $delayed}
          ...
        {:else}
          Verify
        {/if}
      </Button>
    </form>
  </Card.Content>
</Card.Root>
