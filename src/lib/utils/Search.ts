import { locations } from '$lib/utils/Location';
import type { SearchLocation } from '$lib/utils/Location';
import uFuzzy from '@leeoniya/ufuzzy';
import { getWeather } from '$lib/utils/WeatherAPI';
import { getForecast } from '$lib/utils/Forecast';
import { weatherDataStore, forecastDataStore, searchStore } from '$lib/stores/AppStore';

export const searchLocations = (query: string): SearchLocation[] => {
    const map = locations.map(loc => `${loc.country}, ${loc.city}`);
    let opts = {};

    const uf = new uFuzzy(opts);
    let results: SearchLocation[] = [];


    let idxs = uf.filter(map, query);

    if (idxs != null && idxs.length > 0) {
        let infoThresh = 1000;

        if (idxs.length <= infoThresh) {
            let info = uf.info(idxs, map, query);
            let order = uf.sort(info, map, query);

            order = order.slice(0, 20);
            results = order.map(i => locations[info.idx[i]]);
        } else {
            results = idxs.map(i => locations[i]);
        }
    }
    // No matches
    return results;
}

export async function searchFetch(lat: number, lon: number) {
    searchStore.set({ lat, lon });
    const data = await getWeather(lat, lon);
    const forecastData = await getForecast(lat, lon);
    weatherDataStore.set(data);
    forecastDataStore.set(forecastData);
    console.log("APIs called");
    if (!data) {
        throw new Error("failed to fetch weather data from API");
    }
}


