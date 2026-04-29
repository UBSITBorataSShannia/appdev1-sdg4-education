import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DASHBOARD_CONFIG } from './dashboard.config';

export const dashboardRoute: Route = {
  path: 'dashboard',
  component: DashboardComponent,
  title: DASHBOARD_CONFIG.title
};
