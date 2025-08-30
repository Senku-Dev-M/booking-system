export interface Amenity {
  name: string;
  icon: string;
}

export interface Hotel {
  _id: string;
  name: string;
  location: string;
  description?: string;
  rating?: number;
  image: string;
  amenities?: Amenity[];
  pricePerNight?: number;
  minPrice?: number;
  maxPrice?: number;
}