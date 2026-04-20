import { Routes } from '@angular/router';
import { homeRoute } from './home/home.routes';
import { dashboardRoute } from './dashboard/dashboard.routes';
import { aboutRoute } from './about/about.routes';

export const routes: Routes = [
  homeRoute,
  dashboardRoute,
  aboutRoute,
  { path: '**', redirectTo: '' }
];
