import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { animate, inView } from 'motion';

@Directive({
  selector: '[appMotionMediaReveal]',
  standalone: true,
})
export class MotionMediaRevealDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly ngZone = inject(NgZone);

  @Input() mediaDelay = 0;

  private stopObserver?: () => void;
  private hasRevealed = false;

  ngOnInit(): void {
    const node = this.el.nativeElement;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      node.style.opacity = '1';
      node.style.transform = 'none';
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.96) {
        this.reveal(node, 1);
        return;
      }

      node.style.opacity = '0.25';
      node.style.transform = 'scale(1.06)';
      node.style.willChange = 'transform, opacity';

      this.stopObserver = inView(
        node,
        () => {
          this.reveal(node, 0.25);
          this.stopObserver?.();
          this.stopObserver = undefined;
        },
        { amount: 'some' },
      );
    });
  }

  ngOnDestroy(): void {
    this.stopObserver?.();
  }

  private reveal(node: HTMLElement, startOpacity: number): void {
    if (this.hasRevealed) return;
    this.hasRevealed = true;

    animate(
      node,
      {
        opacity: [startOpacity, 1],
        transform: ['scale(1.06)', 'scale(1)'],
      },
      {
        duration: 0.7,
        delay: this.mediaDelay,
        ease: [0.16, 1, 0.3, 1],
      },
    ).then(() => {
      node.style.willChange = 'auto';
    });
  }
}
