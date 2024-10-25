<script lang="ts">
  import { emailSchema } from "$lib/schemas"
  import SettingsModule from "../settings_module.svelte"

  let { data } = $props()

  let { session } = data
</script>

<svelte:head>
  <title>Change Email</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Settings</h1>

<SettingsModule
  data={data.form}
  schema={emailSchema}
  title="Change Email"
  editable={true}
  successTitle="Email change initiated"
  successBody="You should receive an email at the new address to confirm the change. Please click the link in the email to finalized the change. Until finalized, you must sign in with your current email."
  formTarget="/api?/updateEmail"
  fields={[
    {
      id: "email",
      label: "Email",
      initialValue: session?.user?.email ?? "",
      placeholder: "Email address",
    },
  ]}
/>
