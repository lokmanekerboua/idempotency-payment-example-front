import { Component, inject } from '@angular/core'; import { DataStore } from '../core/data.store';
@Component({selector:'app-feedback',template:`@if(store.error()){<div class="alert error" role="alert">{{store.error()}}</div>} @if(store.notice()){<div class="alert success" role="status">{{store.notice()}}</div>}`})
export class FeedbackComponent { readonly store=inject(DataStore); }
