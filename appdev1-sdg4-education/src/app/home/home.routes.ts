import { Route } from '@angular/router';
import { HomeComponent } from './home.component';
import { HOME_CONFIG } from './home.config';

export const homeRoute: Route = {
  path: '',
  component: HomeComponent,
  title: HOME_CONFIG.title
};
