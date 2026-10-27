import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthStore } from './auth.store';
import { Operation } from './models';
/** Persist keys across reloads so an uncertain request is never retried with a new key. */
@Injectable({providedIn: 'root'})
export class OperationStore {
  private readonly auth = inject(AuthStore);
  readonly current = signal<Operation | null>(null);
  private slot(kind: string, entityId: string): string { return `${environment.operationStoragePrefix}:${this.auth.user()?.userId ?? 'anonymous'}:${kind}:${entityId}`; }
  load(kind: string, entityId: string): Operation | null { try { const raw = localStorage.getItem(this.slot(kind, entityId)); const op = raw ? JSON.parse(raw) as Operation : null; this.current.set(op); return op; } catch { this.current.set(null); return null; } }
  getOrCreate(kind: string, entityId: string, signature: string): Operation {
    const existing = this.load(kind, entityId);
    if (existing) {
      if (existing.signature !== signature) throw new Error('An operation already exists for this item with different parameters. Resolve it before starting another.');
      return existing;
    }
    if (!globalThis.crypto?.randomUUID) throw new Error('A secure browser context (HTTPS or localhost) is required to generate an idempotency key.');
    const op = { key: globalThis.crypto.randomUUID(), signature, completed: false };
    localStorage.setItem(this.slot(kind, entityId), JSON.stringify(op)); this.current.set(op); return op;
  }
  complete(kind: string, entityId: string): void { const op = this.load(kind, entityId); if (op) { op.completed = true; localStorage.setItem(this.slot(kind, entityId), JSON.stringify(op)); this.current.set(op); } }
  startAnotherCompletedRefund(paymentId: string): void { const op = this.load('refund', paymentId); if (!op?.completed) throw new Error('An unresolved refund must be reconciled before starting another.'); localStorage.removeItem(this.slot('refund', paymentId)); this.current.set(null); }
}
