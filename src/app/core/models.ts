export interface AuthResponse { token: string; userId: string; email: string; role: string; }
export interface Order { id: string; userId: string; orderReference: string; amountCents: number; currency: string; status: string; createdAt: string; updatedAt: string; }
export interface Payment { id: string; orderId: string; userId: string; amountCents: number; currency: string; status: string; provider: string; providerPaymentId: string | null; failureCode?: string | null; failureMessage?: string | null; createdAt: string; updatedAt: string; }
export interface CreatePaymentResponse { payment: Payment; clientSecret: string | null; }
export interface Refund { id: string; paymentId: string; userId: string; amountCents: number; currency: string; status: string; providerRefundId: string | null; createdAt: string; updatedAt: string; }
export interface Operation { key: string; signature: string; completed: boolean; }
