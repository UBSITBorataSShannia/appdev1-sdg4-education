import { Component, OnInit, signal, computed, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EducationApiService, EducationFact } from '../services/education.api.service';
import { LightboxComponent } from '../lightbox/lightbox.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, LightboxComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private educationApi = inject(EducationApiService);
  @ViewChild(LightboxComponent) lightbox!: LightboxComponent;
  
  facts = signal<EducationFact[]>([]);
  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);
  errorMessage = signal<string>('');

  totalFacts = computed(() => this.facts().length);

  galleryImages = [
    {
      src: 'assets/images/education-classroom.svg',
      alt: 'Children sitting in a bright classroom, engaged in learning',
      caption: 'Inclusive classrooms'
    },
    {
      src: 'assets/images/education-girls.svg',
      alt: 'Girls studying together with books and pencils',
      caption: 'Gender equity in education'
    },
    {
      src: 'assets/images/education-teacher.svg',
      alt: 'A teacher guiding a student through a lesson',
      caption: 'Quality teaching'
    },
    {
      src: 'assets/images/education-digital.svg',
      alt: 'Students using laptops and tablets in a modern school',
      caption: 'Digital learning access'
    }
  ];

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

  openGalleryLightbox(index: number): void {
    if (this.lightbox) {
      this.lightbox.openLightbox(this.galleryImages, index);
    }
  }
}
