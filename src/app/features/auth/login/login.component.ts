import { CommonModule }                 from '@angular/common';
import { Component, inject, signal }    from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink }           from '@angular/router';
import { HttpErrorResponse }            from '@angular/common/http';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl:    './login.component.css',
})
export class LoginComponent {

  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);

  // Form
  form = this.fb.nonNullable.group({
    nombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
    contrasena:    ['', [Validators.required, Validators.minLength(3)]],
  });

  // UI state
  loading       = signal(false);
  errorMessage  = signal<string | null>(null);
  showPassword  = signal(false);

  // Hora actual para detalle estilizado
  now = new Date();

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  submit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        const msg = err?.error?.mensaje
                 ?? (err.status === 0
                       ? 'No se puede conectar con el servidor (¿está corriendo en :8080?)'
                       : 'Error al iniciar sesión');
        this.errorMessage.set(msg);
      },
    });
  }
}
