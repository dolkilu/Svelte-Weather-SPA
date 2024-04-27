import type { WeatherData } from '$lib/interfaces/WeatherAPI';
import { get } from 'svelte/store';
import { weatherDataStore } from '$lib/stores/AppStore';
import { getWeatherIcon, calculateTime, getCountryName } from '$lib/utils/WeatherAPI';
import type { IconData } from '$lib/interfaces/CurrentWeather';


const organizeWeatherData1 = (data: WeatherData) => {
    const weatherData = {
        city: data.name,
        countryCode: data.sys.country,
        temp: data.main.temp,
        temp_feels: data.main.feels_like,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,

        rain1h: data.rain?.["1h"] ?? 0,
        rain3h: data.rain?.["3h"] ?? 0,

        snow1h: data.snow?.["1h"] ?? 0,
        snow3h: data.snow?.["3h"] ?? 0,

        visibility: data.visibility,
        humidity: data.main.humidity,
        clouds: data.clouds.all,

        wind_speed: data.wind.speed,
        wind_deg: data.wind.deg,
        wind_gust: data.wind?.gust ?? 0,

    };

    return weatherData;
}


const organizeWeatherData2 = (data: WeatherData): IconData[] => {
    return data.weather.map(weather => ({
        weather: weather.main,
        description: weather.description,
        icon: weather.icon,

    }));
}

export async function getCurrentWeather() {
    const data = get(weatherDataStore);

    const weatherData1 = organizeWeatherData1(data);
    const weatherData2 = organizeWeatherData2(data);

    const countryName = getCountryName(weatherData1.countryCode);

    const icons = weatherData2.map(data => getWeatherIcon(data.icon));
    const { hour, minute, month, day } = calculateTime(data.dt, data.timezone);
    const { hour: srHour, minute: srMinute } = calculateTime(data.sys.sunrise, data.timezone);
    const { hour: ssHour, minute: ssMinute } = calculateTime(data.sys.sunset, data.timezone);


    return { weatherData1, weatherData2, countryName, icons, hour, minute, month, day, srHour, srMinute, ssHour, ssMinute }

}
