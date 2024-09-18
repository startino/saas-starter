<script lang="ts">
  import SettingsModule from "../settings_module.svelte"
  import { deleteAccountSchema } from "$lib/schemas"

  let { data } = $props()
</script>

<svelte:head>
  <title>Delete Account</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Settings</h1>

<SettingsModule
  data={data.form}
  schema={deleteAccountSchema}
  title="Delete Account"
  editable={true}
  dangerous={true}
  message="Deleting your account can not be undone."
  saveButtonTitle="Delete Account"
  successTitle="Account queued for deletion"
  successBody="Your account will be deleted shortly."
  formTarget="/account/api?/deleteAccount"
  fields={[
    {
      id: "currentPassword",
      label: "Current Password",
      initialValue: "",
      inputType: "password",
    },
  ]}
/>
