export interface Hotel {
    id: string;
    name: string;
    location: string;
    description?: string;
    amenities?: string[];
    image?: string;
    rating?: number;
}