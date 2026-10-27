# Payment Studio — Angular frontend

A standalone Angular 21 frontend for the supplied Kotlin/Spring Boot idempotency API. It uses component-based features, RxJS HTTP services, Angular Signals stores, routes and a bearer-token interceptor.

> **Use Stripe test mode only.** The supplied backend was not verified end-to-end. The Angular production and development builds were checked. A live API and Stripe integration test was not possible in the creation environment. Test thoroughly before use.

## Requirements and setup

1. Install a Node.js version supported by Angular 21 and npm (for example Node 22.12+ or 24; see the Angular compatibility table).
2. Start PostgreSQL and the Spring Boot API on `http://localhost:8080` and make sure Flyway migrations have succeeded.
3. Edit `src/environments/environment.development.ts`. Set `stripePublishableKey` to your Stripe **test publishable** key (`pk_test_...`) if you want to confirm a PaymentIntent with Stripe Elements. Leave blank to use order/payment/refund management without Stripe card confirmation.
4. In the project root run:

   ```bash
   npm install
   npm start
   ```

5. Open `http://localhost:4200`. Create an account, create an order, create a payment, and use a Stripe test card to confirm it. Refresh payment status after the webhook is processed.

`proxy.conf.json` forwards `/api` and `/actuator` to port 8080 during `ng serve`. Change its target if the backend runs elsewhere and restart the dev server. Development proxy configuration does not apply to deployed builds: configure your production reverse proxy to forward `/api` or set `apiBaseUrl` to the backend URL and configure Spring Security CORS for the frontend origin, including `Authorization`, `Content-Type`, and `Idempotency-Key` headers.

## Environments and security

- `src/environments/environment.development.ts` is used for `ng serve` / development builds.
- `src/environments/environment.ts` is used for production builds.
- Frontend environment files are bundled into browser JavaScript and **are public**. They must never contain JWT signing secrets, Stripe secret keys, webhook signing secrets, database passwords, or private API keys. Only a Stripe publishable key belongs there; keep secret values in the backend `.env`.
- Access tokens are in `sessionStorage` for the current browser tab and are sent only to the configured API path. This is a development convenience and does not protect tokens from XSS; production authentication needs a reviewed security design.
- PaymentIntent client secrets are held only in component memory. Do not log or share them. Stripe Elements sends card data directly to Stripe; no card number is sent to Spring Boot.
- Logout clears the current tab's auth session and application state. Idempotency keys remain in browser localStorage, scoped by user, to avoid losing unresolved operations after reload. Other browsers/devices cannot see these keys; do not clear browser storage while an operation is uncertain.

## API coverage

| Feature | Method and path | UI |
|---|---|---|
| Registration / login | POST `/api/auth/register`, `/api/auth/login` | Authentication |
| Orders | POST `/api/orders`; GET `/api/orders`, `/api/orders/{id}` | Orders |
| Payments | POST `/api/payments`; GET `/api/payments`, `/api/payments/{id}`, `/api/payments/order/{orderId}` | Payments |
| Refunds | POST and GET `/api/payments/{paymentId}/refunds`; GET `/api/refunds/{refundId}` | Refunds |
| Stripe webhook | POST `/api/webhooks/stripe` | Stripe server-to-server only; never send a secret or spoof a webhook in a browser |

## Idempotency and recovery

The app stores one UUID key per user and order for payments and one per user and payment for the active refund. It reuses the same key and identical request parameters after a timeout or error. It never automatically retries a POST or replaces an unresolved key. A response can be `200` (replay) or `201` (new). A `409` can indicate a conflicting key or an operation still in progress; inspect backend state and retry with the same key as appropriate.

For another partial refund, use **Prepare another refund** only after receiving the first response, and verify its status first. The backend, not the browser, is responsible for authoritatively enforcing refundable amounts and preventing duplicate charges. Browser storage and a client-side key are not a substitute for durable server-side coordination. Test recovery after crashes and provider timeouts before use.

## Structure

- `src/app/core`: API service, authentication and interceptor, operation-key store, signal-based data store, models and guard.
- `src/app/features`: standalone dashboard, auth, orders, payments and refunds components.
- `src/app/shared`: feedback and money helpers.
- `src/environments`: public frontend configuration.

## Useful commands

```bash
npm start
npm run build
npm run build:dev
```

The included `package-lock.json` records the dependency versions used for the build. Use `npm ci` to install those versions.
