import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RENTAL_STANDARDS, RentalMetric } from '../data/studio.data';
import { DropdownOption, GlassDropdownComponent } from './glass-dropdown.component';

export interface HeroSearchQuery {
  query: string;
  leaseTerm: string;
}

interface GlassShard {
  id: string;
  clipPath: string;
}

@Component({
  selector: 'app-glass-hero',
  standalone: true,
  imports: [CommonModule, FormsModule, GlassDropdownComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="top" class="relative overflow-x-clip pt-24 pb-12 sm:pt-32 sm:pb-16">
      <div class="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-10">
        <!-- Split Hero Slab: GPU-driven pointer tilt & glow running outside Angular zone -->
        <div
          #heroSlab
          class="smoked-slab relative z-20 rounded-[24px] p-6 sm:p-10 lg:p-12"
        >
          <!-- Soft lavender cursor refraction glow (clipped inside rounded corners) -->
          <div class="pointer-events-none absolute inset-0 overflow-hidden rounded-[24px]">
            <div
              #glowLayer
              class="pointer-events-none absolute -inset-px rounded-[24px] opacity-0 transition-opacity duration-200"
              style="background: radial-gradient(440px circle at var(--mx, 50%) var(--my, 50%), rgba(185, 171, 255, 0.14), rgba(54, 214, 126, 0.04) 42%, transparent 72%);"
            ></div>
          </div>

          @if (!standardsOpen()) {
            <div class="relative z-10 grid items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
              <!-- Left Column: Rental Proposition & Instant Search Bar -->
              <div class="flex flex-col justify-between lg:col-span-6">
                <div>
                  <p class="text-[11px] font-medium uppercase tracking-[0.2em] text-white/45">
                    Coastal Estates · Architectural Residential Leasing
                  </p>
                  <h1
                    class="font-display mt-4 text-[clamp(2.35rem,4.3vw,4rem)] font-medium leading-[0.98] tracking-[-0.03em] text-transparent bg-gradient-to-b from-[#f3f3f6] to-[#b8b8c2] bg-clip-text text-balance"
                  >
                    Lease residences sculpted in stone &amp; smoked glass.
                  </h1>
                  <p class="mt-5 max-w-xl text-[15px] leading-relaxed text-white/62">
                    Verified waterfront villas, penthouse lofts, and quiet courtyard pavilions with
                    48-hour digital approval, escrow deposit protection, and white-glove move-in.
                  </p>
                </div>

                <!-- Instant Rental Search Bar -->
                <form
                  (ngSubmit)="emitSearch()"
                  class="mt-7 grid gap-2.5 rounded-2xl border border-white/12 bg-[#0d0d11]/85 p-2.5 sm:grid-cols-12"
                >
                  <div class="sm:col-span-5">
                    <label for="hero-search" class="sr-only">Neighborhood or residence</label>
                    <input
                      id="hero-search"
                      type="text"
                      name="heroQuery"
                      [(ngModel)]="searchText"
                      placeholder="Big Sur, Marina, Pool..."
                      class="h-10 w-full rounded-xl border border-white/10 bg-[#15151b] px-3.5 text-sm text-white placeholder:text-white/35 focus:border-[#b9abff]/60 focus:outline-none"
                    />
                  </div>
                  <div class="sm:col-span-4">
                    <app-glass-dropdown
                      name="heroTerm"
                      [(ngModel)]="selectedTerm"
                      [options]="termOptions"
                      placeholder="Any Lease Term"
                    />
                  </div>
                  <div class="sm:col-span-3">
                    <button
                      type="submit"
                      class="h-10 w-full shrink-0 whitespace-nowrap rounded-xl bg-[#ececf0] px-4 text-xs font-semibold text-[#09090d] transition-colors duration-150 hover:bg-[#36d67e] hover:text-[#04140a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#36d67e]"
                    >
                      Search Homes
                    </button>
                  </div>
                </form>

                <div class="mt-6 flex flex-wrap items-center gap-6">
                  <button
                    type="button"
                    (click)="bookClick.emit()"
                    class="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-white/18 bg-white/[0.04] px-5 text-xs font-semibold text-white transition-colors duration-150 hover:border-[#36d67e]/60 hover:text-[#36d67e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#36d67e]"
                  >
                    Schedule Private Viewing
                  </button>

                  <button
                    type="button"
                    (click)="standardsOpen.set(true)"
                    class="group inline-flex h-10 items-center gap-2 text-xs font-medium text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b9abff]"
                  >
                    <span class="underline-offset-4 group-hover:underline">
                      Read Five Leasing Standards
                    </span>
                    <span
                      class="inline-block transition-transform duration-150 group-hover:translate-x-1"
                      aria-hidden="true"
                      >→</span
                    >
                  </button>
                </div>
              </div>

              <!-- Right Column: Interactive Smoked-Glass Faceted Featured Rental -->
              <div class="relative min-h-[320px] lg:col-span-6 lg:min-h-[450px]">
                <div
                  #tiltCard
                  class="relative h-full w-full overflow-hidden rounded-2xl border border-white/15 bg-[#0e0e12] will-change-transform"
                  style="transform: perspective(1100px) rotateX(0.6deg) rotateY(-1deg);"
                >
                  <img
                    [src]="heroImage"
                    alt="Big Sur Headland Glass Villa twilight oceanfront living room available for lease"
                    referrerPolicy="no-referrer"
                    fetchpriority="high"
                    decoding="sync"
                    class="h-full w-full object-cover object-center"
                  />

                  <div
                    class="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050507]/88 via-[#050507]/18 to-transparent"
                  ></div>

                  <!-- Interactive Fractured Smoked-Glass Facets -->
                  @for (shard of shards; track shard.id) {
                    <div
                      (mouseenter)="hoveredShard.set(shard.id)"
                      (mouseleave)="hoveredShard.set(null)"
                      class="absolute inset-0 cursor-crosshair transition-[transform,background-color] duration-200 ease-out will-change-transform"
                      [style.clipPath]="shard.clipPath"
                      [style.transform]="
                        hoveredShard() === shard.id
                          ? 'translate3d(0, -5px, 0)'
                          : 'translate3d(0, 0, 0)'
                      "
                      [style.background]="
                        hoveredShard() === shard.id
                          ? 'linear-gradient(135deg, rgba(185,171,255,0.16), rgba(54,214,126,0.08) 65%, rgba(23,23,27,0.28))'
                          : 'rgba(23, 23, 27, 0.06)'
                      "
                      [style.boxShadow]="
                        hoveredShard() === shard.id
                          ? 'inset 0 0 0 1px rgba(255,255,255,0.42)'
                          : 'inset 0 0 0 1px rgba(255,255,255,0.11)'
                      "
                    ></div>
                  }

                  <div
                    class="pointer-events-none absolute inset-x-5 bottom-5 flex flex-wrap items-end justify-between gap-4"
                  >
                    <div>
                      <p class="text-[11px] uppercase tracking-[0.16em] text-[#36d67e]">
                        Available Now · Big Sur Coast
                      </p>
                      <p class="font-display mt-1 text-2xl font-medium text-white">
                        Big Sur Headland Glass Villa
                      </p>
                      <p class="mt-0.5 text-xs text-white/65">4 Bed · 4.5 Bath · 4,400 sq ft</p>
                    </div>
                    <div class="text-right">
                      <p class="font-mono-tabular text-xl font-semibold text-white">
                        $14,500<span class="text-xs font-normal text-white/60"> / mo</span>
                      </p>
                      <p class="text-[11px] text-white/55">6–24 mo furnished</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          } @else {
            <!-- Five Leasing Standards Smoked-Glass View -->
            <div class="relative z-10 py-6 sm:py-8">
              <div class="grid gap-10 lg:grid-cols-12 lg:items-start">
                <div class="lg:col-span-4">
                  <button
                    type="button"
                    (click)="standardsOpen.set(false)"
                    class="inline-flex items-center justify-center rounded-xl border border-white/20 bg-gradient-to-br from-[#23242c] to-[#131318] px-6 py-3.5 text-sm font-medium text-white shadow-[0_14px_34px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.22)] transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#b9abff]/60 hover:text-[#b9abff]"
                    style="transform: perspective(700px) rotateY(-8deg) rotateX(4deg);"
                  >
                    ← Back to Residences
                  </button>
                </div>

                <div class="lg:col-span-7">
                  <h2 class="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    Modern residential leasing, in five standards.
                  </h2>
                  <div class="mt-7 space-y-5 text-sm leading-[1.75] text-white/65 sm:text-[15px]">
                    @for (item of standards; track item.term) {
                      <p>
                        <strong class="font-semibold text-white">{{ item.term }}</strong> —
                        {{ item.definition }}
                      </p>
                    }
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Full-Width Rental Platform Metrics Strip -->
        <div
          class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Rental platform metrics"
        >
          @for (metric of metrics; track metric.label) {
            <div class="smoked-slab rounded-2xl px-6 py-5">
              <p class="font-mono-tabular text-2xl font-medium tracking-tight text-white sm:text-3xl">
                {{ metric.value }}
              </p>
              <p class="mt-1.5 text-sm font-medium text-white/85">{{ metric.label }}</p>
              <p class="mt-1 text-xs leading-relaxed text-white/48">{{ metric.context }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class GlassHeroComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) heroImage = '';
  @Input({ required: true }) metrics: RentalMetric[] = [];
  @Output() readonly bookClick = new EventEmitter<void>();
  @Output() readonly searchSubmit = new EventEmitter<HeroSearchQuery>();

  @ViewChild('heroSlab') heroSlabRef?: ElementRef<HTMLElement>;
  @ViewChild('glowLayer') glowLayerRef?: ElementRef<HTMLElement>;
  @ViewChild('tiltCard') tiltCardRef?: ElementRef<HTMLElement>;

  private readonly ngZone = inject(NgZone);

  readonly standardsOpen = signal(false);
  readonly hoveredShard = signal<string | null>(null);
  readonly standards = RENTAL_STANDARDS;

  searchText = '';
  selectedTerm = 'all';

  readonly termOptions: DropdownOption[] = [
    { value: 'all', label: 'Any Lease Term' },
    { value: '6 Months', label: '6 Months Seasonal' },
    { value: '12 Months', label: '12 Months Standard' },
    { value: '24 Months', label: '24 Months Preferred' },
  ];

  readonly shards: GlassShard[] = [
    { id: 'A', clipPath: 'polygon(0% 0%, 22% 0%, 38.5% 72%, 34% 100%, 0% 100%)' },
    { id: 'B', clipPath: 'polygon(22.5% 0%, 51.5% 0%, 48% 62%, 39% 71.5%)' },
    { id: 'C', clipPath: 'polygon(52% 0%, 84% 0%, 71.6% 49%, 48.5% 61.5%)' },
    { id: 'D', clipPath: 'polygon(39% 72.5%, 48.5% 62.5%, 71.6% 49.5%, 86.5% 100%, 34.5% 100%)' },
    { id: 'E', clipPath: 'polygon(84.5% 0%, 100% 0%, 100% 100%, 87% 100%, 72.2% 49%)' },
  ];

  private rafId = 0;
  private cleanups: (() => void)[] = [];

  ngAfterViewInit(): void {
    const slab = this.heroSlabRef?.nativeElement;
    if (!slab || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.ngZone.runOutsideAngular(() => {
      let pendingX = 0.5;
      let pendingY = 0.5;
      let active = false;
      let scheduled = false;

      const flush = () => {
        scheduled = false;
        const glow = this.glowLayerRef?.nativeElement;
        const card = this.tiltCardRef?.nativeElement;
        if (glow) {
          glow.style.opacity = active ? '1' : '0';
          glow.style.setProperty('--mx', `${(pendingX * 100).toFixed(1)}%`);
          glow.style.setProperty('--my', `${(pendingY * 100).toFixed(1)}%`);
        }
        if (card) {
          const rx = active ? -(pendingY - 0.5) * 4.5 : 0.6;
          const ry = active ? (pendingX - 0.5) * 6.0 : -1.0;
          card.style.transform = `perspective(1100px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
        }
      };

      const onMove = (e: PointerEvent) => {
        const rect = slab.getBoundingClientRect();
        pendingX = (e.clientX - rect.left) / (rect.width || 1);
        pendingY = (e.clientY - rect.top) / (rect.height || 1);
        active = true;
        if (!scheduled) {
          scheduled = true;
          this.rafId = requestAnimationFrame(flush);
        }
      };

      const onLeave = () => {
        active = false;
        if (!scheduled) {
          scheduled = true;
          this.rafId = requestAnimationFrame(flush);
        }
      };

      slab.addEventListener('pointermove', onMove, { passive: true });
      slab.addEventListener('pointerleave', onLeave, { passive: true });
      this.cleanups.push(
        () => slab.removeEventListener('pointermove', onMove),
        () => slab.removeEventListener('pointerleave', onLeave)
      );
    });
  }

  emitSearch(): void {
    this.searchSubmit.emit({
      query: this.searchText,
      leaseTerm: this.selectedTerm,
    });
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    for (const fn of this.cleanups) fn();
  }
}
