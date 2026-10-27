import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthStore } from './auth.store';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthStore).user()?.token;
  const base = new URL(environment.apiBaseUrl.endsWith('/') ? environment.apiBaseUrl : environment.apiBaseUrl + '/', location.origin);
  const target = new URL(req.url, location.origin);
  const withinApi = target.origin === base.origin && (target.pathname === base.pathname.slice(0, -1) || target.pathname.startsWith(base.pathname));
  return next(token && withinApi ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req);
};
