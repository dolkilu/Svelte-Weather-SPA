<script>
  import { browser } from "$app/environment";
  import { units } from "$lib/stores/BrowserStore";
  import { title } from "$lib/stores/AppStore";
  import { refreshLocal, refreshSearch } from "$lib/utils/Refresh";

  import {
    RadioGroup,
    RadioItem,
    AppBar,
    AppShell,
  } from "@skeletonlabs/skeleton";
  import IcBaselineSearch from "~icons/ic/baseline-search";
  import IcBaselineRefresh from "~icons/ic/baseline-refresh";

  $: {
    if (browser) {
      localStorage.setItem("units", $units);
    }
  }
</script>

<AppShell>
  <svelte:fragment slot="header">
    <!-- App Bar -->
    <AppBar
      gridColums="grid-cols-2"
      slotDefault="place-self-center"
      slotTrail="place-content-end"
    >
      <svelte:fragment slot="lead">
        <div class="ml-2">{$title}</div>
      </svelte:fragment>

      <svelte:fragment slot="trail">
        <button class="btn-icon bg-inherit" on:click={refreshLocal}>
          L
          <IcBaselineRefresh />
        </button>
        <button class="btn-icon bg-inherit" on:click={refreshSearch}>
          S
          <IcBaselineRefresh />
        </button>
        <a href="/Search">
          <button class="btn-icon bg-inherit">
            <IcBaselineSearch />
          </button>
        </a>
        <RadioGroup
          active="variant-filled-primary"
          hover="hover:variant-soft-primary"
        >
          <RadioItem bind:group={$units} name="units" value={"metric"}>
            C
          </RadioItem>
          <RadioItem bind:group={$units} name="units" value={"imperial"}
            >F</RadioItem
          >
        </RadioGroup>
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>
  <slot />
</AppShell>
