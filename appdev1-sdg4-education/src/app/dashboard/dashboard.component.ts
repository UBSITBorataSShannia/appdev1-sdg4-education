import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, combineLatest, map } from 'rxjs';
import { EducationService } from 'src/app/services/education.service';
import { OpenLibraryDoc, Country } from 'src/app/models/education-resource.model';

// ── Dashboard-specific interfaces ──────────────────────────────────────────
export interface StatCard {
  icon: string;
  value: string;
  label: string;
  sub: string;
  accent: 'red' | 'gold' | 'green' | 'blue';
}

export interface SdgGoalProgress {
  id: string;
  label: string;
  progress: number;   // 0–100
  color: string;
}

export interface QuickLink {
  icon: string;
  title: string;
  description: string;
  route: string;
  accent: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private readonly educationService = inject(EducationService);

  // ── API Observables — async pipe in template, NO .subscribe() ──────────
  books$: Observable<OpenLibraryDoc[]> = this.educationService.getEducationBooks('sustainable development education');
  countries$: Observable<Country[]> = this.educationService.getCountriesByRegion('Asia');

  isLoadingBooks$ = this.educationService.isLoadingBooks$;
  isLoadingCountries$ = this.educationService.isLoadingCountries$;

  // ── Derived observable: top 5 books for the "Featured" panel ───────────
  featuredBooks$: Observable<OpenLibraryDoc[]> = this.books$.pipe(
    map(books => books.filter(b => b.cover_i).slice(0, 5))
  );

  // ── Derived observable: country count per subregion for the mini chart ─
  regionSummary$: Observable<{ region: string; count: number }[]> = this.countries$.pipe(
    map(countries => {
      const map = new Map<string, number>();
      countries.forEach(c => {
        const key = c.subregion ?? c.region;
        map.set(key, (map.get(key) ?? 0) + 1);
      });
      return Array.from(map.entries())
        .map(([region, count]) => ({ region, count }))
        .sort((a, b) => b.count - a.count);
    })
  );

  // ── Signals for reactive local state ───────────────────────────────────
  activeTab = signal<'overview' | 'books' | 'countries'>('overview');
  searchQuery = signal<string>('');
  selectedRegion = signal<string>('Asia');

  // ── Static data ────────────────────────────────────────────────────────
  readonly statCards: StatCard[] = [
    { icon: '📉', value: '244M',  label: 'Children Out of School',     sub: 'Globally in 2023',          accent: 'red'   },
    { icon: '📚', value: '771M',  label: 'Adults Without Basic Literacy', sub: 'Two-thirds are women',   accent: 'gold'  },
    { icon: '🎓', value: '617M',  label: 'Missing Reading Proficiency', sub: 'Children & adolescents',   accent: 'blue'  },
    { icon: '🌱', value: '2030',  label: 'SDG 4 Target Year',           sub: 'Global education deadline', accent: 'green' },
  ];

  readonly goalProgress: SdgGoalProgress[] = [
    { id: '4.1', label: 'Free Primary & Secondary Education', progress: 68, color: '#C5192D' },
    { id: '4.2', label: 'Early Childhood Development',        progress: 44, color: '#DDA63A' },
    { id: '4.3', label: 'Equal Access to Technical Education',progress: 52, color: '#2e7d32' },
    { id: '4.4', label: 'Relevant Skills for Employment',     progress: 49, color: '#1565c0' },
    { id: '4.5', label: 'Eliminate Gender Disparities',       progress: 73, color: '#6a1b9a' },
    { id: '4.6', label: 'Universal Literacy & Numeracy',      progress: 61, color: '#00838f' },
    { id: '4.7', label: 'Education for Sustainable Development', progress: 38, color: '#e65100' },
  ];

  readonly quickLinks: QuickLink[] = [
    { icon: '📖', title: 'Browse Resources',  description: 'Search thousands of open educational books', route: '/dashboard', accent: 'var(--sdg4-red)'  },
    { icon: '🌍', title: 'About SDG 4',       description: 'Learn about targets, goals, and global stats', route: '/about',    accent: 'var(--sdg4-gold)' },
    { icon: '🤝', title: 'Get Involved',      description: 'Connect with the quality education community',  route: '/contacts',  accent: '#2e7d32'           },
  ];

  readonly regions = ['Asia', 'Africa', 'Europe', 'Americas', 'Oceania'];

  // ── Methods ────────────────────────────────────────────────────────────
  ngOnInit(): void {
    // Intentionally empty — API calls are triggered by service injection
    // Lazy loading happens via async pipe in the template
  }

  setTab(tab: 'overview' | 'books' | 'countries'): void {
    this.activeTab.set(tab);
  }

  loadRegion(region: string): void {
    this.selectedRegion.set(region);
    this.countries$ = this.educationService.getCountriesByRegion(region);
    this.regionSummary$ = this.countries$.pipe(
      map(countries => {
        const m = new Map<string, number>();
        countries.forEach(c => {
          const key = c.subregion ?? c.region;
          m.set(key, (m.get(key) ?? 0) + 1);
        });
        return Array.from(m.entries())
          .map(([r, count]) => ({ region: r, count }))
          .sort((a, b) => b.count - a.count);
      })
    );
  }

  onSearch(): void {
    if (this.searchQuery().trim()) {
      this.books$ = this.educationService.searchBooks(this.searchQuery());
      this.featuredBooks$ = this.books$.pipe(
        map(books => books.filter(b => b.cover_i).slice(0, 5))
      );
    }
  }

  getCoverUrl(coverId: number | undefined): string {
    return coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : '';
  }

  getAuthors(authors: string[] | undefined): string {
    if (!authors?.length) return 'Unknown Author';
    return authors.slice(0, 2).join(', ');
  }

  getLanguages(languages: { [key: string]: string } | undefined): string {
    if (!languages) return 'N/A';
    return Object.values(languages).slice(0, 2).join(', ');
  }

  getProgressBarWidth(progress: number): string {
    return `${progress}%`;
  }

  getProgressColor(progress: number): string {
    if (progress >= 70) return '#2e7d32';
    if (progress >= 50) return '#DDA63A';
    return '#C5192D';
  }

  getMaxCount(summary: { region: string; count: number }[]): number {
    return summary.length ? Math.max(...summary.map(s => s.count)) : 1;
  }

  trackByKey(index: number, item: OpenLibraryDoc): string {
    return item.key;
  }

  trackByName(index: number, item: Country): string {
    return item.name.common;
  }
}
