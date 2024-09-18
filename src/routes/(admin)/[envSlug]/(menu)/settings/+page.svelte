<script lang="ts">
  import SettingsModule from "./settings_module.svelte"
  import { getEnvironmentState } from "$lib/states/index"
  import { buttonVariants } from "$lib/components/ui/button"

  let { data } = $props()
  let { profile, user } = data

  const environment = getEnvironmentState()
</script>

<svelte:head>
  <title>Settings</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Settings</h1>
{#if !user?.is_anonymous}
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
    editLink="/{environment.slug}/settings/edit_profile"
  />

  <SettingsModule
    title="Email"
    editable={false}
    fields={[{ id: "email", initialValue: user?.email || "" }]}
    editButtonTitle="Change Email"
    editLink="/{environment.slug}/settings/change_email"
  />

  <SettingsModule
    title="Password"
    editable={false}
    fields={[{ id: "password", initialValue: "••••••••••••••••" }]}
    editButtonTitle="Change Password"
    editLink="/{environment.slug}/settings/change_password"
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
    editLink="/{environment.slug}/settings/change_email_subscription"
  />

  <SettingsModule
    title="Danger Zone"
    editable={false}
    dangerous={true}
    fields={[]}
    editButtonTitle="Delete Account"
    editLink="/{environment.slug}/settings/delete_account"
  />
{:else}
  <p>
    You need to <a href="/login/sign_up" class={buttonVariants({ size: "sm" })}
      >sign up</a
    > to update your settings
  </p>
{/if}
