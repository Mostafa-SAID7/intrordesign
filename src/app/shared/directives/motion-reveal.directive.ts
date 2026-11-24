import {
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { animate, inView } from 'motion';

@Directive({
  selector: '[appMotionReveal]',
  standalone: true,
})
export class MotionRevealDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly ngZone = inject(NgZone);

  @Input() motionDelay = 0;
  @Input() motionY = 16;
  @Input() motionDuration = 0.52;
  @Input() motionImmediate = false;

  private stopObserver?: () => void;
  private hasAnimated = false;

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
      if (this.motionImmediate) {
        const y = Math.min(this.motionY, 10);
        node.style.willChange = 'transform';
        animate(
          node,
          { transform: [`translate3d(0, ${y}px, 0)`, 'translate3d(0, 0px, 0)'] },
          { duration: this.motionDuration, delay: this.motionDelay, ease: [0.16, 1, 0.3, 1] },
        ).then(() => {
          node.style.willChange = 'auto';
        });
        return;
      }

      const rect = node.getBoundingClientRect();
      const inInitialViewport = rect.top < window.innerHeight * 0.96;

      if (inInitialViewport) {
        this.runReveal(node, 0.92);
        return;
      }

      node.style.opacity = '0';
      node.style.transform = `translate3d(0, ${this.motionY}px, 0)`;
      node.style.willChange = 'transform, opacity';

      this.stopObserver = inView(
        node,
        () => {
          this.runReveal(node, 0);
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

  private runReveal(node: HTMLElement, startOpacity: number): void {
    if (this.hasAnimated) return;
    this.hasAnimated = true;

    animate(
      node,
      {
        opacity: [startOpacity, 1],
        transform: [`translate3d(0, ${this.motionY}px, 0)`, 'translate3d(0, 0px, 0)'],
      },
      {
        duration: this.motionDuration,
        delay: this.motionDelay,
        ease: [0.16, 1, 0.3, 1],
      },
    ).then(() => {
      node.style.willChange = 'auto';
    });
  }
}
