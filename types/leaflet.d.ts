// types/leaflet.d.ts
declare module 'leaflet/dist/leaflet.css' {
    const content: string;
    export default content;
}

declare module '*.css' {
    const content: string;
    export default content;
}

// Optional: Extend Leaflet types jika perlu
declare module 'leaflet' {
    export interface Map {
    remove(): void;
    }
}