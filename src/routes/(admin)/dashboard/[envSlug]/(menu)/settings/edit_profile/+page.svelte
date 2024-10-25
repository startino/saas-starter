<script lang="ts">
  import SettingsModule from "../settings_module.svelte"
  import { profileSchema } from "$lib/schemas"

  let { data } = $props()

  let { profile } = data
</script>

<svelte:head>
  <title>Edit Profile</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Settings</h1>

<SettingsModule
  data={data.form}
  schema={profileSchema}
  editable={true}
  title="Edit Profile"
  successTitle="Saved Profile"
  formTarget="/api?/updateProfile"
  fields={[
    {
      id: "full_name",
      label: "Name",
      initialValue: profile?.full_name ?? "",
      placeholder: "Your full name",
      maxlength: 50,
    },
    {
      id: "company_name",
      label: "Company Name",
      initialValue: profile?.company_name ?? "",
      maxlength: 50,
    },
    {
      id: "website",
      label: "Company Website",
      initialValue: profile?.website ?? "",
      maxlength: 50,
    },
  ]}
/>
