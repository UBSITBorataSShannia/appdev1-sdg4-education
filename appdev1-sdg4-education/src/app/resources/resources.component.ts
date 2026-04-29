import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, switchMap } from 'rxjs';
import { EducationService } from '../services/education.service';
import { OpenLibraryDoc } from '../models/education.resource.model';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.css'
})
export class ResourcesComponent {
  private readonly educationService = inject(EducationService);

  searchQuery = signal<string>('quality education');
  searchInput = 'quality education';

  // ✅ Observable — exposed for async pipe, NO .subscribe() in component
  books$: Observable<OpenLibraryDoc[]> = this.educationService.getEducationBooks(this.searchQuery());
  isLoading$ = this.educationService.isLoadingBooks$;

  onSearch(): void {
    this.searchQuery.set(this.searchInput);
    this.books$ = this.educationService.searchBooks(this.searchInput);
  }

  getCoverUrl(coverId: number | undefined): string {
    return coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : 'assets/no-cover.png';
  }

  getAuthors(authors: string[] | undefined): string {
    if (!authors || authors.length === 0) return 'Unknown Author';
    return authors.slice(0, 2).join(', ');
  }
}