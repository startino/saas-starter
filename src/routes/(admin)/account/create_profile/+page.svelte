<script lang="ts">
  import { enhance, applyAction } from "$app/forms"
  import type { SubmitFunction } from "@sveltejs/kit"
  import { Input } from "$lib/components/ui/input"
  import { Button } from "$lib/components/ui/button"

  export let data
  export let form: FormAccountUpdateResult

  let { session, profile } = data

  let loading = false
  let fullName: string = profile?.full_name ?? ""
  let companyName: string = profile?.company_name ?? ""
  let website: string = profile?.website ?? ""

  const fieldError = (liveForm: FormAccountUpdateResult, name: string) => {
    let errors = liveForm?.errorFields ?? []
    return errors.includes(name)
  }

  const handleSubmit: SubmitFunction = () => {
    loading = true
    return async ({ update, result }) => {
      await update({ reset: false })
      await applyAction(result)
      loading = false
    }
  }
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
        class="form-widget"
        method="POST"
        action="/account/api?/updateProfile"
        use:enhance={handleSubmit}
      >
        <div class="mt-4">
          <label for="fullName">
            <span class="text-center">Your Name</span>
          </label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Your full name"
            class="{fieldError(form, 'fullName')
              ? 'border-destructive'
              : ''} mt-1 w-full max-w-xs"
            value={form?.fullName ?? fullName}
          />
        </div>

        <div class="mt-4">
          <label for="companyName">
            <span class="text-center">Company Name</span>
          </label>
          <Input
            id="companyName"
            name="companyName"
            type="text"
            placeholder="Company name"
            class="{fieldError(form, 'companyName')
              ? 'border-destructive'
              : ''} mt-1 w-full max-w-xs"
            value={form?.companyName ?? companyName}
          />
        </div>

        <div class="mt-4">
          <label for="website">
            <span class="text-center">Company Website</span>
          </label>
          <Input
            id="website"
            name="website"
            type="text"
            placeholder="Company website"
            class="{fieldError(form, 'website')
              ? 'border-destructive'
              : ''} mt-1 w-full max-w-xs"
            value={form?.website ?? website}
          />
        </div>

        {#if form?.errorMessage}
          <p class="text-destructive text-sm font-bold text-center mt-3">
            {form?.errorMessage}
          </p>
        {/if}
        <div class="mt-4">
          <Button type="submit" class="mt-3" disabled={loading}>
            {#if loading}
              ...
            {:else}
              Create Profile
            {/if}
          </Button>
        </div>
      </form>

      <div class="text-sm mt-14">
        You are logged in as {session?.user?.email}.
        <br />
        <a class="underline" href="/account/sign_out"> Sign out </a>
      </div>
    </div>
  </div>
</div>
