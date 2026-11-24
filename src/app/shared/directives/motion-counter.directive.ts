import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { animate, inView } from 'motion';

@Directive({
  selector: '[appMotionCounter]',
  standalone: true,
})
export class MotionCounterDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly ngZone = inject(NgZone);

  @Input({ required: true }) appMotionCounter!: string;
  @Input() counterDuration = 1.0;

  private stopObserver?: () => void;
  private hasPlayed = false;

  ngOnInit(): void {
    const node = this.el.nativeElement;
    const finalLabel = this.appMotionCounter;
    node.setAttribute('aria-label', finalLabel);

    const match = finalLabel.match(/^(\d+(?:\.\d+)?)(.*)$/);
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!match || prefersReduced) {
      node.textContent = finalLabel;
      return;
    }

    const target = Number(match[1]);
    const suffix = match[2] ?? '';
    node.textContent = finalLabel;

    this.ngZone.runOutsideAngular(() => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.98) {
        this.playCount(node, target, suffix, finalLabel);
        return;
      }

      this.stopObserver = inView(
        node,
        () => {
          this.playCount(node, target, suffix, finalLabel);
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

  private playCount(
    node: HTMLElement,
    target: number,
    suffix: string,
    finalLabel: string,
  ): void {
    if (this.hasPlayed) return;
    this.hasPlayed = true;

    animate(0, target, {
      duration: this.counterDuration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = `${Math.round(latest)}${suffix}`;
      },
      onComplete: () => {
        node.textContent = finalLabel;
      },
    });
  }
}
