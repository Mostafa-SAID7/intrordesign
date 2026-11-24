import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownOption, GlassDropdownComponent } from './components/glass-dropdown.component';
import { GlassHeroComponent, HeroSearchQuery } from './components/glass-hero.component';
import { IntroLoaderComponent } from './components/intro-loader.component';
import { NavItem, StudioHeaderComponent } from './components/studio-header.component';
import { TooltipComponent } from './components/tooltip.component';
import {
  HERO_RESIDENCE_IMAGE,
  LEASING_PROCESS,
  PropertyCategory,
  RENTAL_LISTINGS,
  RENTAL_METRICS,
  RENTAL_SERVICES,
  RESIDENT_REVIEWS,
  RentalListing,
} from './data/studio.data';
import { RevealDirective } from './shared/reveal.directive';

type CategoryFilter = 'All Residences' | PropertyCategory;
type SortOption = 'featured' | 'rent-asc' | 'rent-desc' | 'sqft-desc';
type EstimatorTerm = '6 Months' | '12 Months' | '24 Months';

const STORAGE_KEY = 'coastal_estates_saved_ids';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IntroLoaderComponent,
    StudioHeaderComponent,
    GlassHeroComponent,
    GlassDropdownComponent,
    TooltipComponent,
    RevealDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
})
export class AppComponent {
  private readonly fb = inject(FormBuilder);

  readonly heroImage = HERO_RESIDENCE_IMAGE;
  readonly metrics = RENTAL_METRICS;
  readonly processSteps = LEASING_PROCESS;
  readonly services = RENTAL_SERVICES;
  readonly listings = RENTAL_LISTINGS;
  readonly reviews = RESIDENT_REVIEWS;

  readonly navLinks: NavItem[] = [
    { id: 'listings', label: 'Residences' },
    { id: 'services', label: 'Services' },
    { id: 'process', label: 'Process' },
    { id: 'estimator', label: 'Lease Estimator' },
    { id: 'testimonials', label: 'Reviews' },
  ];

  readonly categoryTabs: CategoryFilter[] = [
    'All Residences',
    'Waterfront Villas',
    'Penthouse Lofts',
    'Modern Pavilions',
  ];

  readonly bedroomOptions: DropdownOption[] = [
    { value: '0', label: 'Any Bedrooms' },
    { value: '2', label: '2+ Bedrooms' },
    { value: '3', label: '3+ Bedrooms' },
    { value: '4', label: '4+ Bedrooms' },
  ];

  readonly sortOptions: DropdownOption[] = [
    { value: 'featured', label: 'Sort: Featured' },
    { value: 'rent-asc', label: 'Rent: Low to High' },
    { value: 'rent-desc', label: 'Rent: High to Low' },
    { value: 'sqft-desc', label: 'Area: Largest First' },
  ];

  readonly residenceDropdownOptions: DropdownOption[] = RENTAL_LISTINGS.map((r) => ({
    value: r.id,
    label: r.title,
    hint: `$${r.monthlyRent.toLocaleString('en-US')}/mo`,
  }));

  readonly leaseTermOptions: DropdownOption[] = [
    { value: '6 Months', label: '6 Months (Seasonal)', hint: 'Standard rate' },
    { value: '12 Months', label: '12 Months (Annual)', hint: 'Standard rate' },
    { value: '24 Months', label: '24 Months (Extended)', hint: '4% preferred' },
  ];

  readonly moveInOptions: DropdownOption[] = [
    { value: 'immediate', label: 'Immediate (Within 14 Days)', hint: 'Priority' },
    { value: '30-days', label: '30–45 Days', hint: 'Flexible' },
    { value: 'next-quarter', label: 'Next Quarter (60–90 Days)', hint: 'Pre-lease' },
  ];

  // Live catalog filters
  readonly searchQuery = signal('');
  readonly activeCategory = signal<CategoryFilter>('All Residences');
  readonly minBeds = signal('0');
  readonly leaseTermFilter = signal('all');
  readonly sortBy = signal<SortOption>('featured');
  readonly furnishedOnly = signal(false);
  readonly petFriendlyOnly = signal(false);

  // Interactive modals, shortlist & image fallback
  readonly activeListing = signal<RentalListing | null>(null);
  readonly savedDrawerOpen = signal(false);
  readonly savedIds = signal<string[]>(this.loadSavedIds());
  readonly imageErrors = signal<Record<string, boolean>>({});

  // Lease cost estimator state
  readonly estimatorResidenceId = signal<string>(RENTAL_LISTINGS[0].id);
  readonly estimatorTerm = signal<EstimatorTerm>('12 Months');
  readonly estimatorEvBay = signal(false);
  readonly estimatorFurnishedPkg = signal(false);

  // Booking form state
  readonly formSubmitted = signal(false);
  readonly submittedName = signal('');
  readonly submittedResidenceTitle = signal('');
  readonly attemptedSubmit = signal(false);

  readonly filteredListings = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const cat = this.activeCategory();
    const bedsMin = Number(this.minBeds()) || 0;
    const termFilter = this.leaseTermFilter();
    const furnished = this.furnishedOnly();
    const pets = this.petFriendlyOnly();
    const sort = this.sortBy();

    const list = this.listings.filter((item) => {
      if (cat !== 'All Residences' && item.category !== cat) return false;
      if (item.beds < bedsMin) return false;
      if (termFilter !== 'all' && !item.leaseTerms.includes(termFilter as EstimatorTerm)) {
        return false;
      }
      if (furnished && !item.furnished) return false;
      if (pets && !item.petFriendly) return false;
      if (q) {
        const haystack =
          `${item.title} ${item.neighborhood} ${item.category} ${item.summary} ${item.amenities.join(' ')}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (sort === 'rent-asc') return [...list].sort((a, b) => a.monthlyRent - b.monthlyRent);
    if (sort === 'rent-desc') return [...list].sort((a, b) => b.monthlyRent - a.monthlyRent);
    if (sort === 'sqft-desc') return [...list].sort((a, b) => b.sqft - a.sqft);
    return list;
  });

  readonly savedListings = computed(() => {
    const ids = new Set(this.savedIds());
    return this.listings.filter((item) => ids.has(item.id));
  });

  readonly hasActiveFilters = computed(() => {
    return (
      this.searchQuery().trim().length > 0 ||
      this.activeCategory() !== 'All Residences' ||
      this.minBeds() !== '0' ||
      this.leaseTermFilter() !== 'all' ||
      this.furnishedOnly() ||
      this.petFriendlyOnly()
    );
  });

  readonly estimatorResidence = computed(
    () => this.listings.find((l) => l.id === this.estimatorResidenceId()) ?? this.listings[0]
  );

  readonly estimatorBreakdown = computed(() => {
    const res = this.estimatorResidence();
    const term = this.estimatorTerm();
    const termDiscount = term === '24 Months' ? 0.96 : 1;
    const adjustedBase = Math.round(res.monthlyRent * termDiscount);
    const evAddon = this.estimatorEvBay() ? 450 : 0;
    const furnishedAddon = !res.furnished && this.estimatorFurnishedPkg() ? 1150 : 0;
    const monthlyTotal = adjustedBase + evAddon + furnishedAddon;
    const deposit = Math.round(res.monthlyRent * res.depositMonths);
    const firstMonthAndDeposit = monthlyTotal + deposit;
    const annualSavings = term === '24 Months' ? (res.monthlyRent - adjustedBase) * 12 : 0;

    return {
      adjustedBase,
      evAddon,
      furnishedAddon,
      monthlyTotal,
      deposit,
      firstMonthAndDeposit,
      annualSavings,
    };
  });

  readonly bookingForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    residenceId: [RENTAL_LISTINGS[0].id, Validators.required],
    leaseTerm: ['12 Months', Validators.required],
    moveInWindow: ['30-days', Validators.required],
    notes: [''],
  });

  onHeroSearch(payload: HeroSearchQuery): void {
    this.searchQuery.set(payload.query);
    this.leaseTermFilter.set(payload.leaseTerm || 'all');
    this.scrollToSection('listings');
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.activeCategory.set('All Residences');
    this.minBeds.set('0');
    this.leaseTermFilter.set('all');
    this.sortBy.set('featured');
    this.furnishedOnly.set(false);
    this.petFriendlyOnly.set(false);
  }

  isSaved(id: string): boolean {
    return this.savedIds().includes(id);
  }

  toggleSaved(id: string, event?: Event): void {
    event?.stopPropagation();
    this.savedIds.update((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      this.persistSavedIds(next);
      return next;
    });
  }

  openListingModal(listing: RentalListing): void {
    this.activeListing.set(listing);
  }

  closeListingModal(): void {
    this.activeListing.set(null);
  }

  bookResidence(listing: RentalListing): void {
    this.bookingForm.patchValue({ residenceId: listing.id });
    this.activeListing.set(null);
    this.savedDrawerOpen.set(false);
    this.formSubmitted.set(false);
    this.scrollToSection('consultation');
  }

  selectForEstimator(residenceId: string): void {
    this.estimatorResidenceId.set(residenceId);
    const res = this.listings.find((l) => l.id === residenceId);
    if (res && !res.leaseTerms.includes(this.estimatorTerm())) {
      this.estimatorTerm.set(res.leaseTerms[0]);
    }
    if (res?.furnished) {
      this.estimatorFurnishedPkg.set(false);
    }
  }

  markImageError(id: string): void {
    this.imageErrors.update((prev) => ({ ...prev, [id]: true }));
  }

  scrollToSection(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  showError(
    controlName: 'fullName' | 'email' | 'residenceId' | 'leaseTerm' | 'moveInWindow'
  ): boolean {
    const ctrl = this.bookingForm.controls[controlName];
    return ctrl.invalid && (ctrl.touched || this.attemptedSubmit());
  }

  submitBooking(): void {
    this.attemptedSubmit.set(true);
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }
    const resId = this.bookingForm.controls.residenceId.value;
    const found = this.listings.find((r) => r.id === resId);
    this.submittedName.set(this.bookingForm.controls.fullName.value.trim());
    this.submittedResidenceTitle.set(found?.title ?? 'Selected Residence');
    this.formSubmitted.set(true);
  }

  resetBooking(): void {
    this.formSubmitted.set(false);
    this.attemptedSubmit.set(false);
    this.bookingForm.reset({
      fullName: '',
      email: '',
      residenceId: RENTAL_LISTINGS[0].id,
      leaseTerm: '12 Months',
      moveInWindow: '30-days',
      notes: '',
    });
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.activeListing()) {
      this.closeListingModal();
    } else if (this.savedDrawerOpen()) {
      this.savedDrawerOpen.set(false);
    }
  }

  private loadSavedIds(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return ['big-sur-headland-villa'];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
    } catch {
      return [];
    }
  }

  private persistSavedIds(ids: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // Ignore storage quota errors
    }
  }
}
