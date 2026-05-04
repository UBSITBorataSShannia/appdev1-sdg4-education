import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EducationService } from 'src/app/services/education.service';
import { Sdg4Target } from 'src/app/models/education-resource.model';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  private readonly educationService = inject(EducationService);

  // ✅ Observable exposed — no .subscribe() here; use async pipe in template
  countries$ = this.educationService.getCountriesByRegion('Asia');
  isLoading$ = this.educationService.isLoadingCountries$;

  sdg4Targets: Sdg4Target[] = [
    {
      id: '4.1',
      title: 'Free Primary & Secondary Education',
      description: 'Ensure all girls and boys complete free, equitable, and quality primary and secondary education leading to relevant and effective learning outcomes.',
      icon: '🏫'
    },
    {
      id: '4.2',
      title: 'Early Childhood Development',
      description: 'Ensure all girls and boys access quality early childhood development, care, and pre-primary education so they are ready for primary education.',
      icon: '👶'
    },
    {
      id: '4.3',
      title: 'Equal Access to Technical Education',
      description: 'Ensure equal access for all women and men to affordable and quality technical, vocational, and tertiary education.',
      icon: '🔧'
    },
    {
      id: '4.4',
      title: 'Relevant Skills for Work',
      description: 'Substantially increase the number of youth and adults who have relevant skills, including technical and vocational skills, for employment and entrepreneurship.',
      icon: '💼'
    },
    {
      id: '4.5',
      title: 'Eliminate Gender Disparities',
      description: 'Eliminate gender disparities in education and ensure equal access to all levels of education and vocational training for the vulnerable.',
      icon: '⚖️'
    },
    {
      id: '4.6',
      title: 'Universal Literacy & Numeracy',
      description: 'Ensure that all youth and a substantial proportion of adults, both men and women, achieve literacy and numeracy.',
      icon: '📖'
    },
    {
      id: '4.7',
      title: 'Education for Sustainable Development',
      description: 'Ensure all learners acquire knowledge and skills needed to promote sustainable development, human rights, gender equality, and a culture of peace.',
      icon: '🌱'
    }
  ];

  getLanguages(languages: { [key: string]: string } | undefined): string {
    if (!languages) return 'N/A';
    const langs = Object.values(languages);
    return langs.slice(0, 2).join(', ');
  }

  stats = [
    { value: '244M', label: 'Children Out of School', icon: '📉' },
    { value: '771M', label: 'Adults Lack Basic Literacy', icon: '📚' },
    { value: '44%', label: 'Countries Achieve Pre-Primary Goals', icon: '🎯' },
    { value: '2030', label: 'Target Year for SDG 4', icon: '📅' },
  ];
}
