export function base64(str: string): string {
    return btoa(str);
    //return Buffer.from(str).toString('base64')
}

export function localTimeOffsetUTC() {
    // Obtenir l'offset en minutes
    const now = new Date();
    const timeOffsetMinutes = now.getTimezoneOffset();

    // Convertir l'offset en heures et minutes
    const hours = Math.floor(Math.abs(timeOffsetMinutes) / 60);
    const minutes = Math.abs(timeOffsetMinutes) % 60;
    const sign = timeOffsetMinutes <= 0 ? '+' : '-';

    return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function inLocalTimeOffsetUTC() {
    // Obtenir l'offset en minutes
    const now = new Date();
    const timeOffsetMinutes = now.getTimezoneOffset();

    // Convertir l'offset en heures et minutes
    const hours = Math.floor(Math.abs(timeOffsetMinutes) / 60);
    const minutes = Math.abs(timeOffsetMinutes) % 60;
    const sign = timeOffsetMinutes >= 0 ? '+' : '-';

    return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}