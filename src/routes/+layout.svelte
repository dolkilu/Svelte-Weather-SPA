<script lang="ts">
  import "../app.postcss";

  import { page } from "$app/stores";

  import {
    AppShell,
    AppBar,
    TabGroup,
    TabAnchor,
    Toast,
    initializeStores,
  } from "@skeletonlabs/skeleton";

  import IcRoundHome from "~icons/ic/round-home";
  import WiSunrise from "~icons/wi/sunrise";
  import WiTime9 from "~icons/wi/time-9";

  initializeStores();
</script>

<Toast />
<!-- App Shell -->
<AppShell>
  <slot />
  <svelte:fragment slot="footer">
    <AppBar gridColumns="grid-cols-1" slotDefault="place-self-center">
      <TabGroup
        justify="justify-center"
        active="variant-ghost-secondary"
        hover="hover:variant-soft-primary"
        flex="flex-1 lg:flex-none"
        rounded="rounded"
        border="border-0"
        class="bg-surface-100-800-token w-full"
      >
        <TabAnchor
          href="/Weather/Home"
          selected={$page.url.pathname === "/Weather/Home"}
        >
          <svelte:fragment slot="lead"
            ><i class="fa-solid fa-book" /></svelte:fragment
          >
          <div class="flex items-center justify-center">
            <IcRoundHome />
          </div>

          <div class="flex items-center justify-center">Home</div>
        </TabAnchor>
        <span class="mx-3"></span>
        <TabAnchor
          href="/Weather/CurrentWeather"
          selected={$page.url.pathname === "/Weather/CurrentWeather"}
        >
          <svelte:fragment slot="lead"
            ><i class="fa-solid fa-film" /></svelte:fragment
          >
          <div class="flex items-center justify-center">
            <WiSunrise />
          </div>

          <div class="flex items-center justify-center">Today</div>
        </TabAnchor>
        <span class="mx-3"></span>
        <TabAnchor
          href="/Weather/Forecast"
          selected={$page.url.pathname === "/Weather/Forecast"}
        >
          <svelte:fragment slot="lead"
            ><i class="fa-solid fa-tv" /></svelte:fragment
          >
          <div class="flex items-center justify-center">
            <WiTime9 />
          </div>

          <div class="flex items-center justify-center">Forecast</div>
        </TabAnchor>
      </TabGroup>
    </AppBar>
  </svelte:fragment>
</AppShell>
