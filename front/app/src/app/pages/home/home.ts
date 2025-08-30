import { Component, signal, computed, inject, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchBarComponent, SearchFilters } from '../../shared/components/search-bar/search-bar';
import { HotelCardComponent } from '../../features/hotel/components/hotel-card/hotel-card';
import { Hotel } from '../../shared/models/hotel-model';
import { HotelService } from '../../features/hotel/services/hotel-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchBarComponent, HotelCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  private readonly hotelService = inject(HotelService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngUnsubscribe$ = new Subject<void>();
  
  allHotels = signal<Hotel[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  currentFilters = signal<SearchFilters | null>(null);
  
  filteredHotels = computed(() => {
    const filters = this.currentFilters();
    const hotels = this.allHotels();
    
    if (!filters) return hotels;
    
    return hotels.filter(hotel => {
      const matchesLocation = !filters.location || 
        hotel.location.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesName = !filters.location || 
        hotel.name.toLowerCase().includes(filters.location.toLowerCase());
      
      return matchesLocation || matchesName;
    });
  });
  
  hasSearched = computed(() => this.currentFilters() !== null);
  resultsCount = computed(() => this.filteredHotels().length);

  constructor() {
    this.loadAllHotels();
  }

  private loadAllHotels(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.hotelService.getHotels()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (hotels: Hotel[]) => {
          this.allHotels.set(hotels);
          this.isLoading.set(false);
        },
        error: (error: any) => {
          console.error('Error loading hotels:', error);
          this.error.set('Error al cargar hoteles. Por favor, inténtalo de nuevo.');
          this.isLoading.set(false);
        }
      });
  }

  handleSearch(filters: SearchFilters): void {
    this.currentFilters.set(filters);
  }

  handleReserve(hotelId: string): void {
    this.router.navigate(['/hotels', hotelId, 'booking']).catch(error => {
      console.error('Navigation error:', error);
    });
  }

  retryLoad(): void {
    this.loadAllHotels();
  }

  navigateToHotels(): void {
    this.router.navigate(['/hotels']);
  }

  navigateToOffers(): void {
    this.router.navigate(['/ofertas']);
  }

  navigateToContact(): void {
    this.router.navigate(['/contacto']);
  }
}