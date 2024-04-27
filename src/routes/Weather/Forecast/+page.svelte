<script lang="ts">
  import { toCelcius, toFahrenheit } from "$lib/utils/converter";

  import { forecastDataStore, title } from "$lib/stores/AppStore";
  import { units } from "$lib/stores/BrowserStore";
  import { renderForecastPage } from "$lib/utils/Forecast";
  import type { ForecastPageData } from "$lib/interfaces/Forecast";

  import WiRaindrop from "~icons/wi/raindrop";

  $title = "Forecast";
  console.log($title);

  const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  let maxIndex = 36;
  let error: Error | null = null;
  let forecast: ForecastPageData = {
    list: [],
    city: {
      name: "",
      country: "",
      timezone: 0,
    },
  };
  let countryName = "";
  let icons: string[] = [];
  let dates: {
    hour: number;
    minute: number;
    month: number;
    day: number;
    weekday: number;
  }[] = [];

  async function react() {
    let data = await renderForecastPage();
    forecast = data.forecastData;
    countryName = data.countryName;
    icons = data.icons;
    dates = data.dates;
  }
  $: if ($forecastDataStore) {
    react();
  }
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{$title}</title>
</svelte:head>
<div
  id="MainContainer"
  class="container h-full mx-auto flex flex-col justify-between min-w-min"
>
  {#if Object.keys(forecast).length > 0}
    <div id="DataContainer" class="container mt-4 space-y-4">
      <div
        class="card p-2 h-fit mx-5 text-center dark:bg-violet-900/20 grid grid-rows-2"
      >
        <div class="row-span-1">5-Day Weather Forecast</div>
        <div class="row-span-1">
          {forecast.city.name}, {countryName}
        </div>
      </div>

      <div class="forecast space-y-2">
        {#each forecast.list as item, index}
          {#if index % 4 === 0 && index <= maxIndex}
            <div
              id="forecastCard"
              class="card p-2 h-24 mx-5
                {item.sys.pod === 'n'
                ? 'dark:bg-indigo-700/35'
                : item.sys.pod === 'd'
                  ? 'dark:bg-amber-400/35'
                  : ''} grid grid-cols-5 grid-rows-2"
            >
              <div class="flex items-center justify-center text-xl font-bold">
                {weekdays[dates[index].weekday]}
              </div>
              <div class="row-start-2 flex items-center justify-center pb-1">
                {#if icons.length > index}
                  <img
                    src={icons[index]}
                    alt="Weather icon"
                    height="70"
                    width="70"
                  />
                {/if}
              </div>

              <div class="col-start-2 text-center pt-2 -ml-2 text-lg">
                <div>
                  {dates.length > index
                    ? `${dates[index].day.toString().padStart(2, "0")}/${dates[index].month.toString().padStart(2, "0")}`
                    : "N/A"}
                </div>
                <div class="row-start-2 col-start-2 text-center pt-2">
                  {dates.length > index
                    ? `${dates[index].hour.toString().padStart(2, "0")} : ${dates[index].minute.toString().padStart(2, "0")}`
                    : "N/A"}
                </div>
              </div>
              <div class="row-span-2 flex items-center justify-center -ml-4">
                {#if $units === "metric"}
                  <div class="text-xl">
                    <div class="font-bold text-2xl">
                      {toCelcius(item.main.temp_max).toFixed(0)}°C
                    </div>
                    {toCelcius(item.main.temp_min).toFixed(0)}°C
                  </div>
                {:else}
                  <div class="text-xl">
                    <div class="font-bold text-2xl">
                      {toFahrenheit(item.main.temp_max).toFixed(0)}°F
                    </div>
                    {toFahrenheit(item.main.temp_min).toFixed(0)}°F
                  </div>
                {/if}
              </div>
              <div class="row-span-2 flex items-center justify-center">
                <div class="text-base">
                  <div class="font-bold">
                    {item.weather[0].main}
                  </div>
                  <div class="text-sm">
                    {item.weather[0].description}
                  </div>
                </div>
              </div>
              <div class="row-span-2 flex items-center justify-center mr-1">
                <div>
                  <WiRaindrop class="text-3xl -mr-2" />
                </div>
                <div class="text-2xl mr-2">
                  {(item.pop * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          {/if}
        {/each}
      </div>
    </div>
  {:else if error}
    {error.message}
  {:else}
    Loading...
  {/if}
</div>
