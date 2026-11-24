import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface DropdownOption {
  value: string;
  label: string;
  hint?: string;
}

interface MenuCoords {
  top: number | null;
  bottom: number | null;
  left: number;
  minWidth: number;
  maxHeight: number;
}

@Component({
  selector: 'app-glass-dropdown',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GlassDropdownComponent),
      multi: true,
    },
  ],
  template: `
    <div class="relative w-full">
      <button
        #triggerBtn
        type="button"
        (click)="toggle()"
        [disabled]="disabled()"
        [attr.aria-expanded]="isOpen()"
        aria-haspopup="listbox"
        class="flex h-10 w-full items-center justify-between gap-2.5 rounded-xl border bg-[#121217]/95 px-3.5 text-left text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b9abff] disabled:cursor-not-allowed disabled:opacity-50"
        [ngClass]="
          isOpen()
            ? 'border-[#b9abff]/65'
            : 'border-white/12 hover:border-white/25'
        "
      >
        <span class="truncate" [ngClass]="selectedOption() ? 'text-[#f2f2f6]' : 'text-white/45'">
          {{ selectedOption()?.label || placeholder }}
        </span>
        <svg
          class="h-4 w-4 shrink-0 text-white/55 transition-transform duration-150"
          [ngClass]="isOpen() ? 'rotate-180 text-[#b9abff]' : ''"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      @if (isOpen()) {
        <ul
          role="listbox"
          class="fixed z-[70] w-max max-w-[min(360px,calc(100vw-24px))] overflow-y-auto rounded-xl border border-white/15 bg-[#15151c]/95 p-1.5 backdrop-blur-xl shadow-[0_22px_54px_rgba(0,0,0,0.82),inset_0_1px_0_rgba(255,255,255,0.16)]"
          [style.top.px]="menuCoords().top"
          [style.bottom.px]="menuCoords().bottom"
          [style.left.px]="menuCoords().left"
          [style.minWidth.px]="menuCoords().minWidth"
          [style.maxHeight.px]="menuCoords().maxHeight"
        >
          @for (option of options; track option.value) {
            <li role="option" [attr.aria-selected]="option.value === value()">
              <button
                type="button"
                (click)="selectOption(option)"
                class="flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2 text-left text-sm whitespace-nowrap transition-colors duration-100"
                [ngClass]="
                  option.value === value()
                    ? 'bg-white/12 text-white'
                    : 'text-white/75 hover:bg-white/[0.07] hover:text-white'
                "
              >
                <span class="font-medium">{{ option.label }}</span>
                @if (option.hint) {
                  <span class="shrink-0 text-xs text-white/45">{{ option.hint }}</span>
                }
              </button>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class GlassDropdownComponent implements ControlValueAccessor {
  @Input() options: DropdownOption[] = [];
  @Input() placeholder = 'Select an option';

  @ViewChild('triggerBtn') triggerBtnRef?: ElementRef<HTMLButtonElement>;

  private readonly host = inject(ElementRef<HTMLElement>);

  readonly isOpen = signal(false);
  readonly value = signal<string>('');
  readonly disabled = signal(false);
  readonly menuCoords = signal<MenuCoords>({
    top: 0,
    bottom: null,
    left: 0,
    minWidth: 200,
    maxHeight: 260,
  });

  private onChange: (val: string) => void = () => {};
  private onTouched: () => void = () => {};

  selectedOption(): DropdownOption | undefined {
    return this.options.find((o) => o.value === this.value());
  }

  toggle(): void {
    if (this.disabled()) return;
    if (!this.isOpen()) {
      this.updateMenuPosition();
      this.isOpen.set(true);
    } else {
      this.isOpen.set(false);
    }
  }

  selectOption(option: DropdownOption): void {
    this.value.set(option.value);
    this.onChange(option.value);
    this.onTouched();
    this.isOpen.set(false);
  }

  writeValue(val: string | null): void {
    this.value.set(val ?? '');
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen() && !this.host.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
    }
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onViewportChange(): void {
    if (this.isOpen()) {
      this.updateMenuPosition();
    }
  }

  private updateMenuPosition(): void {
    const btn = this.triggerBtnRef?.nativeElement;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const gap = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const spaceBelow = vh - rect.bottom - 12;
    const spaceAbove = rect.top - 12;
    const estimatedMenuWidth = Math.max(rect.width, 230);
    const clampedLeft = Math.max(12, Math.min(rect.left, vw - estimatedMenuWidth - 12));

    if (spaceBelow < 210 && spaceAbove > spaceBelow) {
      this.menuCoords.set({
        top: null,
        bottom: vh - rect.top + gap,
        left: clampedLeft,
        minWidth: rect.width,
        maxHeight: Math.min(264, Math.max(140, spaceAbove)),
      });
    } else {
      this.menuCoords.set({
        top: rect.bottom + gap,
        bottom: null,
        left: clampedLeft,
        minWidth: rect.width,
        maxHeight: Math.min(264, Math.max(140, spaceBelow)),
      });
    }
  }
}
