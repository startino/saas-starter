<script lang="ts">
  import { page } from "$app/stores"
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"

  import * as Card from "$lib/components/ui/card"
  import * as Form from "$lib/components/ui/form"
  import { Button, buttonVariants } from "$lib/components/ui/button"
  import { Input } from "$lib/components/ui/input"
  import * as Alert from "$lib/components/ui/alert"
  import {
    type EmailSchema,
    type DeleteAccountSchema,
    type PasswordSchema,
    type ProfileSchema,
  } from "$lib/schemas"
  import { enhance } from "$app/forms"

  const fieldError = (liveForm: FormAccountUpdateResult, name: string) => {
    let errors = liveForm?.errorFields ?? []
    return errors.includes(name)
  }

  // Page state
  let showSuccess = $state(false)

  type Field = {
    inputType?: string // default is "text"
    id: string
    label?: string
    initialValue: string | boolean
    placeholder?: string
    maxlength?: number
  }

  type Props = {
    data?: SuperValidated<
      Infer<EmailSchema | DeleteAccountSchema | PasswordSchema | ProfileSchema>
    >
    schema?: EmailSchema | DeleteAccountSchema | PasswordSchema | ProfileSchema
    editable?: boolean
    dangerous?: boolean
    title?: string
    message?: string
    fields: Field[]
    formTarget?: string
    successTitle?: string
    successBody?: string
    editButtonTitle?: string
    editLink?: string
    saveButtonTitle?: string
  }

  let {
    data,
    schema,
    editable = false,
    dangerous = false,
    title = "",
    message = "",
    fields,
    formTarget = "",
    successTitle = "Success",
    successBody = "",
    editButtonTitle = "",
    editLink = "",
    saveButtonTitle = "Save",
  }: Props = $props()

  const form =
    data && schema
      ? superForm(data, {
          validators: zodClient(schema),
          onUpdated: ({ form: f }) => {
            if (f.valid) {
              showSuccess = true
            }
          },
        })
      : null

  const formData = form?.form
  const delayed = form?.delayed
  const errors = form?.errors
  const superEnhance = form?.enhance ?? enhance
</script>

<Card.Root class="p-6 pb-7 mt-8 max-w-xl flex flex-col md:flex-row shadow">
  <Card.Content>
    {#if title}
      <div class="text-xl font-bold mb-3 w-48 md:pr-8 flex-none">{title}</div>
    {/if}

    <div class="w-full min-w-48">
      {#if !showSuccess}
        {#if message}
          <Alert.Root
            variant={dangerous ? "destructive" : "default"}
            class="mb-6"
          >
            {#if dangerous}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                /></svg
              >
            {/if}

            <span>{message}</span>
          </Alert.Root>
        {/if}
        {#if editable}
          <form
            class="form-widget flex flex-col"
            method="POST"
            action={formTarget}
            use:superEnhance
          >
            {#if form && $errors && $formData}
              {#each fields as field}
                <Form.Field {form} name={field.id}>
                  <Form.Control let:attrs>
                    {#if field.label}
                      <Form.Label>{field.label}</Form.Label>
                    {/if}
                    {#if editable}
                      <Input
                        {...attrs}
                        id={field.id}
                        name={field.id}
                        type={field.inputType ?? "text"}
                        disabled={!editable}
                        placeholder={field.placeholder ?? field.label ?? ""}
                        class="{fieldError($page?.form, field.id)
                          ? 'border-destructive'
                          : ''} w-full max-w-xs mb-3 py-4"
                        value={$formData[field.id as keyof typeof $formData]}
                        maxlength={field.maxlength ? field.maxlength : null}
                      />

                      <Form.FieldErrors />
                    {:else}
                      <div class="text-lg mb-3">{field.initialValue}</div>
                    {/if}
                  </Form.Control>
                </Form.Field>
              {/each}

              {#if $errors._errors}
                <p class="text-destructive text-sm font-bold mt-1">
                  {$errors._errors[0]}
                </p>
              {/if}
            {/if}

            <div>
              <Button
                type="submit"
                variant="outline"
                class="ml-auto mt-3 min-w-[145px] {dangerous
                  ? 'border-destructive'
                  : ''}"
                disabled={$delayed}
              >
                {#if $delayed}
                  <span
                    class="loading loading-spinner loading-md align-middle mx-3"
                  ></span>
                {:else}
                  {saveButtonTitle}
                {/if}
              </Button>
            </div>
          </form>
        {:else}
          {#each fields as field}
            <div class="mb-4">
              <h4 class="font-bold mb-2">{field.label}</h4>
              <p>{field.initialValue}</p>
            </div>
          {/each}

          <a href={editLink} class="mt-1">
            <Button
              class="{dangerous ? 'border-destructive' : ''} min-w-[145px]"
            >
              {editButtonTitle}
            </Button>
          </a>
        {/if}
      {:else}
        <!-- showSuccess -->
        <div>
          <div class="text-l font-bold">{successTitle}</div>
          <div class="text-base">{successBody}</div>
        </div>
        <a
          href="/account/settings"
          class="{buttonVariants({ size: 'sm' })} mt-3 min-w-[145px]"
        >
          Return to Settings
        </a>
      {/if}
    </div>
  </Card.Content>
</Card.Root>
