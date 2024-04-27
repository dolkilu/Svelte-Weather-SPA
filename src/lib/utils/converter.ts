export const toCelcius = (Kelvin: number): number => {
    return Math.round((Kelvin - 273.15) * 10) / 10;
}

export const toFahrenheit = (Kelvin: number): number => {
    return Math.round(((Kelvin - 273.15) * 9 / 5 + 32) * 10) / 10;
}

