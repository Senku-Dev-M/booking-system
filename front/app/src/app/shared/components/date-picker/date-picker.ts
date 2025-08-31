import {
  Component,
  output,
  signal,
  computed,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es.js';

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
export class DatePickerComponent implements AfterViewInit {
  @ViewChild('checkInInput') checkInInput!: ElementRef<HTMLInputElement>;
  @ViewChild('checkOutInput') checkOutInput!: ElementRef<HTMLInputElement>;

  private checkOutPicker!: any;

  checkInDate = signal<Date | null>(null);
  checkOutDate = signal<Date | null>(null);

  onDateChange = output<DateRange>();

  isValidDateRange = computed(() => {
    const checkIn = this.checkInDate();
    const checkOut = this.checkOutDate();

    if (!checkIn || !checkOut) return false;
    return checkOut > checkIn;
  });

  ngAfterViewInit() {
    flatpickr(this.checkInInput.nativeElement, {
      minDate: 'today',
      dateFormat: 'Y-m-d',
      locale: Spanish,
      onChange: ([date]) => {
        this.checkInDate.set(date);

        if (this.checkOutPicker) {
          const nextDay = new Date(date);
          nextDay.setDate(nextDay.getDate() + 1);
          this.checkOutPicker.set('minDate', nextDay);
        }

        const checkOut = this.checkOutDate();
        if (date && checkOut && checkOut <= date) {
          this.checkOutDate.set(null);
          this.checkOutPicker.clear();
        }

        this.emitDateChange();
      }
    });

    this.checkOutPicker = flatpickr(this.checkOutInput.nativeElement, {
      minDate: new Date(Date.now() + 86400000),
      dateFormat: 'Y-m-d',
      locale: Spanish,
      onChange: ([date]) => {
        this.checkOutDate.set(date);
        this.emitDateChange();
      }
    });
  }

  private emitDateChange() {
    this.onDateChange.emit({
      checkIn: this.checkInDate(),
      checkOut: this.checkOutDate()
    });
  }
}