import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LightboxModalComponent } from './components/lightbox-modal.component';
import {
  DESIGN_PROCESS,
  HERO_IMAGE,
  MATERIAL_SWATCHES,
  PORTFOLIO_PROJECTS,
  PortfolioCategory,
  PortfolioProject,
  SERVICES,
  STUDIO_METRICS,
  TESTIMONIALS,
} from './data/studio.data';

interface InquiryReceipt {
  fullName: string;
  email: string;
  residenceType: string;
  scaleSqFt: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LightboxModalComponent],
  templateUrl: './app.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class AppComponent {
  private readonly fb = inject(FormBuilder);

  readonly heroImage = HERO_IMAGE;
  readonly metrics = STUDIO_METRICS;
  readonly processPhases = DESIGN_PROCESS;
  readonly services = SERVICES;
  readonly materials = MATERIAL_SWATCHES;
  readonly projects = PORTFOLIO_PROJECTS;
  readonly testimonials = TESTIMONIALS;

  readonly navLinks = [
    { id: 'process', label: 'Process' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'testimonials', label: 'Testimonials' },
  ];

  readonly portfolioCategories: PortfolioCategory[] = [
    'All',
    'Coastal Villas',
    'Urban Penthouses',
    'Hospitality',
  ];

  readonly mobileMenuOpen = signal(false);
  readonly heroImageFailed = signal(false);
  readonly failedProjectImages = signal<Record<string, boolean>>({});
  readonly activeSection = signal<string>('process');
  readonly scrollProgress = signal<number>(0);

  readonly activePhaseIndex = signal(0);
  readonly activeMaterialIndex = signal(0);
  readonly selectedCategory = signal<PortfolioCategory>('All');
  readonly activeTestimonialIndex = signal(0);
  readonly lightboxProject = signal<PortfolioProject | null>(null);

  readonly inquirySubmitted = signal(false);
  readonly submittedSummary = signal<InquiryReceipt | null>(null);

  readonly activePhase = computed(() => this.processPhases[this.activePhaseIndex()]);
  readonly activeMaterial = computed(() => this.materials[this.activeMaterialIndex()]);
  readonly activeTestimonial = computed(() => this.testimonials[this.activeTestimonialIndex()]);

  readonly filteredProjects = computed(() => {
    const category = this.selectedCategory();
    if (category === 'All') {
      return this.projects;
    }
    return this.projects.filter((project) => project.category === category);
  });

  readonly inquiryForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    residenceType: ['Coastal Villa', Validators.required],
    scaleSqFt: ['4,000 – 7,500 sq ft', Validators.required],
    projectNotes: ['', [Validators.required, Validators.minLength(12)]],
  });

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop;
    const scrollable = Math.max(doc.scrollHeight - window.innerHeight, 1);
    this.scrollProgress.set(Math.min(Math.max(scrollTop / scrollable, 0), 1));

    const sectionIds = ['process', 'services', 'portfolio', 'testimonials', 'contact'];
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= 160 && rect.bottom >= 160) {
        this.activeSection.set(id);
        break;
      }
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  selectPhase(index: number): void {
    this.activePhaseIndex.set(index);
  }

  selectMaterial(index: number): void {
    this.activeMaterialIndex.set(index);
  }

  setCategory(category: PortfolioCategory): void {
    this.selectedCategory.set(category);
  }

  selectTestimonial(index: number): void {
    this.activeTestimonialIndex.set(index);
  }

  markProjectImageFailed(projectId: string): void {
    this.failedProjectImages.update((prev) => ({ ...prev, [projectId]: true }));
  }

  openLightbox(project: PortfolioProject): void {
    this.lightboxProject.set(project);
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxProject.set(null);
    document.body.style.overflow = '';
  }

  stepLightbox(delta: number): void {
    const current = this.lightboxProject();
    const list = this.filteredProjects();
    if (!current || list.length === 0) return;
    const currentIndex = list.findIndex((p) => p.id === current.id);
    const nextIndex = (currentIndex + delta + list.length) % list.length;
    this.lightboxProject.set(list[nextIndex]);
  }

  inquireFromLightbox(project: PortfolioProject): void {
    this.closeLightbox();
    const mappedType =
      project.category === 'Coastal Villas'
        ? 'Coastal Villa'
        : project.category === 'Urban Penthouses'
          ? 'Urban Penthouse'
          : 'Hospitality';
    this.inquiryForm.patchValue({
      residenceType: mappedType,
      projectNotes: `Inspired by ${project.title} (${project.location}) — interested in a similar architectural scope.`,
    });
    this.inquirySubmitted.set(false);
  }

  isFieldInvalid(controlName: 'fullName' | 'email' | 'projectNotes'): boolean {
    const control = this.inquiryForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  submitInquiry(): void {
    if (this.inquiryForm.invalid) {
      this.inquiryForm.markAllAsTouched();
      return;
    }
    const raw = this.inquiryForm.getRawValue();
    this.submittedSummary.set({
      fullName: raw.fullName,
      email: raw.email,
      residenceType: raw.residenceType,
      scaleSqFt: raw.scaleSqFt,
    });
    this.inquirySubmitted.set(true);
  }

  resetInquiry(): void {
    this.inquiryForm.reset({
      fullName: '',
      email: '',
      residenceType: 'Coastal Villa',
      scaleSqFt: '4,000 – 7,500 sq ft',
      projectNotes: '',
    });
    this.inquirySubmitted.set(false);
    this.submittedSummary.set(null);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
