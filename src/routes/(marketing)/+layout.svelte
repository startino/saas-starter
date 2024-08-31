<script lang="ts">
  import { Menu } from "lucide-svelte"
  import { Button, buttonVariants } from "$lib/components/ui/button"
  import * as DropDownMenu from "$lib/components/ui/dropdown-menu"

  import { WebsiteName } from "./../../config"
  import "../../app.css"
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
      <li class="md:mx-2">
        <a href="/account" class={buttonVariants({ variant: "ghost" })}
          >Account</a
        >
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
  <slot />
</div>

<!-- Spacer grows so the footer can be at bottom on short pages -->
<div class="flex-grow"></div>
<div class="">
  <div class="border-t max-w-[1000px] mx-auto"></div>
  <footer
    class="footer p-10 gap-x-48 lg:gap-x-64 xl:gap-x-96 place-content-center text-base"
  >
    <nav>
      <span class="footer-title opacity-80">Explore</span>
      <a class="link link-hover mb-1" href="/">Overview</a>
      <a class="link link-hover my-1" href="/pricing">Pricing</a>
      <a class="link link-hover my-1" href="/blog">Blog</a>
      <a class="link link-hover my-1" href="/contact_us">Contact Us</a>
      <a
        class="link link-hover my-1"
        href="https://github.com/CriticalMoments/CMSaasStarter">Github</a
      >
    </nav>
    <aside>
      <span class="footer-title opacity-80">Sponsor</span>
      <a
        class="link link-hover max-w-[260px]"
        href="https://criticalmoments.io"
      >
        <img
          alt="Critical Moments Logo"
          src="/images/cm_logo.svg"
          class="w-[180px] mb-3 aspect-[420/154]"
        />
        Make mobile apps? Improve conversion rates and ratings with Critical Moments.
      </a>
    </aside>
  </footer>
</div>
