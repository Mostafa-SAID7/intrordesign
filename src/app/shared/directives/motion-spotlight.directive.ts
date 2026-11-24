import {
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appMotionSpotlight]',
  standalone: true,
})
export class MotionSpotlightDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly ngZone = inject(NgZone);

  @Input() spotlightColor = 'rgba(200, 169, 126, 0.11)';
  @Input() spotlightSize = 360;

  private overlayEl?: HTMLDivElement;
  private cachedRect?: DOMRect;
  private rafId?: number;
  private lastX = 0;
  private lastY = 0;
  private reducedMotion = false;
  private cleanupListeners: Array<() => void> = [];

  ngOnInit(): void {
    this.reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.reducedMotion) return;

    const host = this.el.nativeElement;
    const computedPos = window.getComputedStyle(host).position;
    if (computedPos === 'static') {
      host.style.position = 'relative';
    }

    const overlay = document.createElement('div');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.position = 'absolute';
    overlay.style.inset = '0';
    overlay.style.pointerEvents = 'none';
    overlay.style.borderRadius = 'inherit';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 220ms cubic-bezier(0.16, 1, 0.3, 1)';
    overlay.style.zIndex = '1';
    host.appendChild(overlay);
    this.overlayEl = overlay;

    this.ngZone.runOutsideAngular(() => {
      const onEnter = () => {
        this.cachedRect = host.getBoundingClientRect();
      };
      const onMove = (event: PointerEvent) => {
        if (event.pointerType === 'touch') return;
        if (!this.cachedRect) {
          this.cachedRect = host.getBoundingClientRect();
        }
        this.lastX = event.clientX - this.cachedRect.left;
        this.lastY = event.clientY - this.cachedRect.top;
        if (this.rafId === undefined) {
          this.rafId = requestAnimationFrame(() => {
            this.rafId = undefined;
            if (!this.overlayEl) return;
            this.overlayEl.style.background = `radial-gradient(${this.spotlightSize}px circle at ${this.lastX}px ${this.lastY}px, ${this.spotlightColor}, transparent 70%)`;
            this.overlayEl.style.opacity = '1';
          });
        }
      };
      const onLeave = () => {
        this.cachedRect = undefined;
        if (this.overlayEl) {
          this.overlayEl.style.opacity = '0';
        }
      };

      host.addEventListener('pointerenter', onEnter, { passive: true });
      host.addEventListener('pointermove', onMove, { passive: true });
      host.addEventListener('pointerleave', onLeave, { passive: true });

      this.cleanupListeners.push(
        () => host.removeEventListener('pointerenter', onEnter),
        () => host.removeEventListener('pointermove', onMove),
        () => host.removeEventListener('pointerleave', onLeave),
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
