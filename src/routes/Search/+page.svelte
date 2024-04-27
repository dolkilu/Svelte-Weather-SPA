<script lang="ts">
  import { writable } from "svelte/store";
  import { searchLocations, searchFetch } from "$lib/utils/Search";
  import type { SearchLocation } from "$lib/utils/Location";

  import { title } from "$lib/stores/AppStore";

  import IcBaselineSearch from "~icons/ic/baseline-search";

  $title = "Search";
  console.log($title);

  let searchQuery: string = "";
  const searchResults = writable<SearchLocation[]>([]);

  let timeout: any;
  let searching: boolean = false;

  function handleSearch() {
    searching = true;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(updateSearchResults, 500);
  }

  function updateSearchResults() {
    if (!searchQuery) {
      searchResults.set([]);
      searching = false;
      return;
    }
    searchResults.set(searchLocations(searchQuery));
  }
</script>

<svelte:head>
  {$title}
</svelte:head>

<div class="container p-4">
  <div
    class="search-container flex items-center variant-glass-secondary border border-transparent py-2 mb-2"
  >
    <IcBaselineSearch class="w-5 h-5 mr-2" />
    <input
      type="search"
      placeholder="Search By City or Country"
      class="input flex-1 dark:bg-transparent"
      bind:value={searchQuery}
      on:input={handleSearch}
    />
  </div>
  <div class="list-nav flex-row">
    <ul>
      {#each $searchResults as result}
        <div class="dark:variant-soft-surface mb-2 w-full">
          <a
            href="/Weather/Home/"
            on:click={() => searchFetch(result.lat, result.lon)}
          >
            <li>
              <span class="flex-auto">{result.city}, {result.country}</span>
            </li>
          </a>
        </div>
      {/each}
    </ul>
  </div>
</div>

<style>
  .search-container {
    display: flex;
    align-items: center;

    padding: 0.5rem 1rem;
  }

  .search-container .input {
    flex-grow: 1;

    border: none;
    outline: none;
  }
</style>
