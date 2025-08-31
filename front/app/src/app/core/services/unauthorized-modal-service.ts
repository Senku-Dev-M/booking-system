import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UnauthorizedModalService {
  message = signal<string | null>(null);

  show(message: string): void {
    this.message.set(message);
  }

  close(): void {
    this.message.set(null);
  }
}

