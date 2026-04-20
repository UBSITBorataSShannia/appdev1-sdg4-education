import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EducationApiService, EducationFact } from '../education.api.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  facts = signal<EducationFact[]>([]);
  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);
  errorMessage = signal<string>('');

  totalFacts = computed(() => this.facts().length);

  constructor(private educationApi: EducationApiService) {}

  ngOnInit(): void {
    this.loadEducationFacts();
  }

  loadEducationFacts(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.educationApi.getEducationFacts().subscribe({
      next: (data) => {
        this.facts.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
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
