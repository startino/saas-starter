<script lang="ts">
  import SettingsModule from "./settings_module.svelte"

  export let data
  let { session, profile } = data
</script>

<svelte:head>
  <title>Settings</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Settings</h1>

<SettingsModule
  title="Profile"
  editable={false}
  fields={[
    { id: "fullName", label: "Name", initialValue: profile?.full_name ?? "" },
    {
      id: "companyName",
      label: "Company Name",
      initialValue: profile?.company_name ?? "",
    },
    {
      id: "website",
      label: "Company Website",
      initialValue: profile?.website ?? "",
    },
  ]}
  editButtonTitle="Edit Profile"
  editLink="/account/settings/edit_profile"
/>

{#if !session?.user.is_anonymous}
  <SettingsModule
    title="Email"
    editable={false}
    fields={[{ id: "email", initialValue: session?.user?.email || "" }]}
    editButtonTitle="Change Email"
    editLink="/account/settings/change_email"
  />
{/if}

<SettingsModule
  title="Password"
  editable={false}
  fields={[{ id: "password", initialValue: "••••••••••••••••" }]}
  editButtonTitle="Change Password"
  editLink="/account/settings/change_password"
/>

<SettingsModule
  title="Email Subscription"
  editable={false}
  fields={[
    {
      id: "subscriptionStatus",
      initialValue: profile?.unsubscribed ? "Unsubscribed" : "Subscribed",
    },
  ]}
  editButtonTitle="Change Subscription"
  editLink="/account/settings/change_email_subscription"
/>

<SettingsModule
  title="Danger Zone"
  editable={false}
  dangerous={true}
  fields={[]}
  editButtonTitle="Delete Account"
  editLink="/account/settings/delete_account"
/>
