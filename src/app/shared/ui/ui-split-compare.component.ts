import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate } from 'motion';

@Component({
  selector: 'app-ui-split-compare',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-4">
      <!-- Interactive Header + Preset Snaps -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="text-xs text-neutral-400 flex items-center gap-2">
          <span class="text-[#C8A97E]">Spatial Mood Comparison</span>
          <span aria-hidden="true">·</span>
          <span>Drag divider or select a balance ratio</span>
        </div>

        <div class="inline-flex items-center gap-1 p-1 bg-[#121212] border border-white/10 rounded-lg">
          @for (preset of presets; track preset.value) {
            <button
              type="button"
              (click)="snapTo(preset.value)"
              class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap"
              [ngClass]="
                Math.abs(splitPercent() - preset.value) < 3
                  ? 'bg-[#C8A97E] text-[#050505]'
                  : 'text-neutral-300 hover:text-white'
              "
            >
              {{ preset.label }}
            </button>
          }
        </div>
      </div>

      <!-- Split Viewport -->
      <div
        #viewportEl
        tabindex="0"
        role="slider"
        aria-label="Compare daylight coastal palette and twilight oak hearth"
        [attr.aria-valuemin]="10"
        [attr.aria-valuemax]="90"
        [attr.aria-valuenow]="Math.round(splitPercent())"
        (pointerdown)="onPointerDown($event)"
        (keydown)="onKeydown($event)"
        class="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-xl border border-white/10 bg-[#0D0D0D] select-none cursor-ew-resize focus-visible:outline-2 focus-visible:outline-[#C8A97E]"
      >
        <!-- Base Layer (Right Side: Twilight Atmosphere) -->
        <img
          [src]="rightImage"
          [alt]="rightLabel"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
          class="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        <!-- Clipped Layer (Left Side: Daylight Palette) -->
        <div
          class="absolute inset-0 overflow-hidden pointer-events-none"
          [style.clipPath]="'inset(0 ' + (100 - splitPercent()) + '% 0 0)'"
        >
          <img
            [src]="leftImage"
            [alt]="leftLabel"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Contrast Scrims for Legibility -->
        <div
          class="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/35 to-transparent"
          aria-hidden="true"
        ></div>

        <!-- Labels -->
        <div
          class="pointer-events-none absolute bottom-4 left-4 md:bottom-6 md:left-6 z-10 max-w-[42%]"
        >
          <p class="text-[11px] uppercase tracking-wider text-[#C8A97E]">{{ leftTag }}</p>
          <p class="font-serif text-lg md:text-2xl text-white leading-tight">{{ leftLabel }}</p>
        </div>

        <div
          class="pointer-events-none absolute bottom-4 right-4 md:bottom-6 md:right-6 z-10 text-right max-w-[42%]"
        >
          <p class="text-[11px] uppercase tracking-wider text-[#C8A97E]">{{ rightTag }}</p>
          <p class="font-serif text-lg md:text-2xl text-white leading-tight">{{ rightLabel }}</p>
        </div>

        <!-- Divider Handle -->
        <div
          class="pointer-events-none absolute inset-y-0 z-20 w-px bg-[#C8A97E]"
          [style.left.%]="splitPercent()"
        >
          <div
            class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-[#0A0A0A]/90 border border-[#C8A97E] shadow-lg flex items-center justify-center text-[#C8A97E] text-xs font-mono"
          >
            ⇆
          </div>
        </div>
      </div>
    </div>
  `,
})
export class UiSplitCompareComponent implements OnDestroy {
  private readonly ngZone = inject(NgZone);
  readonly Math = Math;

  @Input({ required: true }) leftImage!: string;
  @Input({ required: true }) rightImage!: string;
  @Input() leftLabel = 'Daylight Quartzite & Walnut';
  @Input() rightLabel = 'Twilight Smoked Oak & Hearth';
  @Input() leftTag = 'Daylight Study';
  @Input() rightTag = 'Evening Atmosphere';

  @ViewChild('viewportEl') viewportEl?: ElementRef<HTMLElement>;

  readonly splitPercent = signal(52);

  readonly presets = [
    { label: 'Daylight Focus', value: 78 },
    { label: '50 / 50', value: 50 },
    { label: 'Twilight Focus', value: 22 },
  ];

  private dragging = false;
  private cachedRect?: DOMRect;
  private stopMove?: () => void;
  private stopUp?: () => void;

  ngOnDestroy(): void {
    this.detachWindowListeners();
  }

  snapTo(target: number): void {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      this.splitPercent.set(target);
      return;
    }

    const start = this.splitPercent();
    animate(start, target, {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => this.splitPercent.set(latest),
    });
  }

  onPointerDown(event: PointerEvent): void {
    const vp = this.viewportEl?.nativeElement;
    if (!vp) return;
    this.dragging = true;
    this.cachedRect = vp.getBoundingClientRect();
    this.updateFromClientX(event.clientX);

    this.ngZone.runOutsideAngular(() => {
      const onMove = (moveEvent: PointerEvent) => {
        if (!this.dragging) return;
        this.ngZone.run(() => this.updateFromClientX(moveEvent.clientX));
      };
      const onUp = () => {
        this.dragging = false;
        this.cachedRect = undefined;
        this.detachWindowListeners();
      };

      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerup', onUp, { passive: true });
      this.stopMove = () => window.removeEventListener('pointermove', onMove);
      this.stopUp = () => window.removeEventListener('pointerup', onUp);
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.splitPercent.update((v) => Math.max(10, v - 5));
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.splitPercent.update((v) => Math.min(90, v + 5));
    }
  }

  private updateFromClientX(clientX: number): void {
    const rect = this.cachedRect ?? this.viewportEl?.nativeElement.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const raw = ((clientX - rect.left) / rect.width) * 100;
    this.splitPercent.set(Math.min(Math.max(raw, 10), 90));
  }

  private detachWindowListeners(): void {
    this.stopMove?.();
    this.stopUp?.();
    this.stopMove = undefined;
    this.stopUp = undefined;
  }
}
