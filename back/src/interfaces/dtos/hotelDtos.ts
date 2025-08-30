export interface CreateHotelRequest {
    name: string;
    location: string;
    description?: string;
    amenities?: string[];
    image?: string;
    rating?: number;
}

export interface UpdateHotelRequest {
    name?: string;
    location?: string;
    description?: string;
    amenities?: string[];
    image?: string;
    rating?: number;
}

export interface HotelResponse {
    id: string;
    name: string;
    location: string;
    description?: string;
    amenities?: string[];
    image?: string;
    rating?: number;
}