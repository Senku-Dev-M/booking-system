import { Component, input, output } from '@angular/core';
import { Hotel } from '../../../../shared/models/hotel-model';

@Component({
  selector: 'app-hotel-card',
  standalone: true,
  imports: [],
  templateUrl: './hotel-card.html',
  styleUrl: './hotel-card.scss'
})
export class HotelCardComponent {
  hotel = input.required<Hotel>();
  currency = input<string>('BOB');
  
  onReserve = output<string>();
  
  handleReserve() {
    const hotelId = this.getId();
    console.log('Hotel ID para reservar:', hotelId);
    console.log('Hotel completo:', this.hotel());
    this.onReserve.emit(hotelId);
  }

  private getId(): string {
    const hotel = this.hotel();
    
    if ('_id' in hotel && hotel._id) {
      return String(hotel._id);
    }
    
    if ('id' in hotel && hotel.id) {
      return String(hotel.id);
    }
    
    return '';
  }

  getStars(): boolean[] {
    const rating = this.hotel().rating || 0;
    return Array(5).fill(0).map((_, i) => i < rating);
  }
}