export interface ForecastResponse {
    cod: string;
    message: number;
    cnt: number;
    list: Array<{
        dt: number;
        main: {
            temp: number;
            feels_like: number;
            temp_min: number;
            temp_max: number;
            pressure: number;
            sea_level: number;
            grnd_level: number;
            humidity: number;
            temp_kf: number;
        };
        weather: Array<{
            id: number;
            main: string;
            description: string;
            icon: string;
        }>;
        clouds: {
            all: number;
        };
        wind: {
            speed: number;
            deg: number;
            gust?: number;
        };
        visibility: number;
        pop: number;
        rain?: {
            "1h"?: number;
            "3h"?: number;
        };
        snow?: {
            "1h"?: number;
            "3h"?: number;
        };
        sys: {
            pod: string;
        };
        dt_txt: string;
    }>;
    city: {
        id: number;
        name: string;
        coord: {
            lat: number;
            lon: number;
        };
        country: string;
        population: number;
        timezone: number;
        sunrise: number;
        sunset: number;
    };
}

export interface ForecastItem {
    dt: number;
    main: {
        temp: number;
        temp_min: number;
        temp_max: number;
        humidity: number;
    };
    weather: Array<{
        description: string;
        icon: string;
    }>;
}
export interface ForecastPageItem {
    dt: number;
    main: {
        temp_min: number;
        temp_max: number;
    };
    weather: Array<{
        main: string;
        description: string;
        icon: string;
    }>;
    pop: number;
    sys: {
        pod: string;
    };

}

export interface ForecastData {
    list: ForecastItem[];
    city: {
        name: string;
        timezone: number;
    };
}

export interface ForecastPageData {
    list: ForecastPageItem[];
    city: {
        name: string;
        timezone: number;
        country: string;
    };
}

export interface HomePageForecastData {
    firstItem: ForecastItem;
    fifthItem: ForecastItem;
    iconA: string;
    iconB: string;
    hourA: number;
    minuteA: number;
    monthA: number;
    dayA: number;
    hourB: number;
    minuteB: number;
    monthB: number;
    dayB: number;
}


