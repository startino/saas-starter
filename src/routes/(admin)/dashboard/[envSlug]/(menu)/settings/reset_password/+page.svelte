<script lang="ts">
  import { changePasswordSchema } from "$lib/schemas"
  import SettingsModule from "../settings_module.svelte"

  let { data } = $props()
  console.log({ ...data.session })
</script>

<svelte:head>
  <title>Reset Password</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Settings</h1>

<SettingsModule
  data={data.form}
  schema={changePasswordSchema}
  title="Reset Password"
  editable={true}
  saveButtonTitle="Reset Password"
  successTitle="Password Changed"
  successBody="On next sign in, use your new password."
  formTarget="/api?/updatePassword"
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
  ]}
/>
