import { writable } from "svelte/store";
import { browser } from "$app/environment";
import type { WeatherData } from "$lib/interfaces/WeatherAPI";
import type { ForecastResponse } from "$lib/interfaces/Forecast";

const unitsDefault = 'metric'
let unitsInitial = browser ? localStorage.getItem('units') ?? unitsDefault : unitsDefault;

let units = writable<string>(unitsInitial);

units.subscribe(value => {
    if (browser) {
        localStorage.setItem('units', value);
    }
});


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
function getInitialWeatherData(): WeatherData {
    if (!browser) {
        return weatherDataDefault;
    }
    const storedData = localStorage.getItem("weatherData");
    if (!storedData) {
        return weatherDataDefault;
    }
    try {
        return JSON.parse(storedData);
    } catch (error) {
        console.error("Error parsing stored weather data", error);
        return weatherDataDefault;
    }
}

let weatherDataBrowserStore = writable<WeatherData>(getInitialWeatherData());

weatherDataBrowserStore.subscribe(value => {
    if (browser) {
        localStorage.setItem("weatherData", JSON.stringify(value));
    }
});

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

function getInitialForecastData(): ForecastResponse {
    if (!browser) {
        return forecastDataDefault;
    }
    const storedData = localStorage.getItem("forecastData");
    if (!storedData) {
        return forecastDataDefault;
    }
    try {
        return JSON.parse(storedData);
    } catch (error) {
        console.error("Error parsing stored forecast data", error);
        return forecastDataDefault;
    }
}

let forecastDataBrowserStore = writable<ForecastResponse>(getInitialForecastData());

forecastDataBrowserStore.subscribe(value => {
    if (browser) {
        localStorage.setItem("forecastData", JSON.stringify(value));
    }
});


export { weatherDataBrowserStore, forecastDataBrowserStore, units };
