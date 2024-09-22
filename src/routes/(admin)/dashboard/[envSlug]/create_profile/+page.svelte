<script lang="ts">
  import { zodClient } from "sveltekit-superforms/adapters"
  import { superForm } from "sveltekit-superforms"

  import { Input } from "$lib/components/ui/input"
  import { Button } from "$lib/components/ui/button"
  import * as Form from "$lib/components/ui/form"
  import { profileSchema } from "$lib/schemas"

  let { data } = $props()

  let { session } = data

  const form = superForm(data.form, { validators: zodClient(profileSchema) })

  const { enhance, form: formData, delayed, errors } = form
</script>

<svelte:head>
  <title>Create Profile</title>
</svelte:head>

<div
  class="text-center content-center max-w-lg mx-auto min-h-[100vh] pb-12 flex items-center place-content-center"
>
  <div class="flex flex-col w-64 lg:w-80">
    <div>
      <h1 class="text-2xl font-bold mb-6">Create Profile</h1>
      <form
        class="grid gap-4"
        method="POST"
        action="/account/api?/updateProfile"
        use:enhance
      >
        <Form.Field {form} name="full_name">
          <Form.Control let:attrs>
            <Form.Label>Your Name</Form.Label>
            <Input {...attrs} bind:value={$formData.full_name} />
            <Form.FieldErrors />
          </Form.Control>
        </Form.Field>

        <Form.Field {form} name="company_name">
          <Form.Control let:attrs>
            <Form.Label>Company Name</Form.Label>
            <Input {...attrs} bind:value={$formData.company_name} />
            <Form.FieldErrors />
          </Form.Control>
        </Form.Field>

        <Form.Field {form} name="website">
          <Form.Control let:attrs>
            <Form.Label>Company Website</Form.Label>
            <Input {...attrs} bind:value={$formData.website} />
            <Form.FieldErrors />
          </Form.Control>
        </Form.Field>

        {#if $errors._errors}
          <p class="text-destructive text-sm font-bold text-center mt-3">
            {$errors._errors[0]}
          </p>
        {/if}
        <div class="mt-4">
          <Button type="submit" class="mt-3" disabled={$delayed}>
            {#if $delayed}
              ...
            {:else}
              Create Profile
            {/if}
          </Button>
        </div>
      </form>

      <div class="text-sm mt-14">
        You are logged in as {session?.user?.email ?? "an anonymous user"}.
        <br />
        <a class="underline" href="/account/sign_out"> Sign out </a>
      </div>
    </div>
  </div>
</div>
