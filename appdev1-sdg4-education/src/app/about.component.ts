import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="container">
      <div class="py-4">
        <h2 class="h3">About</h2>
        <p>This app demonstrates simple routing and Bootstrap-based styling.</p>
      </div>
    </div>
  `
})
export class AboutComponent {}
