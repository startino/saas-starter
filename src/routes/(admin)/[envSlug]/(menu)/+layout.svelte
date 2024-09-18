<script lang="ts">
  import { fly } from "svelte/transition"
  import { Menu } from "lucide-svelte"

  import { buttonVariants } from "$lib/components/ui/button"
  import * as Dialog from "$lib/components/ui/dialog"
  import { page } from "$app/stores"
  import { getEnvironmentState } from "$lib/states"

  let { data, children } = $props()

  let { session } = data

  let open = $state(false)

  const environment = getEnvironmentState()

  class NavItem {
    href: string
    label: string
    active: boolean

    constructor(
      href: string,
      label: string,
      isActive: (href: string) => boolean,
    ) {
      this.href = href
      this.label = label
      this.active = isActive(this.href)
    }
  }

  let navItems = $state<NavItem[]>([])

  $effect(() => {
    navItems = [
      new NavItem(
        `/${environment.slug}`,
        "home",
        (href) => $page.url.pathname === href,
      ),
      new NavItem(`/${environment.slug}/billing`, "Billing", (href) =>
        $page.url.pathname.startsWith(href),
      ),
      new NavItem(`/${environment.slug}/settings`, "Setting", (href) =>
        $page.url.pathname.startsWith(href),
      ),
    ]
  })
</script>

<div
  class="grid grid-rows-[auto_1fr] lg:grid-rows-1 lg:grid-cols-[auto_1fr] overflow-hidden top-0 bottom-0 right-0 left-0 absolute"
>
  <nav
    class="w-full h-20 flex items-center justify-between lg:block lg:w-80 lg:h-dvh p-4 bg-primary text-primary-foreground"
  >
    <a href="/" class="text-xl font-bold inline lg:hidden">Saas Starter</a>
    <Dialog.Root bind:open>
      <Dialog.Trigger class="lg:hidden"
        ><button aria-label="open navigation"><Menu /></button></Dialog.Trigger
      >
      <Dialog.Content
        transition={(node) => fly(node, { x: 300, duration: 300 })}
        class="left-auto right-0 flex h-dvh max-h-screen w-full max-w-lg translate-x-1 flex-col overflow-y-scroll border-y-0 sm:rounded-none"
      >
        <ul class="flex flex-col">
          {#each navItems as { href, label, active }}
            <li class="my-1">
              <a
                {href}
                class="{buttonVariants({
                  variant: active ? 'default' : 'ghost',
                })} w-full"
                onclick={() => (open = false)}
              >
                {label}
              </a>
            </li>
          {/each}
          <span class="flex-grow"></span>
          <li>
            <a
              href="/{environment.slug}/sign_out"
              class="{buttonVariants({ variant: 'ghost' })} w-full"
              onclick={() => (open = false)}
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

      {#each navItems as item}
        <li class="my-1">
          <a
            href={item.href}
            class="{buttonVariants({
              variant: item.active ? 'secondary' : 'ghost',
            })} w-full"
          >
            {item.label}
          </a>
        </li>
      {/each}
      <span class="flex-grow"></span>
      <li>
        <a
          href="/{environment.slug}/sign_out"
          class="{buttonVariants({ variant: 'ghost' })} w-full"
        >
          Sign Out
        </a>
      </li>
    </ul>
  </nav>

  <div class="container px-6 lg:px-12 py-3 lg:py-6 overflow-y-scroll relative">
    {#if session?.user.is_anonymous}
      <p
        class="text-sm bg-primary text-primary-foreground sticky px-4 py-2 text-center rounded-sm mb-4 md:text-base"
      >
        You're signed in as an anonymous user. <a
          href="/login/sign_up"
          class="underline">Sign Up to persist your changes</a
        >
      </p>
    {/if}

    {@render children()}
  </div>
</div>
