import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { animate } from 'motion';

export interface UiSelectOption {
  value: string;
  label: string;
  hint?: string;
}

@Component({
  selector: 'app-ui-select',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiSelectComponent),
      multi: true,
    },
  ],
  template: `
    <div class="relative" #rootContainer>
      <button
        type="button"
        [id]="inputId"
        [disabled]="disabled"
        (click)="toggleOpen()"
        (keydown)="onTriggerKeydown($event)"
        [attr.aria-expanded]="isOpen()"
        aria-haspopup="listbox"
        [attr.aria-controls]="listboxId"
        class="w-full min-h-[46px] px-4 py-3 bg-[#121212] border rounded-lg text-sm text-left flex items-center justify-between gap-3 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C8A97E] disabled:opacity-50 disabled:cursor-not-allowed"
        [ngClass]="
          isOpen()
            ? 'border-[#C8A97E] text-white'
            : 'border-white/10 text-white hover:border-white/25'
        "
      >
        <span class="truncate" [ngClass]="selectedOption ? 'text-white' : 'text-neutral-500'">
          {{ selectedOption ? selectedOption.label : placeholder }}
        </span>

        <svg
          class="w-4 h-4 text-[#C8A97E] shrink-0 transition-transform duration-200"
          [ngClass]="isOpen() ? 'rotate-180' : 'rotate-0'"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      @if (isOpen()) {
        <div
          #dropdownPanel
          [id]="listboxId"
          role="listbox"
          [attr.aria-labelledby]="inputId"
          class="absolute z-30 mt-2 w-full bg-[#111111] border border-white/15 rounded-xl shadow-2xl overflow-hidden"
        >
          @if (searchable && options.length > 4) {
            <div class="p-2 border-b border-white/10">
              <input
                type="text"
                [value]="searchQuery()"
                (input)="onSearchInput($event)"
                (keydown)="onListKeydown($event)"
                placeholder="Filter options..."
                aria-label="Filter dropdown options"
                class="w-full px-3 py-2 bg-[#181818] border border-white/10 rounded-lg text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#C8A97E]"
              />
            </div>
          }

          <div class="max-h-60 overflow-y-auto custom-scroll py-1.5">
            @for (opt of filteredOptions; track opt.value; let idx = $index) {
              <button
                type="button"
                role="option"
                [attr.aria-selected]="opt.value === value()"
                (click)="chooseOption(opt.value)"
                (mouseenter)="highlightedIndex.set(idx)"
                class="w-full px-4 py-2.5 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer"
                [ngClass]="
                  opt.value === value()
                    ? 'bg-[#C8A97E]/15 text-[#C8A97E]'
                    : highlightedIndex() === idx
                      ? 'bg-white/5 text-white'
                      : 'text-neutral-200 hover:bg-white/5'
                "
              >
                <div class="min-w-0">
                  <span class="block text-sm truncate">{{ opt.label }}</span>
                  @if (opt.hint) {
                    <span class="block text-xs text-neutral-400 truncate mt-0.5">
                      {{ opt.hint }}
                    </span>
                  }
                </div>

                @if (opt.value === value()) {
                  <span class="text-[#C8A97E] text-xs font-semibold shrink-0" aria-hidden="true">
                    ✓
                  </span>
                }
              </button>
            } @empty {
              <p class="px-4 py-3 text-xs text-neutral-400">No matching options.</p>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class UiSelectComponent implements ControlValueAccessor {
  private readonly hostRef = inject(ElementRef<HTMLElement>);

  @Input() options: UiSelectOption[] = [];
  @Input() placeholder = 'Select an option';
  @Input() inputId = `ui-select-${Math.random().toString(36).slice(2, 8)}`;
  @Input() searchable = false;
  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('dropdownPanel') set dropdownPanelRef(el: ElementRef<HTMLElement> | undefined) {
    if (el) {
      this.animatePanelIn(el.nativeElement);
    }
  }

  readonly isOpen = signal(false);
  readonly value = signal<string>('');
  readonly searchQuery = signal<string>('');
  readonly highlightedIndex = signal<number>(0);
  disabled = false;

  private onChange: (val: string) => void = () => {};
  private onTouched: () => void = () => {};

  get listboxId(): string {
    return `${this.inputId}-listbox`;
  }

  get selectedOption(): UiSelectOption | undefined {
    return this.options.find((o) => o.value === this.value());
  }

  get filteredOptions(): UiSelectOption[] {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return this.options;
    return this.options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.hint ? o.hint.toLowerCase().includes(q) : false),
    );
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) return;
    if (!this.hostRef.nativeElement.contains(event.target as Node)) {
      this.closeDropdown();
    }
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
    this.disabled = isDisabled;
  }

  toggleOpen(): void {
    if (this.disabled) return;
    if (this.isOpen()) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown(): void {
    this.searchQuery.set('');
    const currentIdx = this.options.findIndex((o) => o.value === this.value());
    this.highlightedIndex.set(currentIdx >= 0 ? currentIdx : 0);
    this.isOpen.set(true);
  }

  closeDropdown(): void {
    this.isOpen.set(false);
    this.onTouched();
  }

  chooseOption(val: string): void {
    this.value.set(val);
    this.onChange(val);
    this.valueChange.emit(val);
    this.closeDropdown();
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
    this.highlightedIndex.set(0);
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (this.disabled) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
      if (!this.isOpen()) {
        event.preventDefault();
        this.openDropdown();
        return;
      }
    }
    if (this.isOpen()) {
      this.onListKeydown(event);
    }
  }

  onListKeydown(event: KeyboardEvent): void {
    const items = this.filteredOptions;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeDropdown();
      return;
    }
    if (items.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.highlightedIndex.update((i) => (i + 1) % items.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.highlightedIndex.update((i) => (i - 1 + items.length) % items.length);
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.highlightedIndex.set(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      this.highlightedIndex.set(items.length - 1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const target = items[this.highlightedIndex()];
      if (target) {
        this.chooseOption(target.value);
      }
    }
  }

  private animatePanelIn(el: HTMLElement): void {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    animate(
      el,
      {
        opacity: [0, 1],
        transform: ['translateY(-6px) scale(0.985)', 'translateY(0px) scale(1)'],
      },
      { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
    );
  }
}
