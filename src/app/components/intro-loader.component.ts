import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-intro-loader',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div
        class="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] overflow-hidden"
        aria-hidden="true"
      >
        <div
          class="top-progress-shimmer h-full w-full bg-gradient-to-r from-[#b9abff] via-white to-[#36d67e]"
        ></div>
      </div>
    }
  `,
})
export class IntroLoaderComponent implements OnInit, OnDestroy {
  readonly visible = signal(true);
  private timerId?: number;

  ngOnInit(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.visible.set(false);
      return;
    }
    this.timerId = window.setTimeout(() => this.visible.set(false), 620);
  }

  ngOnDestroy(): void {
    if (this.timerId) clearTimeout(this.timerId);
  }
}
