import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { animate } from 'motion';

@Directive({
  selector: '[appMotionMagnetic]',
  standalone: true,
})
export class MotionMagneticDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly ngZone = inject(NgZone);

  @Input() magneticStrength = 6;

  private cachedRect?: DOMRect;
  private cleanupListeners: Array<() => void> = [];

  ngOnInit(): void {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const node = this.el.nativeElement;

    this.ngZone.runOutsideAngular(() => {
      const onEnter = () => {
        this.cachedRect = node.getBoundingClientRect();
      };
      const onMove = (event: PointerEvent) => {
        if (event.pointerType === 'touch') return;
        const rect = this.cachedRect ?? node.getBoundingClientRect();
        this.cachedRect = rect;
        const relX = (event.clientX - rect.left) / rect.width - 0.5;
        const relY = (event.clientY - rect.top) / rect.height - 0.5;
        const tx = relX * this.magneticStrength * 2;
        const ty = relY * this.magneticStrength * 2;

        animate(
          node,
          { transform: `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)` },
          { duration: 0.16, ease: [0.16, 1, 0.3, 1] },
        );
      };
      const onLeave = () => {
        this.cachedRect = undefined;
        animate(
          node,
          { transform: 'translate3d(0px, 0px, 0)' },
          { type: 'spring', stiffness: 320, damping: 22 },
        );
      };

      node.addEventListener('pointerenter', onEnter, { passive: true });
      node.addEventListener('pointermove', onMove, { passive: true });
      node.addEventListener('pointerleave', onLeave, { passive: true });

      this.cleanupListeners.push(
        () => node.removeEventListener('pointerenter', onEnter),
        () => node.removeEventListener('pointermove', onMove),
        () => node.removeEventListener('pointerleave', onLeave),
      );
    });
  }

  ngOnDestroy(): void {
    this.cleanupListeners.forEach((fn) => fn());
  }
}
