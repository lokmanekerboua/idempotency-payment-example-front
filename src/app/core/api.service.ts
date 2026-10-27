import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, Order, Payment, CreatePaymentResponse, Refund } from './models';
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl.replace(/\/$/, '');
  private url(path: string): string { return `${this.base}${path}`; }
  private options(key: string): {headers: HttpHeaders} { return {headers: new HttpHeaders({'Idempotency-Key': key})}; }
  login(email: string, password: string) { return this.http.post<AuthResponse>(this.url('/auth/login'), {email, password}).pipe(timeout(environment.requestTimeoutMs)); }
  register(email: string, password: string) { return this.http.post<AuthResponse>(this.url('/auth/register'), {email, password}).pipe(timeout(environment.requestTimeoutMs)); }
  orders() { return this.http.get<Order[]>(this.url('/orders')).pipe(timeout(environment.requestTimeoutMs)); }
  order(id: string) { return this.http.get<Order>(this.url(`/orders/${encodeURIComponent(id)}`)).pipe(timeout(environment.requestTimeoutMs)); }
  createOrder(amountCents: number, currency: string) { return this.http.post<Order>(this.url('/orders'), {amountCents, currency}).pipe(timeout(environment.requestTimeoutMs)); }
  payments() { return this.http.get<Payment[]>(this.url('/payments')).pipe(timeout(environment.requestTimeoutMs)); }
  payment(id: string) { return this.http.get<Payment>(this.url(`/payments/${encodeURIComponent(id)}`)).pipe(timeout(environment.requestTimeoutMs)); }
  paymentsByOrder(id: string) { return this.http.get<Payment[]>(this.url(`/payments/order/${encodeURIComponent(id)}`)).pipe(timeout(environment.requestTimeoutMs)); }
  createPayment(orderId: string, key: string) { return this.http.post<CreatePaymentResponse>(this.url('/payments'), {orderId}, this.options(key)).pipe(timeout(environment.requestTimeoutMs)); }
  refunds(paymentId: string) { return this.http.get<Refund[]>(this.url(`/payments/${encodeURIComponent(paymentId)}/refunds`)).pipe(timeout(environment.requestTimeoutMs)); }
  refund(id: string) { return this.http.get<Refund>(this.url(`/refunds/${encodeURIComponent(id)}`)).pipe(timeout(environment.requestTimeoutMs)); }
  createRefund(paymentId: string, amountCents: number, key: string) { return this.http.post<Refund>(this.url(`/payments/${encodeURIComponent(paymentId)}/refunds`), {amountCents}, this.options(key)).pipe(timeout(environment.requestTimeoutMs)); }
}
