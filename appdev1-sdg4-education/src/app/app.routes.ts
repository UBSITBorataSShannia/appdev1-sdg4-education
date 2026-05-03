import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { homeRoute } from './home/home.routes';
import { aboutRoute } from './about/about.routes';
import { dashboardRoute } from './dashboard/dashboard.routes';

export const routes: Routes = [
  homeRoute,
  aboutRoute,
  dashboardRoute,
  {
    path: '**',
    redirectTo: ''
  }
];