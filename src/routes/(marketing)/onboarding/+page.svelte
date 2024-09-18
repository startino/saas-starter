<script lang="ts">
  import { superForm } from "sveltekit-superforms/client"
  import { zod } from "sveltekit-superforms/adapters"

  import { environmentSchema } from "$lib/schemas"
  import * as Form from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { Button } from "$lib/components/ui/button"
  import * as Card from "$lib/components/ui/card"

  let { data } = $props()

  const form = superForm(data.form, { validators: zod(environmentSchema) })

  const { form: formData, enhance, errors, delayed } = form
</script>

<Card.Root class="max-w-xl mx-auto mt-8">
  <Card.Header>
    <Card.Title>Create a new environment</Card.Title>
  </Card.Header>
  <Card.Content>
    <form method="post" use:enhance>
      <Form.Field {form} name="name" class="mb-2">
        <Form.Control let:attrs>
          <Form.Label>Environment Name</Form.Label>
          <Input {...attrs} bind:value={$formData.name} />
          <Form.FieldErrors />
        </Form.Control>
      </Form.Field>

      <Button disabled={$delayed} type="submit">Create</Button>

      {#if $errors._errors}
        <p class="text-destructive text-sm font-bold mt-1">
          {$errors._errors[0]}
        </p>
      {/if}
    </form>
  </Card.Content>
</Card.Root>
