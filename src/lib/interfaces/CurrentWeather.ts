export interface IconData {
    weather: string;
    description: string;
    icon: string;
};
export interface CurrentWeather {

    weatherData1: {
        city: string;
        countryCode: string;
        temp: number;
        temp_feels: number;
        temp_min: number;
        temp_max: number;

        rain1h: number;
        rain3h: number;

        snow1h: number;
        snow3h: number;

        visibility: number;
        humidity: number;
        clouds: number;
        wind_speed: number;
        wind_deg: number;
        wind_gust: number;

    },
    weatherData2: IconData[],
    countryName: string;
    icons: string[];
    hour: number;
    minute: number;
    month: number;
    day: number;
    srHour: number;
    srMinute: number;
    ssHour: number;
    ssMinute: number;

}

