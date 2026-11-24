import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate } from 'motion';

@Component({
  selector: 'app-ui-toast',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (message) {
      <div
        #toastEl
        role="status"
        aria-live="polite"
        class="fixed bottom-6 right-6 z-50 max-w-sm bg-[#121110] border border-[#C8A97E]/45 rounded-xl px-5 py-3.5 shadow-2xl flex items-center justify-between gap-4"
      >
        <div class="min-w-0">
          @if (title) {
            <p class="text-xs font-medium text-[#C8A97E]">{{ title }}</p>
          }
          <p class="text-sm text-neutral-100 leading-snug">{{ message }}</p>
        </div>

        <button
          type="button"
          (click)="dismiss.emit()"
          aria-label="Dismiss notification"
          class="h-8 w-8 inline-flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
        >
          <span aria-hidden="true" class="text-xs">✕</span>
        </button>
      </div>
    }
  `,
})
export class UiToastComponent {
  @Input() title = '';
  @Input() message: string | null = null;
  @Output() dismiss = new EventEmitter<void>();

  @ViewChild('toastEl') set toastElRef(el: ElementRef<HTMLElement> | undefined) {
    if (el) {
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReduced) {
        animate(
          el.nativeElement,
          {
            opacity: [0, 1],
            transform: ['translateY(12px)', 'translateY(0px)'],
          },
          { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
        );
      }
    }
  }
}
