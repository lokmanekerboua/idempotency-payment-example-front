import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStore } from './core/auth.store';
import { DataStore } from './core/data.store';
@Component({selector:'app-root',imports:[RouterOutlet,RouterLink,RouterLinkActive],template:`
@if (auth.isAuthenticated()) {
<div class="layout"><aside class="sidebar"><a routerLink="/" class="brand"><span class="brand-icon">P</span><span>payment<span class="brand-accent">.</span><small>STUDIO</small></span></a>
<div class="side-label">WORKSPACE</div><nav><a routerLink="/" [routerLinkActiveOptions]="{exact:true}" routerLinkActive="active">◫ <span>Overview</span></a><a routerLink="/orders" routerLinkActive="active">▤ <span>Orders</span></a><a routerLink="/payments" routerLinkActive="active">▣ <span>Payments</span></a><a routerLink="/refunds" routerLinkActive="active">↶ <span>Refunds</span></a></nav>
<div class="side-bottom"><div class="mode"><span class="dot"></span> TEST ENVIRONMENT</div><div class="side-user"><div class="avatar">{{auth.user()?.email?.slice(0,1)?.toUpperCase()}}</div><div class="user-text"><strong>{{auth.user()?.email}}</strong><small>{{auth.user()?.role}}</small></div></div><button class="side-logout" (click)="logout()">Sign out ↗</button></div></aside>
<div class="main-wrap"><header class="topbar"><span>Workspace <span class="slash">/</span> <strong>Payment management</strong></span><div class="top-right"><span class="secure">● &nbsp; Test mode</span><span class="avatar mini">{{auth.user()?.email?.slice(0,1)?.toUpperCase()}}</span></div></header><main class="main"><router-outlet /></main></div></div>
} @else { <router-outlet /> }
`})
export class AppComponent { readonly auth=inject(AuthStore); private router=inject(Router); private data=inject(DataStore); logout():void { this.auth.clear(); this.data.reset(); void this.router.navigate(['/login']); } }
