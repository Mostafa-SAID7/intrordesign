import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { animate, inView } from 'motion';

@Directive({
  selector: '[appMotionPanelWipe]',
  standalone: true,
})
export class MotionPanelWipeDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly ngZone = inject(NgZone);

  @Input() wipeDelay = 0;

  private stopObserver?: () => void;
  private hasWiped = false;

  ngOnInit(): void {
    const node = this.el.nativeElement;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      node.style.clipPath = 'inset(0% 0% 0% 0%)';
      node.style.transform = 'none';
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.96) {
        this.runWipe(node, 'inset(0% 0% 8% 0%)');
        return;
      }

      node.style.clipPath = 'inset(0% 0% 18% 0%)';
      node.style.transform = 'scale(1.06)';
      node.style.willChange = 'clip-path, transform';

      this.stopObserver = inView(
        node,
        () => {
          this.runWipe(node, 'inset(0% 0% 18% 0%)');
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

  private runWipe(node: HTMLElement, initialClip: string): void {
    if (this.hasWiped) return;
    this.hasWiped = true;

    animate(
      node,
      {
        clipPath: [initialClip, 'inset(0% 0% 0% 0%)'],
        transform: ['scale(1.06)', 'scale(1)'],
      },
      {
        duration: 0.78,
        delay: this.wipeDelay,
        ease: [0.16, 1, 0.3, 1],
      },
    ).then(() => {
      node.style.willChange = 'auto';
    });
  }
}
