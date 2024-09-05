<script lang="ts">
  import { page } from "$app/stores"
  import { Check } from "lucide-svelte"
  import SettingsModule from "../settings_module.svelte"
  import * as Card from "$lib/components/ui/card"
  import * as Alert from "$lib/components/ui/alert"
  import { buttonVariants } from "$lib/components/ui/button"

  export let data
  let { session, supabase } = data

  // True if definitely has a password, but can be false if they
  // logged in with oAuth or email link

  // @ts-expect-error: we ignore because Supabase does not maintain an AMR typedef
  let hasPassword = session?.user?.amr?.find((x) => x.method === "password")
    ? true
    : false

  // @ts-expect-error: we ignore because Supabase does not maintain an AMR typedef
  let usingOAuth = session?.user?.amr?.find((x) => x.method === "oauth")
    ? true
    : false

  let sendBtn: HTMLButtonElement
  let sentEmail = false
  let sendForgotPassword = () => {
    sendBtn.disabled = true
    sendBtn.textContent = "Sending..."
    let email = session?.user.email
    if (email) {
      supabase.auth
        .resetPasswordForEmail(email, {
          redirectTo: `${$page.url.origin}/auth/callback?next=%2Faccount%2Fsettings%2Freset_password`,
        })
        .then((d) => {
          sentEmail = d.error ? false : true
        })
    }
  }
</script>

<svelte:head>
  <title>Change Password</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Change Password</h1>

{#if hasPassword}
  <SettingsModule
    title="Change Password"
    editable={true}
    saveButtonTitle="Change Password"
    successTitle="Password Changed"
    successBody="On next sign in, use your new password."
    formTarget="/account/api?/updatePassword"
    fields={[
      {
        id: "newPassword1",
        label: "New Password",
        initialValue: "",
        inputType: "password",
      },
      {
        id: "newPassword2",
        label: "Confirm New Password",
        initialValue: "",
        inputType: "password",
      },
      {
        id: "currentPassword",
        label: "Current Password",
        initialValue: "",
        inputType: "password",
      },
    ]}
  />
{:else}
  <Card.Root>
    <Card.Content>
      <div class="flex flex-col gap-y-4">
        {#if usingOAuth}
          <div class="font-bold">Set Password By Email</div>
          <div>
            You use oAuth to sign in ("Sign in with Github" or similar). You can
            continue to access your account using only oAuth if you like!
          </div>
        {:else}
          <div class="font-bold">Change Password By Email</div>
        {/if}
        <div>
          The button below will send you an email at {session?.user?.email} which
          will allow you to set your password.
        </div>
        <button
          class="{buttonVariants({ variant: 'outline' })} {sentEmail
            ? 'hidden'
            : ''}"
          bind:this={sendBtn}
          on:click={sendForgotPassword}
          >Send Set Password Email
        </button>
        <Alert.Root>
          <Check class="h-4 w-4 {sentEmail ? '' : 'hidden'}" />
          <Alert.Description>
            Sent email! Please check your inbox and use the link to set your
            password.
          </Alert.Description>
        </Alert.Root>
      </div>
    </Card.Content>
  </Card.Root>
{/if}
