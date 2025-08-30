import { Component, signal, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth-service';


@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss'
})
export class LoginForm {
  loginForm: FormGroup;
  isLoading = signal(false);
  showPassword = signal(false);
  loginError = signal('');
  
  onLoginSuccess = output<{username: string}>();
  onCloseModal = output<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${controlName === 'username' ? 'Usuario' : 'Contraseña'} es requerido`;
      }
      if (control.errors['minlength']) {
        return 'Contraseña debe tener al menos 6 caracteres';
      }
    }
    return '';
  }

  hasError(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control?.errors && control.touched);
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.loginError.set('');
      
      const { username, password } = this.loginForm.value;

      try {
        const success = await this.authService.login({ email: username, password });
        if (success) {
          this.onLoginSuccess.emit({ username });
          this.onCloseModal.emit();
          this.isLoading.set(false);
        } else {
          this.loginError.set('Usuario o contraseña incorrectos');
          this.isLoading.set(false);
        }
      } catch (error) {
        this.loginError.set('Error al iniciar sesión');
        this.isLoading.set(false);
      }
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  clearForm() {
    this.loginForm.reset();
    this.loginError.set('');
  }
}
