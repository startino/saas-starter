<script lang="ts">
  import { enhance, applyAction } from "$app/forms"
  import type { SubmitFunction } from "@sveltejs/kit"

  import { Input } from "$lib/components/ui/input"
  import { Textarea } from "$lib/components/ui/textarea"
  import { Button } from "$lib/components/ui/button"
  import * as Card from "$lib/components/ui/card"

  let errors = $state<{ [fieldName: string]: string }>({})
  let loading = $state(false)
  let showSuccess = $state(false)

  const formFields = [
    {
      id: "first_name",
      label: "First Name *",
      inputType: "text",
      autocomplete: "given-name",
    },
    {
      id: "last_name",
      label: "Last Name *",
      inputType: "text",
      autocomplete: "family-name",
    },
    {
      id: "email",
      label: "Email *",
      inputType: "email",
      autocomplete: "email",
    },
    {
      id: "phone",
      label: "Phone Number",
      inputType: "tel",
      autocomplete: "tel",
    },
    {
      id: "company",
      label: "Company Name",
      inputType: "text",
      autocomplete: "organization",
    },
    {
      id: "message",
      label: "Message",
      inputType: "textarea",
      autocomplete: "off",
    },
  ]

  const handleSubmit: SubmitFunction = () => {
    loading = true
    errors = {}
    return async ({ update, result }) => {
      await update({ reset: false })
      await applyAction(result)
      loading = false
      if (result.type === "success") {
        showSuccess = true
      } else if (result.type === "failure") {
        errors = result.data?.errors ?? {}
      } else if (result.type === "error") {
        errors = { _: "An error occurred. Please check inputs and try again." }
      }
    }
  }
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
            use:enhance={handleSubmit}
          >
            {#each formFields as field}
              <label for={field.id}>
                <div class="flex flex-row">
                  <div class="text-base font-bold">{field.label}</div>
                  {#if errors[field.id]}
                    <div
                      class="text-destructive flex-grow text-sm ml-2 text-right"
                    >
                      {errors[field.id]}
                    </div>
                  {/if}
                </div>
                {#if field.inputType === "textarea"}
                  <Textarea
                    id={field.id}
                    name={field.id}
                    autocomplete={field.autocomplete}
                    class="{errors[field.id] ? 'border-destructive' : ''} my-2"
                    rows={4}
                  ></Textarea>
                {:else}
                  <Input
                    id={field.id}
                    name={field.id}
                    type={field.inputType}
                    autocomplete={field.autocomplete}
                    class="{errors[field.id] ? 'border-destructive' : ''} my-2"
                  />
                {/if}
              </label>
            {/each}

            {#if Object.keys(errors).length > 0}
              <p class="text-destructive text-sm mb-2">
                Please resolve above issues.
              </p>
            {/if}
            <Button disabled={loading} type="submit">
              {loading ? "Submitting" : "Submit"}
            </Button>
          </form>
        </Card.Content>
      </Card.Root>
    {/if}
  </div>
</div>
