<script lang="ts">
  import { page } from "$app/stores"
  import { browser } from "$app/environment"
  import { onMount } from "svelte"
  import Fuse from "fuse.js"
  import { goto } from "$app/navigation"
  import { dev } from "$app/environment"
  import { Input } from "$lib/components/ui/input"
  import { Label } from "$lib/components/ui/label"

  const fuseOptions = {
    keys: [
      { name: "title", weight: 3 },
      { name: "description", weight: 2 },
      { name: "body", weight: 1 },
    ],
    ignoreLocation: true,
    threshold: 0.3,
  }

  let fuse: Fuse<Result> | undefined

  let loading = $state(true)
  let error = $state(false)
  onMount(async () => {
    try {
      const response = await fetch("/search/api.json")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const searchData = await response.json()
      if (searchData && searchData.index && searchData.indexData) {
        const index = Fuse.parseIndex(searchData.index)
        fuse = new Fuse<Result>(searchData.indexData, fuseOptions, index)
      }
    } catch (e) {
      console.error("Failed to load search data", e)
      error = true
    } finally {
      loading = false
      document.getElementById("search-input")?.focus()
    }
  })

  type Result = {
    item: {
      title: string
      description: string
      body: string
      path: string
    }
  }

  let results = $state<Result[]>([])

  // searchQuery is $page.url.hash minus the "#" at the beginning if present
  let searchQuery = $state(decodeURIComponent($page.url.hash.slice(1) ?? ""))

  $effect(() => {
    if (fuse) {
      results = fuse.search(searchQuery)
    }

    // Update the URL hash when searchQuery changes so the browser can bookmark/share the search results
    if (browser && window.location.hash.slice(1) !== searchQuery) {
      goto("#" + searchQuery, { keepFocus: true })
    }
  })

  let focusItem = 0
  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      searchQuery = ""
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      focusItem += event.key === "ArrowDown" ? 1 : -1
      if (focusItem < 0) {
        focusItem = 0
      } else if (focusItem > results.length) {
        focusItem = results.length
      }
      if (focusItem === 0) {
        document.getElementById("search-input")?.focus()
      } else {
        document.getElementById(`search-result-${focusItem}`)?.focus()
      }
    }
  }
</script>

<svelte:window onkeydown={onKeyDown} />

<svelte:head>
  <title>Search</title>
  <meta name="description" content="Search our website." />
</svelte:head>

<div class="py-8 lg:py-12 px-6 max-w-lg mx-auto">
  <div
    class="text-3xl lg:text-5xl font-medium text-primary flex gap-3 items-baseline text-center place-content-center"
  >
    <div
      class="text-center leading-relaxed font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
    >
      Search
    </div>
  </div>
  <Label class="flex items-center gap-2 mt-10">
    <Input
      id="search-input"
      type="text"
      class="grow"
      placeholder="Search"
      bind:value={searchQuery}
      onfocus={() => (focusItem = 0)}
      aria-label="Search input"
    />
  </Label>

  {#if loading && searchQuery.length > 0}
    <div class="text-center mt-10 text-xl">Loading...</div>
  {/if}

  {#if error}
    <div class="text-center mt-10 text-xl">
      Error connecting to search. Please try again later.
    </div>
  {/if}

  {#if !loading && searchQuery.length > 0 && results.length === 0 && !error}
    <div class="text-center mt-10 text-xl">No results found</div>
    {#if dev}
      <div class="text-center mt-4 font-mono">
        Development mode only message: if you're missing content, rebuild your
        local search index with `npm run build`
      </div>
    {/if}
  {/if}

  <div>
    {#each results as result, i}
      <a
        href={result.item.path || "/"}
        id="search-result-{i + 1}"
        class="card my-6 bg-white shadow-xl flex-row overflow-hidden focus:border"
      >
        <div class="flex-none w-6 md:w-32 bg-secondary"></div>
        <div class="py-6 px-6">
          <div class="text-xl">{result.item.title}</div>
          <div class="text-sm">
            {result.item.path}
          </div>
          <div class="text-muted-foreground">{result.item.description}</div>
        </div>
      </a>
    {/each}
  </div>

  <div></div>
</div>
