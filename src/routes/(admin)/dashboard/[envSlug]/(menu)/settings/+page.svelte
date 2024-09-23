<script lang="ts">
  import SettingsModule from "./settings_module.svelte"
  import { getEnvironmentState } from "$lib/states/index"
  import { buttonVariants } from "$lib/components/ui/button"

  let { data } = $props()
  let { profile, auth } = data

  const environment = getEnvironmentState()
</script>

<svelte:head>
  <title>Settings</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Settings</h1>
{#if !auth.user?.is_anonymous}
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
    editLink="/dashboard/{environment.value?.slug}/settings/edit_profile"
  />

  <SettingsModule
    title="Email"
    editable={false}
    fields={[{ id: "email", initialValue: auth.user?.email || "" }]}
    editButtonTitle="Change Email"
    editLink="/dashboard/{environment.value?.slug}/settings/change_email"
  />

  <SettingsModule
    title="Password"
    editable={false}
    fields={[{ id: "password", initialValue: "••••••••••••••••" }]}
    editButtonTitle="Change Password"
    editLink="/dashboard/{environment.value?.slug}/settings/change_password"
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
    editLink="/dashboard/{environment.value
      ?.slug}/settings/change_email_subscription"
  />

  <SettingsModule
    title="Danger Zone"
    editable={false}
    dangerous={true}
    fields={[]}
    editButtonTitle="Delete Account"
    editLink="/dashboard/{environment.value?.slug}/settings/delete_account"
  />
{:else}
  <p>
    You need to <a href="/login/sign_up" class={buttonVariants({ size: "sm" })}
      >sign up</a
    > to update your settings
  </p>
{/if}
