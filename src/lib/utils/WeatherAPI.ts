import { PUBLIC_API_KEY } from '$env/static/public';
import { countryCodeMap } from './ISO3166-1-alpha2';
import { getUserLocation } from './geoLocation';
import type { Location, WeatherData } from '$lib/interfaces/WeatherAPI';
import { get } from 'svelte/store';
import { weatherDataBrowserStore } from '$lib/stores/BrowserStore';
import { weatherDataStore, timezoneStore } from '$lib/stores/AppStore';


const getWeatherURL = (lat: number, lon: number): string => {

    return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${PUBLIC_API_KEY}`;
};


export const getWeather = async (lat: number, lon: number): Promise<WeatherData> => {
    const URL = getWeatherURL(lat, lon);
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await response.json();
    }
    catch (error) {
        console.error("Error fetching weather data", error);
        throw new Error("Failed to fetch weather data");
    }

}

const organizeHomeWeatherData = (data: WeatherData) => {
    const weatherData = {
        city: data.name,
        countryCode: data.sys.country,
        temp: data.main.temp,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,
        humidity: data.main.humidity,
        weather: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
    };

    return weatherData;
}

export const getCountryName = (countryCode: string) => {
    const countryName = countryCodeMap[countryCode];
    return countryName;
}

export const getWeatherIcon = (icon: string) => {
    const path = "/assets/";

    const iconName: string = icon + ".png";
    return path + iconName;
}

const isOutdated = (seconds: number) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const data = get(weatherDataBrowserStore);
    console.log("currentTime", currentTime);

    if (!data) {
        return true;
    }
    const storedTime = data.dt;
    console.log("Weather Store Time", storedTime);
    return (currentTime - storedTime) > seconds;
}

export const calculateTime = (dt: number, timezone: number) => {
    // If timezone from user's location, diff = 0
    const userTimezone: number = get(timezoneStore);
    const timezoneDiff = userTimezone - timezone;
    const time = dt - timezoneDiff;
    const date = new Date(time * 1000);
    const hour = date.getHours();
    const minute = date.getMinutes();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = date.getDay();
    return { hour, minute, month, day, weekday };
}

const processHomeWeatherData = (data: WeatherData) => {
    const weatherData = organizeHomeWeatherData(data);
    const countryName = getCountryName(weatherData.countryCode);
    const icon = getWeatherIcon(weatherData.icon);
    const { hour, minute } = calculateTime(data.dt, data.timezone);
    return { weatherData, countryName, icon, hour, minute };

}

async function getHomeDefault() {
    try {
        const userLocation: Location = await getUserLocation();
        const msg: string | null = userLocation.message || null;
        let data: WeatherData;
        let timeCheck: boolean = isOutdated(300);
        if (!timeCheck) {
            data = get(weatherDataBrowserStore);
            console.log("Get data from weatherDataBrowserStore");

            if (!data) {
                throw new Error("Failed to fetch weather data from store");
            }
        } else {
            data = await getWeather(userLocation.lat, userLocation.lon);
            console.log("Weather API called");
            weatherDataBrowserStore.set(data);

            if (!data) {
                throw new Error("failed to fetch weather data from API");
            }
        }
        weatherDataStore.set(data);
        timezoneStore.set(data.timezone);
        return msg || null;

    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch weather data");
    }
}

export async function renderData() {
    const data = get(weatherDataStore);
    console.log("Rendering Weather Data")
    return processHomeWeatherData(data)
}

export async function onHomeMount() {
    try {
        const storedData = get(weatherDataStore);
        if (storedData.dt === 0) {
            let msg = await getHomeDefault();
            return msg || null;
        }
        return null;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch weather data");

    }
}
