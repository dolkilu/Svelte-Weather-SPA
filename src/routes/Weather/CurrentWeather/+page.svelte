<script lang="ts">
  // import { onMount } from "svelte";
  import { toCelcius, toFahrenheit } from "$lib/utils/converter";

  import { weatherDataStore, title } from "$lib/stores/AppStore";
  import { units } from "$lib/stores/BrowserStore";
  import { getCurrentWeather } from "$lib/utils/CurrentWeather";
  import type { CurrentWeather } from "$lib/interfaces/CurrentWeather";

  import WiHumidity from "~icons/wi/humidity";
  import WiWuRain from "~icons/wi/wu-rain";
  import WiSnowflakeCold from "~icons/wi/snowflake-cold";
  import WiStrongWind from "~icons/wi/strong-wind";
  import WiWindDeg from "~icons/wi/wind-deg";
  import WiSunrise from "~icons/wi/sunrise";
  import WiSunset from "~icons/wi/sunset";

  $title = "Current Weather";
  console.log($title);

  let error: Error | null = null;
  let currentWeather: CurrentWeather = {
    weatherData1: {
      city: "",
      countryCode: "",
      temp: 0,
      temp_feels: 0,
      temp_min: 0,
      temp_max: 0,
      rain1h: 0,
      rain3h: 0,
      snow1h: 0,
      snow3h: 0,
      visibility: 0,
      humidity: 0,
      clouds: 0,
      wind_speed: 0,
      wind_deg: 0,
      wind_gust: 0,
    },
    weatherData2: [
      {
        weather: "",
        description: "",
        icon: "",
      },
    ],
    countryName: "",
    icons: [],
    hour: 0,
    minute: 0,
    month: 0,
    day: 0,
    srHour: 0,
    srMinute: 0,
    ssHour: 0,
    ssMinute: 0,
  };
  // onMount(async () => {
  //   try {
  //     currentWeather = await getCurrentWeather();
  //     // console.log(currentWeather);
  //   } catch (e) {
  //     error = e as Error;
  //   }
  // });
  async function react() {
    currentWeather = await getCurrentWeather();
  }
  $: if ($weatherDataStore) {
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
  <!-- Weather Data -->
  {#if Object.keys(currentWeather).length > 0}
    <div id="DataContainer" class="container mt-4 space-y-4">
      <div
        class="card p-2 h-fit mx-5 text-center dark:bg-violet-900/20 grid grid-rows-2"
      >
        <div class="row-span-1">
          {currentWeather.weatherData1.city}, {currentWeather.countryName}
        </div>
        <div>
          {currentWeather.day.toString().padStart(2, "0")}/{currentWeather.month
            .toString()
            .padStart(2, "0")}{" "}
          {currentWeather.hour.toString().padStart(2, "0")}{" : "}
          {currentWeather.minute.toString().padStart(2, "0")}
        </div>
      </div>
      {#if $units === "metric"}
        <div class="grid grid-cols-2 grid-rows-3 mx-5 h-32 gap-y-2">
          <div
            class="card flex items-center justify-center row-span-3 mr-2 text-4xl
                    dark:bg-gradient-to-r from-stone-900"
          >
            <div>
              {toCelcius(currentWeather.weatherData1.temp)}°C
            </div>
          </div>
          <div
            class="card flex items-center justify-center col-start-2 row-start-1 dark:bg-gradient-to-l from-sky-800"
          >
            Feels like: {toCelcius(currentWeather.weatherData1.temp_feels)}°C
          </div>
          <div
            class="card flex items-center justify-center col-start-2 row-start-2 dark:bg-gradient-to-l from-rose-900"
          >
            Max: {toCelcius(currentWeather.weatherData1.temp_max)}°C ↑
          </div>
          <div
            class="card flex items-center justify-center col-start-2 row-start-3 dark:bg-gradient-to-l from-emerald-900"
          >
            Min: {toCelcius(currentWeather.weatherData1.temp_min)}°C ↓
          </div>
        </div>
      {:else}
        <div class="grid grid-cols-2 grid-rows-3 mx-5 h-32 gap-y-2">
          <div
            class="card flex items-center justify-center row-span-3 mr-2 text-4xl
                    dark:bg-gradient-to-r from-stone-900"
          >
            <div>
              {toFahrenheit(currentWeather.weatherData1.temp)}°F
            </div>
          </div>
          <div
            class="card flex items-center justify-center col-start-2 row-start-1 dark:bg-gradient-to-l from-sky-800"
          >
            Feels like: {toFahrenheit(currentWeather.weatherData1.temp_feels)}°F
          </div>
          <div
            class="card flex items-center justify-center col-start-2 row-start-2 dark:bg-gradient-to-l from-rose-900"
          >
            Max: {toFahrenheit(currentWeather.weatherData1.temp_max)}°F ↑
          </div>
          <div
            class="card flex items-center justify-center col-start-2 row-start-3 dark:bg-gradient-to-l from-emerald-900"
          >
            Min: {toFahrenheit(currentWeather.weatherData1.temp_min)}°F ↓
          </div>
        </div>
      {/if}

      {#each currentWeather.weatherData2 as weather, index}
        <div class="card h-16 p-1 mx-5 grid grid-cols-2 dark:bg-violet-900/10">
          <div class="flex h-16 items-center justify-center">
            {#if currentWeather.icons[index]}
              <img
                alt="weather_icon"
                src={currentWeather.icons[index]}
                height="64"
                width="64"
              />
            {/if}
          </div>
          <div class="flex h-16 items-center justify-center text-xl">
            {weather.description}
          </div>
        </div>
      {/each}

      <div class="grid grid-cols-2 mx-5 h-9">
        <div
          class="card dark:bg-gray-200/30 mr-2 flex items-center justify-center"
        >
          Cloudiness: {currentWeather.weatherData1.clouds}%
        </div>
        <div class="card dark:bg-cyan-500/25 flex items-center justify-center">
          Humidity: {currentWeather.weatherData1.humidity}
          <WiHumidity />
        </div>
      </div>
      <div
        class="card dark:bg-gradient-to-r from-indigo-500/20 from-10% via-sky-500/20 via-30% to-emerald-500/20 to-90% mx-5 h-9 flex items-center justify-center"
      >
        Visibility: {currentWeather.weatherData1.visibility} meters
      </div>
      <div class="grid grid-cols-5 mx-5 h-9 space-x-2">
        <div
          class="card dark:bg-slate-950 col-span-1 flex items-center justify-center"
        >
          <WiWuRain />Rain
        </div>
        <div
          class="card dark:bg-cyan-500/25 col-span-2 flex items-center justify-center"
        >
          1h: {currentWeather.weatherData1.rain1h} mm
        </div>
        <div
          class="card dark:bg-cyan-500/25 col-span-2 flex items-center justify-center"
        >
          3h: {currentWeather.weatherData1.rain3h} mm
        </div>
      </div>
      <div class="grid grid-cols-5 mx-5 h-9 space-x-2">
        <div
          class="card dark:bg-slate-50 col-span-1 flex items-center justify-center text-black"
        >
          <WiSnowflakeCold />Snow
        </div>
        <div
          class="card dark:bg-cyan-500/25 col-span-2 flex items-center justify-center"
        >
          1h: {currentWeather.weatherData1.snow1h} mm
        </div>
        <div
          class="card dark:bg-cyan-500/25 col-span-2 flex items-center justify-center"
        >
          3h: {currentWeather.weatherData1.snow3h} mm
        </div>
      </div>
      <div class="grid grid-cols-2 grid-rows-2 mx-5 h-24 gap-y-2">
        <div
          class="card flex items-center justify-center col-start-1 row-start-1 mr-2 dark:bg-gradient-to-r from-fuchsia-700/60"
        >
          <WiWindDeg />: {currentWeather.weatherData1.wind_deg}°
        </div>
        <div
          class="card flex items-center justify-center col-start-1 row-start-2 mr-2 dark:bg-gradient-to-r from-indigo-900"
        >
          Gust: {currentWeather.weatherData1.wind_gust} m/s
        </div>

        <div
          class="card flex items-center justify-center row-span-2 text-3xl
                    col-start-2
                    dark:bg-gradient-to-l from-violet-900"
        >
          <div>
            <WiStrongWind />
            {currentWeather.weatherData1.wind_speed} m/s
          </div>
        </div>
      </div>
      <div class="grid grid-cols-2 grid-rows-2 mx-5">
        <div
          class="card p-2 h-fit text-center dark:bg-yellow-500/60 grid grid-rows-2 mr-2"
        >
          <div class="row-span-1 flex items-center justify-center">
            <WiSunrise />
          </div>
          <div>
            {currentWeather.srHour.toString().padStart(2, "0")} :
            {currentWeather.srMinute.toString().padStart(2, "0")}
          </div>
        </div>
        <div
          class="card p-2 h-fit text-center dark:bg-amber-600/60 grid grid-rows-2"
        >
          <div class="row-span-1 flex items-center justify-center">
            <WiSunset />
          </div>
          <div>
            {currentWeather.ssHour.toString().padStart(2, "0")} :
            {currentWeather.ssMinute.toString().padStart(2, "0")}
          </div>
        </div>
      </div>
    </div>
  {:else if error}
    {error.message}
  {:else}
    Loading...
  {/if}
</div>
