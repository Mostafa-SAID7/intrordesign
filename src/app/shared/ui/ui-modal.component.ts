import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate } from 'motion';

@Component({
  selector: 'app-ui-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/88 backdrop-blur-md p-4 md:p-8"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="ariaLabel"
        (click)="onBackdropClick($event)"
      >
        <div
          #modalPanel
          class="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto custom-scroll bg-[#0C0C0C] border border-white/10 rounded-xl shadow-2xl"
        >
          <ng-content></ng-content>
        </div>
      </div>
    }
  `,
})
export class UiModalComponent {
  @Input() open = false;
  @Input() ariaLabel = 'Modal dialog';
  @Output() closed = new EventEmitter<void>();

  @ViewChild('modalPanel') set modalPanelRef(el: ElementRef<HTMLElement> | undefined) {
    if (el) {
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReduced) {
        animate(
          el.nativeElement,
          {
            opacity: [0, 1],
            transform: ['translateY(14px) scale(0.985)', 'translateY(0px) scale(1)'],
          },
          { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
        );
      }
    }
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.open) {
      this.closed.emit();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }
}
