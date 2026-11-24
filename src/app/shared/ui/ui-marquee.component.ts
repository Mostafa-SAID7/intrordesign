import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { scroll } from 'motion';

@Component({
  selector: 'app-ui-marquee',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="border-y border-white/10 bg-[#070707] py-4 overflow-hidden select-none"
      aria-hidden="true"
    >
      <div
        #track
        class="flex items-center gap-8 whitespace-nowrap will-change-transform text-xs md:text-sm tracking-[0.18em] uppercase text-neutral-400"
      >
        @for (item of repeatedItems; track $index) {
          <span class="inline-flex items-center gap-8 shrink-0">
            <span class="font-serif italic normal-case tracking-normal text-base md:text-lg text-[#C8A97E]">
              {{ item }}
            </span>
            <span class="text-white/20">·</span>
          </span>
        }
      </div>
    </div>
  `,
})
export class UiMarqueeComponent implements OnInit, OnDestroy {
  private readonly ngZone = inject(NgZone);

  @Input() items: string[] = [
    'Coastal Villas',
    'Roman Travertine',
    'Smoked European Oak',
    'Bespoke Millwork',
    'Circadian Lighting',
    'Turnkey Residences',
  ];

  @ViewChild('track', { static: true }) trackRef!: ElementRef<HTMLElement>;

  private stopScroll?: () => void;

  get repeatedItems(): string[] {
    return [...this.items, ...this.items, ...this.items];
  }

  ngOnInit(): void {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    this.ngZone.runOutsideAngular(() => {
      const track = this.trackRef.nativeElement;
      this.stopScroll = scroll((progress: number) => {
        const shift = -(progress * 260);
        track.style.transform = `translate3d(${shift.toFixed(1)}px, 0, 0)`;
      });
    });
  }

  ngOnDestroy(): void {
    this.stopScroll?.();
  }
}
