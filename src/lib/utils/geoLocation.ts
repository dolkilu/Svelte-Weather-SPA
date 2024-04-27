import { Geolocation } from '@capacitor/geolocation';
import { locationStore } from '$lib/stores/AppStore';

interface Location {
    lat: number;
    lon: number;
    message?: string;
}


export async function getUserLocation(): Promise<Location> {
    try {
        const position = await Geolocation.getCurrentPosition();
        locationStore.set({ lat: position.coords.latitude, lon: position.coords.longitude });
        return {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
        };
    } catch (error) {
        console.error("Error getting user location", error);

        return {
            lat: 22.25,
            lon: 114.166672,
            message: 'Access to geolocation is denied or not supported. Using default location (HK).'

        };
    }
}

