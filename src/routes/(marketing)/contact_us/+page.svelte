<script lang="ts">
  import { superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"

  import { Input } from "$lib/components/ui/input"
  import { Textarea } from "$lib/components/ui/textarea"
  import { Button } from "$lib/components/ui/button"
  import * as Card from "$lib/components/ui/card"
  import * as Form from "$lib/components/ui/form"
  import { contactSchema } from "$lib/schemas"

  let { data } = $props()

  const form = superForm(data.form, {
    validators: zodClient(contactSchema),
    onUpdated: ({ form: f }) => {
      if (f.valid) {
        showSuccess = true
      }
    },
  })

  const { form: formData, enhance, errors, delayed } = form
  let showSuccess = $state(false)
</script>

<div
  class="flex flex-col lg:flex-row mx-auto my-4 min-h-[70vh] place-items-center lg:place-items-start place-content-center"
>
  <div
    class="max-w-[400px] lg:max-w-[500px] flex flex-col place-content-center p-4 lg:mr-8 lg:mb-8 lg:min-h-[70vh]"
  >
    <div class="px-6">
      <h1 class="text-2xl lg:text-4xl font-bold mb-4">Contact Us</h1>
      <p class="text-lg">Talk to one of our service professionals to:</p>
      <ul class="list-disc list-outside pl-6 py-4 space-y-1">
        <li class="">Get a live demo</li>
        <li class="">Discuss your specific needs</li>
        <li>Get a quote</li>
        <li>Answer any technical questions you have</li>
      </ul>
      <p>Once you complete the form, we'll reach out to you! *</p>
      <p class="text-sm pt-8">
        *Not really for this demo page, but you should say something like that
        😉
      </p>
    </div>
  </div>

  <div
    class="flex flex-col flex-grow m-4 lg:ml-10 min-w-[300px] stdphone:min-w-[360px] max-w-[400px] place-content-center lg:min-h-[70vh]"
  >
    {#if showSuccess}
      <div class="flex flex-col place-content-center lg:min-h-[70vh]">
        <div
          class="card card-bordered shadow-lg py-6 px-6 mx-2 lg:mx-0 lg:p-6 mb-10"
        >
          <div class="text-2xl font-bold mb-4">Thank you!</div>
          <p class="">We've received your message and will be in touch soon.</p>
        </div>
      </div>
    {:else}
      <Card.Root class="shadow-lg pt-6 mx-2 lg:mx-0 lg:p-6">
        <Card.Content>
          <form
            class="flex flex-col"
            method="POST"
            action="?/submitContactUs"
            use:enhance
          >
            <Form.Field {form} name="first_name">
              <Form.Control let:attrs>
                <Form.Label>First Name *</Form.Label>
                <Input
                  {...attrs}
                  bind:value={$formData.first_name}
                  autocomplete="given-name"
                />
                <Form.FieldErrors />
              </Form.Control>
            </Form.Field>

            <Form.Field {form} name="last_name">
              <Form.Control let:attrs>
                <Form.Label>Last Name *</Form.Label>
                <Input
                  {...attrs}
                  bind:value={$formData.last_name}
                  autocomplete="family-name"
                />
                <Form.FieldErrors />
              </Form.Control>
            </Form.Field>

            <Form.Field {form} name="email">
              <Form.Control let:attrs>
                <Form.Label>Email *</Form.Label>
                <Input
                  {...attrs}
                  bind:value={$formData.email}
                  autocomplete="email"
                />
                <Form.FieldErrors />
              </Form.Control>
            </Form.Field>

            <Form.Field {form} name="phone">
              <Form.Control let:attrs>
                <Form.Label>Phone</Form.Label>
                <Input
                  {...attrs}
                  bind:value={$formData.phone}
                  inputmode="tel"
                  autocomplete="tel"
                />
                <Form.FieldErrors />
              </Form.Control>
            </Form.Field>

            <Form.Field {form} name="company_name">
              <Form.Control let:attrs>
                <Form.Label>Company</Form.Label>
                <Input
                  {...attrs}
                  bind:value={$formData.company_name}
                  autocomplete="organization"
                />
                <Form.FieldErrors />
              </Form.Control>
            </Form.Field>

            <Form.Field {form} name="message_body">
              <Form.Control let:attrs>
                <Form.Label>Message</Form.Label>
                <Textarea
                  {...attrs}
                  bind:value={$formData.message_body as string}
                />
                <Form.FieldErrors />
              </Form.Control>
            </Form.Field>

            {#if $errors._errors}
              <p class="text-destructive text-sm mb-2">
                {$errors._errors[0]}
              </p>
            {/if}
            <Button disabled={$delayed} type="submit">
              {$delayed ? "Submitting" : "Submit"}
            </Button>
          </form>
        </Card.Content>
      </Card.Root>
    {/if}
  </div>
</div>
