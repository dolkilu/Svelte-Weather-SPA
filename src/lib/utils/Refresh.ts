import { get } from "svelte/store";
import { getWeather } from "./WeatherAPI";
import { getForecast } from "./Forecast";
import { weatherDataStore, forecastDataStore, searchStore, locationStore } from "$lib/stores/AppStore";

export async function refreshLocal() {
    const location = get(locationStore);
    const weatherData = await getWeather(location.lat, location.lon);
    const forecastData = await getForecast(location.lat, location.lon);
    weatherDataStore.set(weatherData);
    forecastDataStore.set(forecastData);
}

export async function refreshSearch() {
    const search = get(searchStore);
    const weatherData = await getWeather(search.lat, search.lon);
    const forecastData = await getForecast(search.lat, search.lon);
    weatherDataStore.set(weatherData);
    forecastDataStore.set(forecastData);
}
