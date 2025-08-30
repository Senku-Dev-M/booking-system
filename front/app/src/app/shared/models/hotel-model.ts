export interface Amenity {
  name: string;
  icon: string;
}

export interface Hotel {
  _id: string;
  /**
   * Some API responses return the identifier using the field name `id`
   * instead of `_id`.  Mark it as optional so consumers can handle both
   * without TypeScript errors.
   */
  id?: string;
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