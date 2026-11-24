import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { animate } from 'motion';

@Directive({
  selector: '[appMotionTilt]',
  standalone: true,
})
export class MotionTiltDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly ngZone = inject(NgZone);

  @Input() maxTiltDeg = 2.4;

  private cachedRect?: DOMRect;
  private rafId?: number;
  private targetRx = 0;
  private targetRy = 0;
  private cleanupListeners: Array<() => void> = [];

  ngOnInit(): void {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const node = this.el.nativeElement;

    this.ngZone.runOutsideAngular(() => {
      const onEnter = () => {
        this.cachedRect = node.getBoundingClientRect();
        node.style.willChange = 'transform';
      };

      const onMove = (event: PointerEvent) => {
        if (event.pointerType === 'touch') return;
        const rect = this.cachedRect ?? node.getBoundingClientRect();
        this.cachedRect = rect;
        const normX = (event.clientX - rect.left) / rect.width - 0.5;
        const normY = (event.clientY - rect.top) / rect.height - 0.5;
        this.targetRy = normX * this.maxTiltDeg * 2;
        this.targetRx = -normY * this.maxTiltDeg * 2;

        if (this.rafId === undefined) {
          this.rafId = requestAnimationFrame(() => {
            this.rafId = undefined;
            node.style.transform = `perspective(1200px) rotateX(${this.targetRx.toFixed(2)}deg) rotateY(${this.targetRy.toFixed(2)}deg) translateZ(0)`;
          });
        }
      };

      const onLeave = () => {
        this.cachedRect = undefined;
        if (this.rafId !== undefined) {
          cancelAnimationFrame(this.rafId);
          this.rafId = undefined;
        }
        animate(
          node,
          { transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)' },
          { type: 'spring', stiffness: 240, damping: 24 },
        ).then(() => {
          node.style.willChange = 'auto';
        });
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
    if (this.rafId !== undefined) {
      cancelAnimationFrame(this.rafId);
    }
    this.cleanupListeners.forEach((fn) => fn());
  }
}
