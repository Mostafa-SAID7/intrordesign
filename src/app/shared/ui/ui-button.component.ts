import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type UiButtonVariant = 'primary' | 'secondary' | 'ghost';
export type UiButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (href) {
      <a
        [href]="href"
        (click)="clicked.emit($event)"
        [ngClass]="computedClasses"
      >
        <ng-container *ngTemplateOutlet="contentTpl"></ng-container>
      </a>
    } @else {
      <button
        [type]="type"
        [disabled]="disabled"
        (click)="clicked.emit($event)"
        [ngClass]="computedClasses"
      >
        <ng-container *ngTemplateOutlet="contentTpl"></ng-container>
      </button>
    }

    <ng-template #contentTpl>
      <ng-content></ng-content>
    </ng-template>
  `,
})
export class UiButtonComponent {
  @Input() variant: UiButtonVariant = 'primary';
  @Input() size: UiButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() href?: string;
  @Input() fullWidth = false;
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<Event>();

  get computedClasses(): string {
    const base =
      'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const sizeClass =
      this.size === 'sm'
        ? 'px-4 py-2 text-xs'
        : this.size === 'lg'
          ? 'px-7 py-4 text-sm'
          : 'px-6 py-3 text-sm';

    const variantClass =
      this.variant === 'primary'
        ? 'bg-[#C8A97E] text-[#050505] font-semibold hover:bg-[#d8bc93] focus-visible:outline-white'
        : this.variant === 'secondary'
          ? 'border border-white/20 text-white hover:bg-white/10 hover:border-white/35 focus-visible:outline-[#C8A97E]'
          : 'text-[#C8A97E] hover:text-white hover:bg-white/5 focus-visible:outline-[#C8A97E]';

    const widthClass = this.fullWidth ? 'w-full' : '';

    return `${base} ${sizeClass} ${variantClass} ${widthClass}`.trim();
  }
}
