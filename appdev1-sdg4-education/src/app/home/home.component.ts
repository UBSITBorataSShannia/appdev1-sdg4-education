import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EducationApiService, EducationFact } from '../services/education.api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private educationApi = inject(EducationApiService);
  
  facts = signal<EducationFact[]>([]);
  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);
  errorMessage = signal<string>('');

  totalFacts = computed(() => this.facts().length);

  ngOnInit(): void {
    this.loadEducationFacts();
  }

  loadEducationFacts(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.educationApi.getEducationFacts().subscribe({
      next: (data: EducationFact[]) => {
        this.facts.set(data);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        this.hasError.set(true);
        this.errorMessage.set('Unable to load education data. Please try again later.');
        this.isLoading.set(false);
        console.error('API Error:', err);
      }
    });
  }

  retry(): void {
    this.loadEducationFacts();
  }
}
