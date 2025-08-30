import { Component, input, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface DateRange {
  checkIn: Date | null;
  checkOut: Date | null;
}

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.scss'
})
export class DatePickerComponent {
  checkInDate = signal<Date | null>(null);
  checkOutDate = signal<Date | null>(null);
  
  onDateChange = output<DateRange>();
  
  minDate = computed(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  minCheckOutDate = computed(() => {
    const checkIn = this.checkInDate();
    if (!checkIn) return this.minDate();
    
    const nextDay = new Date(checkIn);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay.toISOString().split('T')[0];
  });
  
  isValidDateRange = computed(() => {
    const checkIn = this.checkInDate();
    const checkOut = this.checkOutDate();
    
    if (!checkIn || !checkOut) return false;
    return checkOut > checkIn;
  });
  
  onCheckInChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const date = target.value ? new Date(target.value) : null;
    this.checkInDate.set(date);
    
    const checkOut = this.checkOutDate();
    if (date && checkOut && checkOut <= date) {
      this.checkOutDate.set(null);
    }
    
    this.emitDateChange();
  }
  
  onCheckOutChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const date = target.value ? new Date(target.value) : null;
    this.checkOutDate.set(date);
    this.emitDateChange();
  }
  
  private emitDateChange() {
    this.onDateChange.emit({
      checkIn: this.checkInDate(),
      checkOut: this.checkOutDate()
    });
  }
  
  getFormattedDate(date: Date | null): string {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  }
}