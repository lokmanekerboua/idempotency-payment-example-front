import { Injectable, computed, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthResponse } from './models';
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly state = signal<AuthResponse | null>(this.read());
  readonly user = this.state.asReadonly();
  readonly isAuthenticated = computed(() => !!this.state()?.token);
  set(value: AuthResponse): void { sessionStorage.setItem(environment.authStorageKey, JSON.stringify(value)); this.state.set(value); }
  clear(): void { sessionStorage.removeItem(environment.authStorageKey); this.state.set(null); }
  private read(): AuthResponse | null { try { const raw = sessionStorage.getItem(environment.authStorageKey); return raw ? JSON.parse(raw) as AuthResponse : null; } catch { return null; } }
}
