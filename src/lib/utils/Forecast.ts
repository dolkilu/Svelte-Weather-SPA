import { PUBLIC_API_KEY } from '$env/static/public';
import { get } from 'svelte/store';
import type { Location } from '$lib/interfaces/WeatherAPI';
import type { ForecastData, ForecastResponse, ForecastItem, ForecastPageData } from '$lib/interfaces/Forecast';
import { calculateTime, getWeatherIcon, getCountryName } from '$lib/utils/WeatherAPI';
import { forecastDataStore, locationStore } from '$lib/stores/AppStore';
import { forecastDataBrowserStore } from '$lib/stores/BrowserStore';

const getForecastURL = (lat: number, lon: number): string => {
    return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${PUBLIC_API_KEY}`;
}

export const getForecast = async (lat: number, lon: number): Promise<ForecastResponse> => {
    const URL = getForecastURL(lat, lon);
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await response.json();
    }
    catch (error) {
        console.error("Error fetching forecast data", error);
        throw new Error("Failed to fetch forecast data");
    }
}

const isOutdated = (seconds: number) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const data = get(forecastDataBrowserStore)
    console.log("currentTime", currentTime);

    if (!data) {
        return true;
    }
    const storedTime = data.list[0].dt;
    console.log("Forecast Store Time", storedTime);
    return (currentTime - storedTime) > seconds;
}

const organizeForecastData = (data: ForecastResponse) => {
    const forecastData: ForecastData = {
        list: data.list.map((item) => ({
            dt: item.dt,
            main: {
                temp: item.main.temp,
                temp_min: item.main.temp_min,
                temp_max: item.main.temp_max,
                humidity: item.main.humidity,
            },
            weather: item.weather.map((weather) => ({
                description: weather.description,
                icon: weather.icon,
            })),

        })),
        city: {
            name: data.city.name,
            timezone: data.city.timezone,
        },
    }
    return forecastData;
}

const getHomeItems = (forecastData: ForecastData) => {
    const firstItem: ForecastItem = forecastData.list[0];
    const fifthItem: ForecastItem = forecastData.list[4];
    const iconA = getWeatherIcon(firstItem.weather[0].icon);
    const iconB = getWeatherIcon(fifthItem.weather[0].icon);
    // console.log("First item " + JSON.stringify(firstItem));
    // console.log("Fifth item " + JSON.stringify(fifthItem));
    return { firstItem, fifthItem, iconA, iconB };
}

const processHomeForecastData = async (data: ForecastResponse) => {
    const forecastData = organizeForecastData(data);
    const { firstItem, fifthItem, iconA, iconB } = getHomeItems(forecastData);
    const timezone = data.city.timezone;
    const { hour: hourA, minute: minuteA, month: monthA, day: dayA } = calculateTime(firstItem.dt, timezone);
    const { hour: hourB, minute: minuteB, month: monthB, day: dayB } = calculateTime(fifthItem.dt, timezone);
    return { firstItem, fifthItem, iconA, iconB, hourA, minuteA, monthA, dayA, hourB, minuteB, monthB, dayB };
}

export async function getForecastData() {
    try {
        const userLocation: Location = get(locationStore);
        let data: ForecastResponse;
        let timeCheck: boolean = isOutdated(900);
        if (!timeCheck) {
            data = get(forecastDataBrowserStore);
            console.log("Get data from forecastDataBrowserStore");

            if (!data) {
                throw new Error("Failed to fetch weather data from store");
            }
        } else {
            data = await getForecast(userLocation.lat, userLocation.lon);
            console.log("Forecast API called");
            forecastDataBrowserStore.set(data);

            if (!data) {
                throw new Error("failed to fetch weather data from API");
            }
        }
        forecastDataStore.set(data);

    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch weather data");
    }
}

export async function onHomeMountForecast() {
    try {
        const storedData = get(forecastDataStore);
        if (storedData.list[0].dt === 0) {
            await getForecastData();
        }
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch forecast data");
    }
}


export async function renderForecastHome() {
    const data = get(forecastDataStore);
    console.log("Rendering Forecast Data")
    return await processHomeForecastData(data);
}

//Forecast Page
const organizeForecastPageData = (data: ForecastResponse) => {
    const forecastData: ForecastPageData = {
        list: data.list.map((item) => ({
            dt: item.dt,
            main: {
                temp_min: item.main.temp_min,
                temp_max: item.main.temp_max,
            },
            weather: item.weather.map((weather) => ({
                main: weather.main,
                description: weather.description,
                icon: weather.icon,
            })),
            pop: item.pop,
            sys: {
                pod: item.sys.pod,
            },
        })),
        city: {
            name: data.city.name,
            timezone: data.city.timezone,
            country: data.city.country,
        },
    }
    return forecastData;
}
const getIconsPath = (data: ForecastPageData) => {
    return data.list.map(item => {
        return item.weather.map(weather => getWeatherIcon(weather.icon));
    }).flat();
}

const getForecastDates = (data: ForecastPageData) => {
    return data.list.map((item) => {
        const { hour, minute, month, day, weekday } = calculateTime(item.dt, data.city.timezone);
        return { hour, minute, month, day, weekday };
    });
}

const processForecastPageData = async (data: ForecastResponse) => {
    const forecastData = organizeForecastPageData(data);
    const countryName = getCountryName(forecastData.city.country);
    const icons = getIconsPath(forecastData);
    const dates = getForecastDates(forecastData);
    return { forecastData, countryName, icons, dates };
}

export async function renderForecastPage() {
    const data = get(forecastDataStore);
    console.log("Rendering Forecast Data")
    return await processForecastPageData(data);
}
