import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
export const routes: Routes = [
 {path:'login',loadComponent:()=>import('./features/auth/auth.component').then(m=>m.AuthComponent)},
 {path:'',canActivate:[authGuard],loadComponent:()=>import('./features/dashboard/dashboard.component').then(m=>m.DashboardComponent)},
 {path:'orders',canActivate:[authGuard],loadComponent:()=>import('./features/orders/orders.component').then(m=>m.OrdersComponent)},
 {path:'payments',canActivate:[authGuard],loadComponent:()=>import('./features/payments/payments.component').then(m=>m.PaymentsComponent)},
 {path:'refunds',canActivate:[authGuard],loadComponent:()=>import('./features/refunds/refunds.component').then(m=>m.RefundsComponent)},
 {path:'**',redirectTo:''}
];
