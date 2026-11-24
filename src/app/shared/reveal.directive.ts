import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';

let sharedObserver: IntersectionObserver | null = null;

function getSharedObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null;
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.classList.add('is-revealed');
            sharedObserver?.unobserve(target);
          }
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px 80px 0px' }
    );
  }
  return sharedObserver;
}

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements OnInit, OnDestroy {
  @Input() revealDelay = 0;

  private readonly el = inject(ElementRef<HTMLElement>);

  ngOnInit(): void {
    const node = this.el.nativeElement;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.classList.add('is-revealed');
      return;
    }

    node.classList.add('ms-reveal');
    if (this.revealDelay > 0) {
      node.style.transitionDelay = `${Math.min(this.revealDelay, 180)}ms`;
    }

    const obs = getSharedObserver();
    if (!obs) {
      node.classList.add('is-revealed');
      return;
    }
    obs.observe(node);
  }

  ngOnDestroy(): void {
    sharedObserver?.unobserve(this.el.nativeElement);
  }
}
