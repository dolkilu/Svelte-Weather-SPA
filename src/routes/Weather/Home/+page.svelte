<script lang="ts">
  import { onMount } from "svelte";
  import { onHomeMount, renderData } from "$lib/utils/WeatherAPI";
  import { onHomeMountForecast, renderForecastHome } from "$lib/utils/Forecast";
  import type { HomePageTodayData } from "$lib/interfaces/WeatherAPI";
  import type { HomePageForecastData } from "$lib/interfaces/Forecast";
  import { toCelcius, toFahrenheit } from "$lib/utils/converter";

  import { units } from "$lib/stores/BrowserStore";
  import { title, msgCount, weatherDataStore } from "$lib/stores/AppStore";

  import { getToastStore } from "@skeletonlabs/skeleton";
  import type { ToastSettings } from "@skeletonlabs/skeleton";

  const toastStore = getToastStore();

  $title = "Home";
  console.log($title);
  let mounted: boolean = false;
  let error: Error | null = null;
  let msg: string | null = null;
  let todayData: HomePageTodayData = {
    weatherData: {
      city: "",
      countryCode: "",
      temp: 0,
      temp_min: 0,
      temp_max: 0,
      humidity: 0,
      weather: "",
      description: "",
      icon: "",
    },
    countryName: "",
    icon: "",
    hour: 0,
    minute: 0,
  };
  let forecastData: HomePageForecastData = {
    firstItem: {
      dt: 0,
      main: { temp: 0, temp_min: 0, temp_max: 0, humidity: 0 },
      weather: [{ description: "", icon: "" }],
    },
    fifthItem: {
      dt: 0,
      main: { temp: 0, temp_min: 0, temp_max: 0, humidity: 0 },
      weather: [{ description: "", icon: "" }],
    },
    iconA: "",
    iconB: "",
    hourA: 0,
    minuteA: 0,
    monthA: 0,
    dayA: 0,
    hourB: 0,
    minuteB: 0,
    monthB: 0,
    dayB: 0,
  };
  let toastMsg: string =
    "Access to geolocation is denied or not supported. Using default location (HK).";

  onMount(async () => {
    try {
      msg = await onHomeMount();
      await onHomeMountForecast();
      if (msg) {
        toastMsg = msg;
      }
      mounted = true;
    } catch (e) {
      error = e as Error;
    }
  });
  async function react() {
    todayData = await renderData();
    forecastData = await renderForecastHome();
  }
  const t: ToastSettings = {
    message: toastMsg,
    timeout: 20000,
    background: "variant-filled-error",
  };
  $: if (mounted) {
    if ($weatherDataStore) {
      react();
    }
  }
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{$title}</title>
</svelte:head>
<div
  id="HomePageContainer"
  class="container h-full mx-auto flex flex-col justify-between min-w-min"
>
  <!-- Permissions Alert -->
  {#if msg && $msgCount == 0}
    {toastStore.trigger(t)}
    {msgCount.update((n) => n + 1)}
  {/if}
  <!-- Weather Data -->
  {#if Object.keys(todayData).length > 0}
    <div id="DataContainer" class="container mt-4 space-y-4">
      <div
        class="card p-2 h-fit mx-5 grid grid-rows-9 justify-center items-center dark:bg-gradient-to-b from-gray-400/80
            dark:shadow-lg dark:shadow-inherit"
      >
        <div class="flex justify-center row-span-2 object-contain">
          {#if todayData.icon}
            <img alt="weather_icon" src={todayData.icon} />{/if}
        </div>
        <div class="row-span-1 text-center text-sm">
          <div>
            {todayData.weatherData.description}
          </div>
        </div>
        <div class="row-span-3 text-center text-8xl row">
          {#if $units === "metric"}
            {toCelcius(todayData.weatherData.temp)}°C
          {:else}
            {toFahrenheit(todayData.weatherData.temp)}°F
          {/if}
        </div>
        <div class="row-span-2 text-center">
          <div class="pb-1">
            <button
              class="btn variant-ghost-primary w-60 dark:shadow-lg dark:shadow-inherit"
            >
              {todayData.weatherData.city}
            </button>
          </div>
          <div class="pt-1">
            <button
              class="btn variant-ghost-secondary w-60 dark:shadow-lg dark:shadow-inherit"
            >
              {todayData.countryName}
            </button>
          </div>
        </div>

        <div class="row-span-1 text-center pt-1">
          {todayData.hour.toString().padStart(2, "0")} :
          {todayData.minute.toString().padStart(2, "0")}
        </div>
      </div>
      {#if $units === "metric"}
        <div class="grid grid-cols-2 grid-rows-2 mx-5 h-24 gap-y-2">
          <div
            class="card flex items-center justify-center row-span-2 text-xl
                    dark:bg-cyan-500/25"
          >
            <div>
              Humidity: {todayData.weatherData.humidity} %
            </div>
          </div>

          <div
            class="card flex items-center justify-center col-start-2 row-start-1 ml-2 dark:bg-gradient-to-l from-rose-900"
          >
            Max: {toCelcius(todayData.weatherData.temp_max)}°C ↑
          </div>
          <div
            class="card flex items-center justify-center col-start-2 row-start-2 ml-2 dark:bg-gradient-to-l from-emerald-900"
          >
            Min: {toCelcius(todayData.weatherData.temp_min)}°C ↓
          </div>
        </div>
      {:else}
        <div class="grid grid-cols-2 grid-rows-2 mx-5 h-24 gap-y-2">
          <div
            class="card flex items-center justify-center row-span-2 text-xl
                    dark:bg-cyan-500/25"
          >
            <div>
              Humidity: {todayData.weatherData.humidity} %
            </div>
          </div>

          <div
            class="card flex items-center justify-center col-start-2 row-start-1 ml-2 dark:bg-gradient-to-l from-rose-900"
          >
            Max: {toFahrenheit(todayData.weatherData.temp_max)}°F ↑
          </div>
          <div
            class="card flex items-center justify-center col-start-2 row-start-2 ml-2 dark:bg-gradient-to-l from-emerald-900"
          >
            Min: {toFahrenheit(todayData.weatherData.temp_min)}°F ↓
          </div>
        </div>
      {/if}
      <!-- Forecast 2days -->
      <div class="grid grid-row-2 mx-5 space-y-2">
        <div
          id="forecast1"
          class="card p-2 flex justify-center items-center
    dark:bg-sky-400/5 dark:shadow-lg dark:shadow-inherit"
        >
          {forecastData.dayA
            .toString()
            .padStart(2, "0")}{"/"}{forecastData.monthA
            .toString()
            .padStart(2, "0")}{" "}
          {forecastData.hourA
            .toString()
            .padStart(2, "0")}{" : "}{forecastData.minuteA
            .toString()
            .padStart(2, "0")}{" "}
          {#if $units === "metric"}
            {toCelcius(forecastData.firstItem.main.temp)}°C
          {:else}
            {toFahrenheit(forecastData.firstItem.main.temp)}°F
          {/if}
          {#if forecastData.iconA}
            <img
              alt="weather_iconFA"
              src={forecastData.iconA}
              width="40"
              height="40"
            />{/if}
          {forecastData.firstItem.weather[0].description}
        </div>
        <div
          id="forecast2"
          class="card p-2 flex justify-center items-center
    dark:bg-sky-400/5 dark:shadow-lg dark:shadow-inherit"
        >
          {forecastData.dayB
            .toString()
            .padStart(2, "0")}{"/"}{forecastData.monthB
            .toString()
            .padStart(2, "0")}{" "}
          {forecastData.hourB
            .toString()
            .padStart(2, "0")}{" : "}{forecastData.minuteB
            .toString()
            .padStart(2, "0")}{" "}
          {#if $units === "metric"}
            {toCelcius(forecastData.fifthItem.main.temp)}°C
          {:else}
            {toFahrenheit(forecastData.fifthItem.main.temp)}°F
          {/if}
          <div>
            {#if forecastData.iconB}
              <img
                alt="weather_iconFB"
                src={forecastData.iconB}
                width="40"
                height="40"
              />{/if}
          </div>
          {forecastData.fifthItem.weather[0].description}
        </div>
      </div>
    </div>
  {:else if error}
    {error.message}
  {:else}
    Loading...
  {/if}
</div>
