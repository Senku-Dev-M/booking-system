import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, forkJoin } from 'rxjs';

import { Hotel } from '../../../../shared/models/hotel-model';
import { Room, BedType } from '../../../../shared/models/room-model';
import { Booking, CreateBookingRequest } from '../../../../shared/models/booking-model';
import { HotelService } from '../../services/hotel-service';
import { RoomService } from '../../services/room-service';
import { ReservationService } from '../../services/reservation-service';
import { DatePickerComponent, DateRange } from '../../../../shared/components/date-picker/date-picker';
import { AuthService } from '../../../../core/services/auth-service';
import {
  BookingConfirmationModalComponent,
  BookingData,
  ContactInfo
} from '../../../../shared/components/booking-confirmation-modal/booking-confirmation-modal';
import { ReservationDetailsModalComponent } from '../../../../shared/components/reservation-details-modal/reservation-details-modal';
import { CancellationConfirmationModalComponent } from '../../../../shared/components/cancellation-confirmation-modal/cancellation-confirmation-modal';
import { ReservationErrorModalComponent } from '../../../../shared/components/reservation-error-modal/reservation-error-modal';
import { CanComponentDeactivate } from '../../../../core/guards/can-deactivate-guard';

@Component({
  selector: 'app-hotel-booking',
  standalone: true,
  imports: [
    CommonModule,
    DatePickerComponent,
    BookingConfirmationModalComponent,
    ReservationDetailsModalComponent,
    CancellationConfirmationModalComponent,
    ReservationErrorModalComponent
  ],
  templateUrl: './hotel-booking.html',
  styleUrl: './hotel-booking.scss'
})
export class HotelBookingComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  hotel = signal<Hotel | null>(null);
  rooms = signal<Room[]>([]);
  selectedRoom = signal<Room | null>(null);
  dateRange = signal<DateRange>({ checkIn: null, checkOut: null });
  numberOfGuests = signal(1);
  
  isLoading = signal(false);
  error = signal<string | null>(null);
  showBookingModal = signal(false);
  createdBooking = signal<Booking | null>(null);
  showReservationDetails = signal(false);
  showCancellationConfirmation = signal(false);
  errorMessage = signal<string | null>(null);
  
  private destroy$ = new Subject<void>();
  private readonly BOOKING_STATE_KEY = 'booking_state';
  
  groupedRooms = computed(() => {
    const roomsData = this.rooms();
    if (!roomsData.length) return [];
    
    const grouped = new Map<string, {
      type: string;
      rooms: Room[];
      pricePerNight: number;
      capacity: number;
      beds: BedType[];
      availableCount: number;
    }>();
  
    roomsData.forEach(room => {
      if (!grouped.has(room.type)) {
        grouped.set(room.type, {
          type: room.type,
          rooms: [],
          pricePerNight: room.pricePerNight,
          capacity: room.capacity,
          beds: room.beds,
          availableCount: 0
        });
      }
      const group = grouped.get(room.type)!;
      group.rooms.push(room);
      group.availableCount++;
    });
  
    return Array.from(grouped.values());
  });
  
  selectedRooms = signal<Map<string, number>>(new Map());
  
  updateRoomCount(roomType: string, delta: number) {
    const current = this.selectedRooms();
    const grouped = this.groupedRooms().find(g => g.type === roomType);
    if (!grouped) return;

    const currentCount = current.get(roomType) || 0;
    const next = currentCount + delta;

    if (next <= 0) {
      current.delete(roomType);
      this.selectedRooms.set(new Map(current));
      return;
    }

    if (next <= grouped.availableCount) {
      current.set(roomType, next);
      this.selectedRooms.set(new Map(current));
    }
  }
  
  getSelectedCount(roomType: string): number {
    return this.selectedRooms().get(roomType) || 0;
  }
  
  hasSelectedRooms = computed(() => this.selectedRooms().size > 0);
  
  getSelectedRoomsSummary() {
    const selected = this.selectedRooms();
    const grouped = this.groupedRooms();
    const nights = this.getNights();
    const summary: Array<{type: string, count: number, pricePerNight: number, totalPrice: number}> = [];

    selected.forEach((count, roomType) => {
      const roomGroup = grouped.find(g => g.type === roomType);
      if (roomGroup && count > 0) {
        summary.push({
          type: roomType,
          count,
          pricePerNight: roomGroup.pricePerNight,
          totalPrice: roomGroup.pricePerNight * count * nights
        });
      }
    });

    return summary;
  }
  
  getTotalCapacity(): number {
    const selected = this.selectedRooms();
    const grouped = this.groupedRooms();
    let totalCapacity = 0;
    
    selected.forEach((count, roomType) => {
      const roomGroup = grouped.find(g => g.type === roomType);
      if (roomGroup) {
        totalCapacity += roomGroup.capacity * count;
      }
    });
    
    return totalCapacity;
  }

  getNights(): number {
    const dates = this.dateRange();
    if (!dates.checkIn || !dates.checkOut) return 1;
    
    const checkIn = new Date(dates.checkIn);
    const checkOut = new Date(dates.checkOut);
    return Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
  }
  
  totalPrice = computed(() => {
    const selectedRooms = this.selectedRooms();
    const grouped = this.groupedRooms();
    const nights = this.getNights();

    if (nights <= 0 || selectedRooms.size === 0) return 0;

    let total = 0;
    selectedRooms.forEach((count, roomType) => {
      const roomGroup = grouped.find(g => g.type === roomType);
      if (roomGroup) {
        total += roomGroup.pricePerNight * count * nights;
      }
    });

    return total;
  });
  
  canBook = computed(() => {
    const dates = this.dateRange();
    const hasRooms = this.selectedRooms().size > 0;
    
    return hasRooms && dates.checkIn && dates.checkOut;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService,
    private roomService: RoomService,
    private reservationService: ReservationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const hotelId = this.route.snapshot.paramMap.get('hotelId');
    if (hotelId) {
      this.loadHotelAndRooms(hotelId);
      this.restoreBookingState();
    }

    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user && this.hasBookingStateSaved()) {
          setTimeout(() => {
            if (this.canBook() && this.authService.isLoggedIn()) {
              this.submitBookings();
            }
          }, 500);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadHotelAndRooms(hotelId: string) {
    this.isLoading.set(true);
    this.error.set(null);

    forkJoin({
      hotel: this.hotelService.getHotelById(hotelId),
      rooms: this.roomService.getRoomsByHotel(hotelId)
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ({ hotel, rooms }) => {
        this.hotel.set(hotel);
        this.rooms.set(rooms.filter(room => room.isAvailable));
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set(error.message);
        this.isLoading.set(false);
      }
    });
  }

  onDateChange(dateRange: DateRange) {
    this.dateRange.set(dateRange);
  }

  selectRoom(room: Room) {
    this.selectedRoom.set(room);
  }

  onGuestsChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.numberOfGuests.set(parseInt(target.value) || 1);
  }

  onBook() {
    if (!this.authService.isLoggedIn()) {
      this.saveBookingState();
      this.error.set('Por favor, inicia sesión para continuar con tu reserva.');
      return;
    }
    this.showBookingModal.set(true);
  }

  private submitBookings(contactInfo?: ContactInfo) {
    const dates = this.dateRange();
    const selectedRooms = this.selectedRooms();
    const hotel = this.hotel();
    const user = this.authService.getCurrentUser();

    if (!hotel || !dates.checkIn || !dates.checkOut || selectedRooms.size === 0 || !user || !contactInfo) {
      return;
    }

    const firstRoomType = Array.from(selectedRooms.keys())[0];
    const roomGroup = this.groupedRooms().find(g => g.type === firstRoomType);
    if (!roomGroup || !roomGroup.rooms.length) return;

    const bookingData: CreateBookingRequest = {
      userId: user.id,
      hotelId: hotel._id || hotel.id,
      roomId: roomGroup.rooms[0].id,
      checkInDate: dates.checkIn.toISOString().split('T')[0],
      checkOutDate: dates.checkOut.toISOString().split('T')[0],
      numberOfGuests: this.getTotalCapacity(),
      totalPrice: this.totalPrice(),
      contactEmail: contactInfo.email,
      contactPhone: contactInfo.phone
    };

    this.isLoading.set(true);
    this.reservationService
      .createReservation(bookingData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (booking) => {
          this.isLoading.set(false);
          this.clearBookingState();
          this.createdBooking.set(booking);
          this.showReservationDetails.set(true);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(error.message);
        }
      });
  }

  onReservationDetailClose() {
    this.showReservationDetails.set(false);
    this.createdBooking.set(null);
    this.router.navigate(['/hotels']);
  }

  onCancelReservation(id: string) {
    this.reservationService
      .cancelReservation(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showReservationDetails.set(false);
          this.showCancellationConfirmation.set(true);
        },
        error: (error) => {
          this.errorMessage.set(error.message);
        }
      });
  }

  onCancellationConfirmClose() {
    this.showCancellationConfirmation.set(false);
    this.router.navigate(['/hotels']);
  }

  onErrorClose() {
    this.errorMessage.set(null);
  }

  goBack() {
    this.router.navigate(['/hotels']);
  }

  getRoomTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'individual_1_bed': 'Habitación Individual (1 cama)',
      'individual_2_beds': 'Habitación Individual para dos personas (2 camas)',
      'individual_3_beds': 'Habitación Individual para tres personas (3 camas)',
      'suite_large_bed': 'Suite para dos personas únicamente (1 cama grande)',
      'suite_large_small_bed': 'Suite con cama adicional para niño (1 cama grande y 1 cama pequeña)'
    };
    return labels[type] || type;
  }

  getStars(): boolean[] {
    const rating = this.hotel()?.rating || 0;
    return Array(5).fill(0).map((_, i) => i < rating);
  }

  private saveBookingState() {
    const state = {
      hotelId: this.hotel()?._id || '',
      dateRange: this.dateRange(),
      selectedRooms: Array.from(this.selectedRooms().entries()),
      timestamp: Date.now()
    };
    localStorage.setItem(this.BOOKING_STATE_KEY, JSON.stringify(state));
  }

  private restoreBookingState() {
    const stateStr = localStorage.getItem(this.BOOKING_STATE_KEY);
    if (!stateStr) return;

    try {
      const state = JSON.parse(stateStr);
      const now = Date.now();
      const stateAge = now - (state.timestamp || 0);
      
      if (stateAge > 60 * 60 * 1000) {
        this.clearBookingState();
        return;
      }

      if (state.dateRange) {
        const dateRange = {
          checkIn: state.dateRange.checkIn ? new Date(state.dateRange.checkIn) : null,
          checkOut: state.dateRange.checkOut ? new Date(state.dateRange.checkOut) : null
        };
        this.dateRange.set(dateRange);
      }

      if (state.selectedRooms && Array.isArray(state.selectedRooms)) {
        const selectedRoomsMap = new Map<string, number>();
        state.selectedRooms.forEach(([roomType, count]: [string, number]) => {
          if (typeof roomType === 'string' && typeof count === 'number') {
            selectedRoomsMap.set(roomType, count);
          }
        });
        this.selectedRooms.set(selectedRoomsMap);
      }
    } catch (error) {
      console.error('Error restoring booking state:', error);
      this.clearBookingState();
    }
  }

  private clearBookingState() {
    localStorage.removeItem(this.BOOKING_STATE_KEY);
  }

  private hasBookingStateSaved(): boolean {
    return localStorage.getItem(this.BOOKING_STATE_KEY) !== null;
  }

  checkAuthAndProcessBooking() {
    if (this.authService.isLoggedIn()) {
      this.submitBookings();
    }
  }

  isUserAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  getBookingData(): BookingData {
    const hotel = this.hotel();
    const dates = this.dateRange();
    const user = this.authService.getCurrentUser();
    const selectedRoomsSummary = this.getSelectedRoomsSummary();
    
    return {
      checkInDate: dates.checkIn || new Date(),
      checkOutDate: dates.checkOut || new Date(),
      userName: user?.name || 'Usuario',
      hotelName: hotel?.name || '',
      roomDetails: selectedRoomsSummary.map(room => 
        `${this.getRoomTypeLabel(room.type)} x${room.count}`
      ).join(', '),
      totalPrice: this.totalPrice()
    };
  }

  onBookingConfirmed(contactInfo: ContactInfo) {
    this.showBookingModal.set(false);
    this.submitBookings(contactInfo);
  }

  onBookingCancelled() {
    this.showBookingModal.set(false);
  }



  hasUnsavedChanges(): boolean {
    const dates = this.dateRange();
    const selectedRooms = this.selectedRooms();
    

    return (dates.checkIn !== null || dates.checkOut !== null) ||
           selectedRooms.size > 0 ||
           this.hasBookingStateSaved();
  }

  canDeactivate(): boolean {
    if (this.hasUnsavedChanges()) {
      const confirmed = confirm('¿Estás seguro de que quieres salir? Se perderá tu progreso de reserva.');
      if (confirmed) {
        this.clearBookingState();
      }
      return confirmed;
    }
    return true;
  }
}
