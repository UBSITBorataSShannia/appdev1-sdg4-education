import { Route } from '@angular/router';
import { AboutComponent } from './about.component';
import { ABOUT_CONFIG } from './about.config';

export const aboutRoute: Route = {
  path: 'about',
  component: AboutComponent,
  title: ABOUT_CONFIG.title
};
