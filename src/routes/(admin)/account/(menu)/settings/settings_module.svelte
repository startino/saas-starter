<script lang="ts">
  import { enhance, applyAction } from "$app/forms"
  import { page } from "$app/stores"
  import type { SubmitFunction } from "@sveltejs/kit"
  import * as Card from "$lib/components/ui/card"
  import { Button, buttonVariants } from "$lib/components/ui/button"
  import { Input } from "$lib/components/ui/input"
  import * as Alert from "$lib/components/ui/alert"

  const fieldError = (liveForm: FormAccountUpdateResult, name: string) => {
    let errors = liveForm?.errorFields ?? []
    return errors.includes(name)
  }

  // Page state
  let loading = false
  let showSuccess = false

  type Field = {
    inputType?: string // default is "text"
    id: string
    label?: string
    initialValue: string | boolean
    placeholder?: string
    maxlength?: number
  }

  // Module context
  export let editable = false
  export let dangerous = false
  export let title: string = ""
  export let message: string = ""
  export let fields: Field[]
  export let formTarget: string = ""
  export let successTitle = "Success"
  export let successBody = ""
  export let editButtonTitle: string = ""
  export let editLink: string = ""
  export let saveButtonTitle: string = "Save"

  const handleSubmit: SubmitFunction = () => {
    loading = true
    return async ({ update, result }) => {
      await update({ reset: false })
      await applyAction(result)
      loading = false
      if (result.type === "success") {
        showSuccess = true
      }
    }
  }
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
        <form
          class="form-widget flex flex-col"
          method="POST"
          action={formTarget}
          use:enhance={handleSubmit}
        >
          {#each fields as field}
            {#if field.label}
              <label for={field.id}>
                <span class="text-sm text-muted-foreground">{field.label}</span>
              </label>
            {/if}
            {#if editable}
              <Input
                id={field.id}
                name={field.id}
                type={field.inputType ?? "text"}
                disabled={!editable}
                placeholder={field.placeholder ?? field.label ?? ""}
                class="{fieldError($page?.form, field.id)
                  ? 'border-destructive'
                  : ''} w-full max-w-xs mb-3 py-4"
                value={$page.form ? $page.form[field.id] : field.initialValue}
                maxlength={field.maxlength ? field.maxlength : null}
              />
            {:else}
              <div class="text-lg mb-3">{field.initialValue}</div>
            {/if}
          {/each}

          {#if $page?.form?.errorMessage}
            <p class="text-destructive text-sm font-bold mt-1">
              {$page?.form?.errorMessage}
            </p>
          {/if}

          {#if editable}
            <div>
              <Button
                type="submit"
                variant="outline"
                class="ml-auto mt-3 min-w-[145px] {dangerous
                  ? 'border-destructive'
                  : ''}"
                disabled={loading}
              >
                {#if loading}
                  <span
                    class="loading loading-spinner loading-md align-middle mx-3"
                  ></span>
                {:else}
                  {saveButtonTitle}
                {/if}
              </Button>
            </div>
          {:else}
            <!-- !editable -->
            <a href={editLink} class="mt-1">
              <Button
                class="{dangerous ? 'border-destructive' : ''} min-w-[145px]"
              >
                {editButtonTitle}
              </Button>
            </a>
          {/if}
        </form>
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
