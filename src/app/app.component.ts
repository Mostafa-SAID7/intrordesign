import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { animate, scroll } from 'motion';
import { LightboxModalComponent } from './components/lightbox-modal.component';
import { MotionCounterDirective } from './shared/directives/motion-counter.directive';
import { MotionMagneticDirective } from './shared/directives/motion-magnetic.directive';
import { MotionMediaRevealDirective } from './shared/directives/motion-media-reveal.directive';
import { MotionPanelWipeDirective } from './shared/directives/motion-panel-wipe.directive';
import { MotionParallaxDirective } from './shared/directives/motion-parallax.directive';
import { MotionRevealDirective } from './shared/directives/motion-reveal.directive';
import { MotionSpotlightDirective } from './shared/directives/motion-spotlight.directive';
import { MotionTiltDirective } from './shared/directives/motion-tilt.directive';
import { UiButtonComponent } from './shared/ui/ui-button.component';
import { UiFieldComponent } from './shared/ui/ui-field.component';
import { UiMarqueeComponent } from './shared/ui/ui-marquee.component';
import { UiSectionHeaderComponent } from './shared/ui/ui-section-header.component';
import { UiSelectComponent, type UiSelectOption } from './shared/ui/ui-select.component';
import { UiSplitCompareComponent } from './shared/ui/ui-split-compare.component';
import { UiTabsComponent, type UiTabOption } from './shared/ui/ui-tabs.component';
import { UiToastComponent } from './shared/ui/ui-toast.component';
import {
  DESIGN_PROCESS,
  HERO_IMAGE,
  MATERIAL_SWATCHES,
  PORTFOLIO_PROJECTS,
  type PortfolioCategory,
  type PortfolioProject,
  SERVICES,
  STUDIO_METRICS,
  TESTIMONIALS,
} from './data/studio.data';

interface InquiryReceipt {
  fullName: string;
  email: string;
  residenceType: string;
  scaleSqFt: string;
  materialDirection: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LightboxModalComponent,
    MotionCounterDirective,
    MotionMagneticDirective,
    MotionMediaRevealDirective,
    MotionPanelWipeDirective,
    MotionParallaxDirective,
    MotionRevealDirective,
    MotionSpotlightDirective,
    MotionTiltDirective,
    UiButtonComponent,
    UiFieldComponent,
    UiMarqueeComponent,
    UiSectionHeaderComponent,
    UiSelectComponent,
    UiSplitCompareComponent,
    UiTabsComponent,
    UiToastComponent,
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly ngZone = inject(NgZone);

  @ViewChild('scrollProgressBar') scrollProgressBar?: ElementRef<HTMLElement>;
  @ViewChild('heroBackdropImg') heroBackdropImg?: ElementRef<HTMLImageElement>;
  @ViewChild('phaseDetailCard') phaseDetailCard?: ElementRef<HTMLElement>;
  @ViewChild('materialDetailCard') materialDetailCard?: ElementRef<HTMLElement>;
  @ViewChild('testimonialQuoteCard') testimonialQuoteCard?: ElementRef<HTMLElement>;

  readonly heroImage = HERO_IMAGE;
  readonly splitCompareLeft = '/src/assets/images/portfolio_coastal_kitchen_1795508753540.jpg';
  readonly splitCompareRight = '/src/assets/images/portfolio_penthouse_living_1795508753035.jpg';
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

  readonly portfolioTabOptions: UiTabOption<PortfolioCategory>[] = [
    { value: 'All', label: 'All Works', count: PORTFOLIO_PROJECTS.length },
    {
      value: 'Coastal Villas',
      label: 'Coastal Villas',
      count: PORTFOLIO_PROJECTS.filter((p) => p.category === 'Coastal Villas').length,
    },
    {
      value: 'Urban Penthouses',
      label: 'Urban Penthouses',
      count: PORTFOLIO_PROJECTS.filter((p) => p.category === 'Urban Penthouses').length,
    },
    {
      value: 'Hospitality',
      label: 'Hospitality',
      count: PORTFOLIO_PROJECTS.filter((p) => p.category === 'Hospitality').length,
    },
  ];

  readonly residenceTypeOptions: UiSelectOption[] = [
    { value: 'Coastal Villa', label: 'Coastal Villa', hint: 'Oceanfront or cliffside private home' },
    { value: 'Urban Penthouse', label: 'Urban Penthouse', hint: 'High-rise residence or sky salon' },
    { value: 'Private Residence', label: 'Private Residence', hint: 'Full-home architectural remodel' },
    { value: 'Hospitality', label: 'Boutique Hospitality', hint: 'Private estate, club, or retreat' },
  ];

  readonly scaleOptions: UiSelectOption[] = [
    { value: '2,000 – 4,000 sq ft', label: '2,000 – 4,000 sq ft', hint: 'Focused suite or urban flat' },
    { value: '4,000 – 7,500 sq ft', label: '4,000 – 7,500 sq ft', hint: 'Multi-level primary residence' },
    { value: '7,500+ sq ft', label: '7,500+ sq ft Estate', hint: 'Compound or coastal pavilion' },
  ];

  readonly materialDirectionOptions: UiSelectOption[] = [
    {
      value: 'Roman Honed Travertine',
      label: 'Roman Honed Travertine',
      hint: 'Tivoli, Italy · Unfilled Open-Pore Matte',
    },
    {
      value: 'Smoked European Oak',
      label: 'Smoked European Oak',
      hint: 'Bavaria, Germany · Wire-Brushed Natural Oil',
    },
    {
      value: 'Unlacquered Aged Brass',
      label: 'Unlacquered Aged Brass',
      hint: 'Antwerp, Belgium · Hand-Burnished Satin',
    },
    {
      value: 'Belgian Raw Bouclé & Linen',
      label: 'Belgian Raw Bouclé & Linen',
      hint: 'Kortrijk, Belgium · Heavyweight Unbleached Weave',
    },
    {
      value: 'Studio Curated Blend',
      label: 'Studio Curated Blend',
      hint: 'Full stone, timber, and textile board',
    },
  ];

  readonly mobileMenuOpen = signal(false);
  readonly heroImageFailed = signal(false);
  readonly failedProjectImages = signal<Record<string, boolean>>({});
  readonly activeSection = signal<string>('process');

  readonly activePhaseIndex = signal(0);
  readonly activeMaterialIndex = signal(0);
  readonly selectedCategory = signal<PortfolioCategory>('All');
  readonly activeTestimonialIndex = signal(0);
  readonly lightboxProject = signal<PortfolioProject | null>(null);

  readonly inquirySubmitted = signal(false);
  readonly submittedSummary = signal<InquiryReceipt | null>(null);

  readonly toastTitle = signal('');
  readonly toastMessage = signal<string | null>(null);
  private toastTimer?: ReturnType<typeof setTimeout>;
  private stopScrollProgress?: () => void;
  private sectionObserver?: IntersectionObserver;

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
    materialDirection: ['Roman Honed Travertine', Validators.required],
    projectNotes: ['', [Validators.required, Validators.minLength(12)]],
  });

  ngAfterViewInit(): void {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.ngZone.runOutsideAngular(() => {
      if (!prefersReduced && this.heroBackdropImg?.nativeElement) {
        animate(
          this.heroBackdropImg.nativeElement,
          { transform: ['scale(1.05)', 'scale(1)'] },
          { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
        );
      }

      const progressEl = this.scrollProgressBar?.nativeElement;
      if (progressEl) {
        this.stopScrollProgress = scroll((progress: number) => {
          const clamped = Math.min(Math.max(progress, 0), 1);
          progressEl.style.transform = `scaleX(${clamped.toFixed(4)})`;
        });
      }

      if (typeof IntersectionObserver !== 'undefined') {
        const sectionIds = ['process', 'services', 'portfolio', 'testimonials', 'contact'];
        this.sectionObserver = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                const nextId = entry.target.id;
                if (nextId && this.activeSection() !== nextId) {
                  this.ngZone.run(() => this.activeSection.set(nextId));
                }
                break;
              }
            }
          },
          { rootMargin: '-30% 0px -55% 0px', threshold: 0 },
        );

        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el) this.sectionObserver.observe(el);
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.stopScrollProgress?.();
    this.sectionObserver?.disconnect();
    document.body.style.overflow = '';
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  selectPhase(index: number): void {
    if (this.activePhaseIndex() === index) return;
    this.activePhaseIndex.set(index);
    this.pulseContentSwap(this.phaseDetailCard?.nativeElement);
  }

  selectMaterial(index: number): void {
    if (this.activeMaterialIndex() === index) return;
    this.activeMaterialIndex.set(index);
    this.pulseContentSwap(this.materialDetailCard?.nativeElement);
  }

  applyMaterialToConsultation(): void {
    const mat = this.activeMaterial();
    this.inquiryForm.patchValue({ materialDirection: mat.name });
    this.inquirySubmitted.set(false);
    this.showToast('Material Brief Updated', `${mat.name} added to your consultation inquiry.`);
  }

  setCategory(category: PortfolioCategory): void {
    this.selectedCategory.set(category);
  }

  selectTestimonial(index: number): void {
    if (this.activeTestimonialIndex() === index) return;
    this.activeTestimonialIndex.set(index);
    this.pulseContentSwap(this.testimonialQuoteCard?.nativeElement);
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
    this.showToast('Project Referenced', `${project.title} linked to your consultation form.`);
  }

  copyStudioEmail(): void {
    const email = 'studio@coastalinterio.com';
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(email).catch(() => {});
    }
    this.showToast('Email Copied', `${email} copied to clipboard.`);
  }

  getFieldError(controlName: 'fullName' | 'email' | 'projectNotes'): string {
    const control = this.inquiryForm.controls[controlName];
    if (!(control.invalid && (control.dirty || control.touched))) {
      return '';
    }
    if (controlName === 'fullName') {
      return 'Please enter your full name.';
    }
    if (controlName === 'email') {
      return 'Please provide a valid email address.';
    }
    return 'Please include a brief summary of your residence or timeline (min. 12 characters).';
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
      materialDirection: raw.materialDirection,
    });
    this.inquirySubmitted.set(true);
    this.showToast('Inquiry Logged', 'Your architectural consultation request has been saved.');
  }

  resetInquiry(): void {
    this.inquiryForm.reset({
      fullName: '',
      email: '',
      residenceType: 'Coastal Villa',
      scaleSqFt: '4,000 – 7,500 sq ft',
      materialDirection: 'Roman Honed Travertine',
      projectNotes: '',
    });
    this.inquirySubmitted.set(false);
    this.submittedSummary.set(null);
  }

  dismissToast(): void {
    this.toastMessage.set(null);
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private showToast(title: string, message: string): void {
    this.toastTitle.set(title);
    this.toastMessage.set(message);
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastTimer = setTimeout(() => {
      this.toastMessage.set(null);
    }, 3600);
  }

  private pulseContentSwap(element?: HTMLElement): void {
    if (!element) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    animate(
      element,
      {
        opacity: [0.65, 1],
        transform: ['translateY(6px)', 'translateY(0px)'],
      },
      { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
    );
  }
}
