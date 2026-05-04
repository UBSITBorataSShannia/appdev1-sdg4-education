import { Route } from '@angular/router';
import { ContactsComponent } from './contacts.component';
import { CONTACTS_CONFIG } from './contacts.config';

export const contactsRoute: Route = {
  path: 'contacts',
  component: ContactsComponent,
  title: CONTACTS_CONFIG.title
};