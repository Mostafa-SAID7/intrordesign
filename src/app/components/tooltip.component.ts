import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="relative inline-flex items-center"
      (mouseenter)="open.set(true)"
      (mouseleave)="open.set(false)"
      (focusin)="open.set(true)"
      (focusout)="open.set(false)"
    >
      <button
        type="button"
        [attr.aria-label]="text"
        class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-[11px] font-medium text-white/65 transition-colors duration-150 hover:border-[#b9abff]/50 hover:text-[#b9abff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b9abff]"
      >
        ?
      </button>

      @if (open()) {
        <span
          role="tooltip"
          class="pointer-events-none absolute left-1/2 z-40 w-60 -translate-x-1/2 rounded-xl border border-white/15 bg-[#17171b]/95 px-3.5 py-2.5 text-left text-xs leading-relaxed text-[#e6e6ec] shadow-[0_16px_40px_rgba(0,0,0,0.72),inset_0_1px_0_rgba(255,255,255,0.16)]"
          [ngClass]="position === 'bottom' ? 'top-full mt-2.5' : 'bottom-full mb-2.5'"
        >
          {{ text }}
        </span>
      }
    </span>
  `,
})
export class TooltipComponent {
  @Input({ required: true }) text = '';
  @Input() position: 'top' | 'bottom' = 'top';

  readonly open = signal(false);
}
