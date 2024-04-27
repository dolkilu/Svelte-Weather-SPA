<script>
  import { browser } from "$app/environment";
  import { title } from "$lib/stores/AppStore";

  import { AppBar, AppShell } from "@skeletonlabs/skeleton";
  import IcBaselineArrowBack from "~icons/ic/baseline-arrow-back";

  function nav_back() {
    if (browser) {
      window.history.back();
    }
  }
</script>

<AppShell>
  <svelte:fragment slot="header">
    <AppBar
      gridColums="grid-cols-3"
      slotDefault="place-self-center"
      slotTrail="place-content-end"
    >
      <svelte:fragment slot="lead">
        <button class="btn-icon bg-inherit" on:click={nav_back}>
          <IcBaselineArrowBack />
        </button>
      </svelte:fragment>
      <div class="mr-8">{$title}</div>
      <svelte:fragment slot="trail"></svelte:fragment>
    </AppBar>
  </svelte:fragment>
  <slot />
</AppShell>
