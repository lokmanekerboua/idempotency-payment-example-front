import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from './api.service';
import { Order, Payment, Refund } from './models';
export function errorText(e: unknown): string { if (e instanceof HttpErrorResponse) { const body = e.error as {detail?: string; message?: string; title?: string} | null; return body?.detail || body?.message || body?.title || (e.status === 0 ? 'Cannot reach the API. Check the backend and proxy/CORS configuration.' : `Request failed (HTTP ${e.status}).`); } return e instanceof Error ? e.message : 'An unexpected error occurred.'; }
@Injectable({providedIn:'root'})
export class DataStore {
  private api = inject(ApiService);
  readonly orders = signal<Order[]>([]); readonly payments = signal<Payment[]>([]); readonly refunds = signal<Refund[]>([]);
  readonly loading = signal(false); readonly error = signal(''); readonly notice = signal('');
  readonly successfulPayments = computed(() => this.payments().filter(p => p.status === 'SUCCEEDED').length);
  readonly pendingPayments = computed(() => this.payments().filter(p => ['PROCESSING','REQUIRES_ACTION','RECONCILIATION_REQUIRED','CREATED'].includes(p.status)).length);
  async run<T>(job: () => Promise<T>): Promise<T | undefined> { this.error.set(''); this.notice.set(''); this.loading.set(true); try { return await job(); } catch(e) { this.error.set(errorText(e)); return undefined; } finally { this.loading.set(false); } }
  async refresh(): Promise<void> { await this.run(async () => { const [orders,payments] = await Promise.all([firstValueFrom(this.api.orders()),firstValueFrom(this.api.payments())]); this.orders.set(orders); this.payments.set(payments); }); }
  reset(): void { this.orders.set([]); this.payments.set([]); this.refunds.set([]); this.error.set(''); this.notice.set(''); }
}
