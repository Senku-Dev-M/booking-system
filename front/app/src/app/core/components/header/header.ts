import { Component, signal, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginForm } from '../../../features/auth/components/login-form/login-form';
import { UserReservationsComponent } from '../../../features/hotel/components/user-reservations/user-reservations';
import { AuthService, User } from '../../services/auth-service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LoginForm, UserReservationsComponent, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  currentLanguage = signal('ES');
  currentCurrency = signal('BOB');
  isMenuOpen = signal(false);
  isLoginModalOpen = signal(false);
  currentUser = signal<{username: string} | null>(null);
  isProfileMenuOpen = signal(false);
  isSuccessModalOpen = signal(false);
  isReservationsModalOpen = signal(false);

  constructor(
    @Inject(AuthService) private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: User | null) => {
        if (user) {
          this.currentUser.set({ username: user.name });
        } else {
          this.currentUser.set(null);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }

  changeLanguage(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.currentLanguage.set(target.value);
  }

  changeCurrency(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.currentCurrency.set(target.value);
  }

  openLoginModal() {
    this.isLoginModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeLoginModal() {
    this.isLoginModalOpen.set(false);
    document.body.style.overflow = 'auto';
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeLoginModal();
    }
  }

  onLoginSuccess(userData: {username: string}) {
    this.currentUser.set(userData);
    console.log('Usuario logueado:', userData.username);
    this.closeLoginModal();
    this.isSuccessModalOpen.set(true);
    setTimeout(() => this.isSuccessModalOpen.set(false), 2500);
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen.update(v => !v);
  }

  onSettings() {
    this.router.navigate(['/contacto']);
    this.isProfileMenuOpen.set(false);
  }

  onLogout() {
    this.authService.logout();
    this.isProfileMenuOpen.set(false);
    console.log('Usuario deslogueado');
  }

  closeSuccessModal() {
    this.isSuccessModalOpen.set(false);
  }

  onSuccessBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeSuccessModal();
    }
  }

  openReservationsModal() {
    this.isReservationsModalOpen.set(true);
    this.isProfileMenuOpen.set(false);
    document.body.style.overflow = 'hidden';
  }

  closeReservationsModal() {
    this.isReservationsModalOpen.set(false);
    document.body.style.overflow = 'auto';
  }

  onReservationsBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeReservationsModal();
    }
  }
}