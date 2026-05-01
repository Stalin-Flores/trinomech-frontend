import { HttpClient }       from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router }            from '@angular/router';
import { Observable, tap }   from 'rxjs';

import { environment } from '../../../environments/environment';

export interface LoginRequest {
  nombreUsuario: string;
  contrasena: string;
}

export interface LoginSession {
  token: string;
  nombreUsuario: string;
  nombreCompleto: string;
  rol: 'Administrador' | 'Operador' | 'Consulta';
}

const TOKEN_KEY = 'trinomech_token';
const USER_KEY  = 'trinomech_user';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private http   = inject(HttpClient);
  private router = inject(Router);

  // Estado reactivo (Angular signals)
  private _user = signal<LoginSession | null>(this.loadUser());

  readonly user            = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user()?.token);
  readonly rol             = computed(() => this._user()?.rol ?? null);

  login(credentials: LoginRequest): Observable<string> {
    return this.http
      .post(`${environment.apiUrl}/auth/login`, credentials, { responseType: 'text' })
      .pipe(tap((token) => this.saveSession(token, credentials)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this._user()?.token ?? localStorage.getItem(TOKEN_KEY);
  }

  // ---------- privados ----------

  private saveSession(token: string, credentials: LoginRequest): void {
    const payload = this.decodeJwtPayload(token);
    const session: LoginSession = {
      token,
      nombreUsuario: this.pickString(payload, ['nombreUsuario', 'username', 'sub'])
        ?? credentials.nombreUsuario,
      nombreCompleto: this.pickString(payload, ['nombreCompleto', 'nombre', 'name', 'fullName'])
        ?? this.pickString(payload, ['nombreUsuario', 'username', 'sub'])
        ?? credentials.nombreUsuario,
      rol: this.normalizeRol(this.pickString(payload, ['rol', 'role', 'authorities']))
        ?? 'Consulta',
    };

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(session));
    this._user.set(session);
  }

  private loadUser(): LoginSession | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as Partial<LoginSession>;
      if (!parsed.token) return null;
      return {
        token: parsed.token,
        nombreUsuario: parsed.nombreUsuario ?? '',
        nombreCompleto: parsed.nombreCompleto ?? parsed.nombreUsuario ?? '',
        rol: this.normalizeRol(parsed.rol) ?? 'Consulta',
      };
    }
    catch { return null; }
  }

  private decodeJwtPayload(token: string): Record<string, unknown> | null {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    try {
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = payload.padEnd(Math.ceil(payload.length / 4) * 4, '=');
      return JSON.parse(atob(padded)) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  private pickString(payload: Record<string, unknown> | null, keys: string[]): string | null {
    if (!payload) return null;

    for (const key of keys) {
      const value = payload[key];
      if (typeof value === 'string' && value.trim()) return value;
    }

    return null;
  }

  private normalizeRol(value: unknown): LoginSession['rol'] | null {
    if (typeof value !== 'string') return null;

    const normalized = value.trim().toLowerCase();
    if (!normalized) return null;
    if (normalized.includes('admin')) return 'Administrador';
    if (normalized.includes('oper')) return 'Operador';
    if (normalized.includes('cons')) return 'Consulta';

    return null;
  }
}
