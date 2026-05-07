import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent {
  auth = inject(AuthService);
  submitted = signal(false);

  form = { name: '', email: '', role: '', message: '' };

  isValid(): boolean {
    return !!(this.form.name && this.form.email && this.form.role && this.form.message);
  }

  onSubmit(): void {
    if (this.isValid()) this.submitted.set(true);
  }
}