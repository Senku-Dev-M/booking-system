import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoomType } from '../../models/room-model';

export interface SearchFilters {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  minPrice?: number;
  maxPrice?: number;
  roomType?: RoomType | '';
}

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss'
})
export class SearchBarComponent {
  location = signal('');
  checkIn = signal('');
  checkOut = signal('');
  guests = signal(1);
  minPrice = signal<number | undefined>(undefined);
  maxPrice = signal<number | undefined>(undefined);
  roomType = signal<RoomType | ''>('');
  
  onSearch = output<SearchFilters>();
  
  roomTypes = [
    { value: '' as const, label: 'Todos los tipos' },
    { value: 'individual_1_bed' as const, label: 'Individual - 1 Cama' },
    { value: 'individual_2_beds' as const, label: 'Individual - 2 Camas' },
    { value: 'individual_3_beds' as const, label: 'Individual - 3 Camas' },
    { value: 'suite_large_bed' as const, label: 'Suite - Cama Grande' },
    { value: 'suite_large_small_bed' as const, label: 'Suite - Cama Grande y Pequeña' }
  ];
  
  handleSearch() {
    const filters: SearchFilters = {
      location: this.location(),
      checkIn: this.checkIn(),
      checkOut: this.checkOut(),
      guests: this.guests(),
      minPrice: this.minPrice(),
      maxPrice: this.maxPrice(),
      roomType: this.roomType()
    };
    
    this.onSearch.emit(filters);
  }
  
  clearFilters() {
    this.location.set('');
    this.checkIn.set('');
    this.checkOut.set('');
    this.guests.set(1);
    this.minPrice.set(undefined);
    this.maxPrice.set(undefined);
    this.roomType.set('');
    this.handleSearch();
  }
}