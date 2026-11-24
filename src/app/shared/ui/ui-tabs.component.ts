import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate } from 'motion';

export interface UiTabOption<T extends string = string> {
  value: T;
  label: string;
  count?: number;
}

@Component({
  selector: 'app-ui-tabs',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #tabListEl
      role="tablist"
      [attr.aria-label]="ariaLabel"
      class="relative inline-flex flex-wrap items-center gap-1 p-1 bg-[#111111] border border-white/10 rounded-lg"
    >
      <!-- Sliding Motion Active Indicator -->
      <span
        #indicatorEl
        aria-hidden="true"
        class="pointer-events-none absolute top-1 left-0 h-[calc(100%-8px)] rounded-md bg-[#C8A97E] shadow-sm opacity-0"
      ></span>

      @for (tab of options; track tab.value) {
        <button
          #tabButton
          type="button"
          role="tab"
          [attr.aria-selected]="activeValue === tab.value"
          (click)="selectTab(tab.value)"
          class="relative z-10 px-3.5 py-2 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C8A97E]"
          [ngClass]="
            activeValue === tab.value
              ? 'text-[#050505]'
              : 'text-neutral-300 hover:text-white'
          "
        >
          <span>{{ tab.label }}</span>
          @if (tab.count !== undefined) {
            <span
              class="ml-1.5 font-mono text-[11px] tabular-nums"
              [ngClass]="activeValue === tab.value ? 'text-[#050505]/75' : 'text-neutral-500'"
            >
              {{ tab.count }}
            </span>
          }
        </button>
      }
    </div>
  `,
})
export class UiTabsComponent<T extends string = string> implements AfterViewInit, OnChanges {
  @Input({ required: true }) options!: UiTabOption<T>[];
  @Input({ required: true }) activeValue!: T;
  @Input() ariaLabel = 'Filter options';
  @Output() valueChange = new EventEmitter<T>();

  @ViewChild('tabListEl') tabListEl?: ElementRef<HTMLElement>;
  @ViewChild('indicatorEl') indicatorEl?: ElementRef<HTMLElement>;
  @ViewChildren('tabButton') tabButtons?: QueryList<ElementRef<HTMLButtonElement>>;

  private initialized = false;

  ngAfterViewInit(): void {
    this.initialized = true;
    queueMicrotask(() => this.moveIndicator(false));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.initialized && (changes['activeValue'] || changes['options'])) {
      queueMicrotask(() => this.moveIndicator(true));
    }
  }

  selectTab(value: T): void {
    if (value !== this.activeValue) {
      this.valueChange.emit(value);
    }
  }

  private moveIndicator(animated: boolean): void {
    const indicator = this.indicatorEl?.nativeElement;
    const buttons = this.tabButtons?.toArray();
    if (!indicator || !buttons || buttons.length === 0) return;

    const activeIdx = this.options.findIndex((o) => o.value === this.activeValue);
    const activeBtn = buttons[activeIdx]?.nativeElement;
    if (!activeBtn) return;

    const left = activeBtn.offsetLeft;
    const top = activeBtn.offsetTop;
    const width = activeBtn.offsetWidth;
    const height = activeBtn.offsetHeight;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    indicator.style.top = `${top}px`;
    indicator.style.height = `${height}px`;
    indicator.style.opacity = '1';

    if (!animated || prefersReduced) {
      indicator.style.width = `${width}px`;
      indicator.style.transform = `translate3d(${left}px, 0, 0)`;
      return;
    }

    animate(
      indicator,
      {
        transform: `translate3d(${left}px, 0, 0)`,
        width: `${width}px`,
      },
      {
        type: 'spring',
        stiffness: 380,
        damping: 30,
      },
    );
  }
}
