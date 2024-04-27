import { writable } from 'svelte/store';
import type { WeatherData, Location } from "$lib/interfaces/WeatherAPI";
import type { ForecastResponse } from '$lib/interfaces/Forecast';

const locationDefault: Location = {
    lat: 0,
    lon: 0,
}
let locationStore = writable<Location>(locationDefault);

const searchStoreDefault: Location = {
    lat: 0,
    lon: 0,
}
let searchStore = writable<Location>(searchStoreDefault);

const titleDefault = 'WeatherApp';
let title = writable<string>(titleDefault);

// Timezone from weather API in seconds
// Example: HK timezone = 28800 s = 8 hours

const timezoneDefault: number = 0;
let timezoneStore = writable<number>(timezoneDefault);

let msgCount = writable<number>(0);


const weatherDataDefault: WeatherData = {
    coord: {
        lon: 0,
        lat: 0,
    },
    weather: [
        {
            id: 0,
            main: '',
            description: '',
            icon: '',
        },
    ],
    base: '',
    main: {
        temp: 0,
        feels_like: 0,
        temp_min: 0,
        temp_max: 0,
        pressure: 0,
        humidity: 0,
        sea_level: 0,
        grnd_level: 0,
    },
    visibility: 0,
    wind: {
        speed: 0,
        deg: 0,
        gust: 0,
    },
    rain: {
        "1h": 0,
        "3h": 0,
    },
    snow: {
        "1h": 0,
        "3h": 0,
    },
    clouds: {
        all: 0,
    },
    dt: 0,
    sys: {
        type: 0,
        id: 0,
        country: '',
        sunrise: 0,
        sunset: 0,
    },
    timezone: 0,
    id: 0,
    name: '',
    cod: 0,
};


let weatherDataStore = writable<WeatherData>(weatherDataDefault);


const forecastDataDefault: ForecastResponse = {
    cod: "",
    message: 0,
    cnt: 0,
    list: [{
        dt: 0,
        main: {
            temp: 0,
            feels_like: 0,
            temp_min: 0,
            temp_max: 0,
            pressure: 0,
            sea_level: 0,
            grnd_level: 0,
            humidity: 0,
            temp_kf: 0,
        },
        weather: [{
            id: 0,
            main: "",
            description: "",
            icon: "",
        }],
        clouds: {
            all: 0,
        },
        wind: {
            speed: 0,
            deg: 0,
            gust: 0,
        },
        visibility: 0,
        pop: 0,
        rain: {
            "1h": 0,
            "3h": 0,
        },
        snow: {
            "1h": 0,
            "3h": 0,
        },
        sys: {
            pod: "",
        },
        dt_txt: "",
    }],
    city: {
        id: 0,
        name: "",
        coord: {
            lat: 0,
            lon: 0,
        },
        country: "",
        population: 0,
        timezone: 0,
        sunrise: 0,
        sunset: 0,
    },
};

let forecastDataStore = writable<ForecastResponse>(forecastDataDefault);

export { weatherDataStore, title, timezoneStore, msgCount, forecastDataStore, locationStore, searchStore }

