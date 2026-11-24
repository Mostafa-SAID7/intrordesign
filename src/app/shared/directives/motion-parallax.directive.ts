import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { scroll } from 'motion';

@Directive({
  selector: '[appMotionParallax]',
  standalone: true,
})
export class MotionParallaxDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly ngZone = inject(NgZone);

  @Input() parallaxDistance = 48;

  private stopScroll?: () => void;

  ngOnInit(): void {
    const node = this.el.nativeElement;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      node.style.willChange = 'transform';
      this.stopScroll = scroll((progress: number) => {
        const clamped = Math.min(Math.max(progress * 2.5, 0), 1);
        const offset = clamped * this.parallaxDistance;
        const scale = 1 + clamped * 0.04;
        node.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
      });
    });
  }

  ngOnDestroy(): void {
    this.stopScroll?.();
  }
}
