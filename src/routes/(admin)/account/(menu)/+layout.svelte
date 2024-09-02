<script lang="ts">
  import { fly } from "svelte/transition"
  import { writable } from "svelte/store"
  import { setContext } from "svelte"
  import { Menu } from "lucide-svelte"

  import { buttonVariants } from "$lib/components/ui/button"
  import * as Dialog from "$lib/components/ui/dialog"

  const adminSectionStore = writable("")
  setContext("adminSection", adminSectionStore)
  let adminSection: string
  adminSectionStore.subscribe((value) => {
    adminSection = value
  })

  const navItems = [
    {
      href: "/account",
      section: "home",
      label: "Home",
    },
    {
      href: "/account/billing",
      section: "billing",
      label: "Billing",
    },
    {
      href: "/account/settings",
      section: "settings",
      label: "Settings",
    },
  ]
</script>

<div
  class="grid grid-rows-[auto_1fr] lg:grid-rows-1 lg:grid-cols-[auto_1fr] overflow-hidden top-0 bottom-0 right-0 left-0 absolute"
>
  <nav
    class="w-full h-20 flex items-center justify-between lg:block lg:w-80 lg:h-dvh p-4 bg-primary text-primary-foreground"
  >
    <a href="/" class="text-xl font-bold inline lg:hidden">Saas Starter</a>
    <Dialog.Root>
      <Dialog.Trigger class="lg:hidden"
        ><button aria-label="open navigation"><Menu /></button></Dialog.Trigger
      >
      <Dialog.Content
        transition={(node) => fly(node, { x: 300, duration: 300 })}
        class="left-auto right-0 flex h-dvh max-h-screen w-full max-w-lg translate-x-1 flex-col overflow-y-scroll border-y-0 sm:rounded-none"
      >
        <ul class="flex flex-col">
          {#each navItems as { href, section, label }}
            <li class="my-1">
              <a
                {href}
                class="{buttonVariants({
                  variant: adminSection === section ? 'secondary' : 'ghost',
                })} w-full"
              >
                {label}
              </a>
            </li>
          {/each}
          <span class="flex-grow" />
          <li>
            <a
              href="/account/sign_out"
              class="{buttonVariants({ variant: 'ghost' })} w-full"
            >
              Sign Out
            </a>
          </li>
        </ul>
      </Dialog.Content>
    </Dialog.Root>
    <ul class="hidden flex-col h-full lg:flex">
      <li class="mb-6">
        <a href="/" class="text-xl font-bold">Saas Starter</a>
      </li>

      {#each navItems as { href, section, label }}
        <li class="my-1">
          <a
            {href}
            class="{buttonVariants({
              variant: adminSection === section ? 'secondary' : 'ghost',
            })} w-full"
          >
            {label}
          </a>
        </li>
      {/each}
      <span class="flex-grow" />
      <li>
        <a
          href="/account/sign_out"
          class="{buttonVariants({ variant: 'ghost' })} w-full"
        >
          Sign Out
        </a>
      </li>
    </ul>
  </nav>

  <div class="container px-6 lg:px-12 py-3 lg:py-6 overflow-y-scroll">
    <slot />
  </div>
</div>
