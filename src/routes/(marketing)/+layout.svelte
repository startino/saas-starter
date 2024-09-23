<script lang="ts">
  import { Menu } from "lucide-svelte"
  import { Button, buttonVariants } from "$lib/components/ui/button"
  import * as DropDownMenu from "$lib/components/ui/dropdown-menu"
  import { getEnvironmentState } from "$lib/states/environment.svelte"

  import { WebsiteName } from "$lib/config"

  let { data, children } = $props()
  const environment = getEnvironmentState()
</script>

<div class="flex py-4 bg-primary text-primary-foreground container mx-auto">
  <div class="flex-1">
    <Button variant="ghost" href="/" class="text-lg">
      {WebsiteName}
    </Button>
  </div>
  <div class="flex-none">
    <ul class="px-1 hidden sm:flex font-bold text-lg">
      <li class="md:mx-2">
        <a href="/pricing" class={buttonVariants({ variant: "ghost" })}
          >Pricing</a
        >
      </li>
      {#if data.auth.user?.is_anonymous && !environment.value}
        <li class="md:mx-2">
          <a href="/login/sign_in" class={buttonVariants({ variant: "ghost" })}
            >Sign In</a
          >
        </li>
      {/if}
      {#if !data.auth.user?.is_anonymous}
        <li class="md:mx-2">
          <a href="/sign_out" class={buttonVariants({ variant: "ghost" })}
            >Sign Out</a
          >
        </li>
      {/if}
      <li class="md:mx-2">
        {#if !environment.value}
          <a href="/onboarding" class={buttonVariants({ variant: "ghost" })}>
            Get Started
          </a>
        {:else}
          <a
            href="/dashboard/{environment.value.slug}"
            class={buttonVariants({ variant: "ghost" })}
          >
            {environment.value.name}
          </a>
        {/if}
      </li>
    </ul>

    <div class="sm:hidden">
      <DropDownMenu.Root>
        <DropDownMenu.Trigger asChild let:builder>
          <Button builders={[builder]}><Menu /></Button>
        </DropDownMenu.Trigger>
        <DropDownMenu.Content class="w-56 sm:hidden">
          <DropDownMenu.Item>
            <a href="/pricing" class="w-full">Pricing</a>
          </DropDownMenu.Item>
          <DropDownMenu.Item>
            <a href="/account" class="w-full">Account</a>
          </DropDownMenu.Item>
        </DropDownMenu.Content>
      </DropDownMenu.Root>
    </div>
  </div>
</div>

<div class="">
  {@render children()}
</div>

<!-- Spacer grows so the footer can be at bottom on short pages -->
<div class="flex-grow"></div>
<div class="">
  <div class="border-t max-w-[1000px] mx-auto"></div>
  <footer
    class="grid gap-y-6 md:grid-cols-[auto_auto] p-10 gap-x-48 lg:gap-x-64 xl:gap-x-96 place-content-center text-base"
  >
    <nav class="grid gap-1 justify-center md:justify-end">
      <span class="font-bold text-2xl mb-2 block opacity-80">Explore</span>
      <a class="hover:underline" href="/">Overview</a>
      <a class="hover:underline" href="/pricing">Pricing</a>
      <a class="hover:underline" href="/blog">Blog</a>
      <a class="hover:underline" href="/contact_us">Contact Us</a>
      <a class="hover:underline" href="https://github.com/startino/saas-starter"
        >Github</a
      >
    </nav>
    <aside>
      <span class="text-center font-bold text-2xl mb-2 block opacity-80"
        >Startino</span
      >
      <a class=" max-w-[260px]" href="https://criticalmoments.io">
        <img
          alt="Startino Logo"
          src="/images/startino_logo.svg"
          class="w-[150px] mb-3"
        />
      </a>
    </aside>
  </footer>
</div>
