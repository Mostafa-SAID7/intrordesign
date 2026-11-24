import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';

export interface NavItem {
  id: string;
  label: string;
}

@Component({
  selector: 'app-studio-header',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="fixed inset-x-0 top-0 z-40 px-4 pt-3.5 sm:px-6 lg:px-10">
      <div
        class="smoked-slab mx-auto flex max-w-[1320px] items-center justify-between gap-8 rounded-2xl px-5 py-3 sm:px-7"
      >
        <!-- Zone 1: Single-element Brand Wordmark -->
        <a
          href="#top"
          class="inline-flex shrink-0 items-center gap-3 whitespace-nowrap text-base font-semibold tracking-tight text-[#f4f4f6] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b9abff]"
        >
          <span
            class="relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border border-white/65 bg-gradient-to-br from-white/20 to-[#b9abff]/15"
            aria-hidden="true"
          >
            <span class="h-[1px] w-3 -rotate-45 bg-white/70"></span>
          </span>
          <span class="font-display text-xl font-semibold tracking-tight">Coastal Estates</span>
        </a>

        <!-- Zone 2: Concise single-line nav links -->
        <nav class="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          @for (item of navItems; track item.id) {
            <a
              [href]="'#' + item.id"
              class="group relative shrink-0 whitespace-nowrap text-[13.5px] font-medium text-white/65 transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b9abff]"
            >
              {{ item.label }}
              <span
                class="absolute -bottom-1 left-0 h-[1px] w-0 bg-[#b9abff] transition-all duration-200 ease-out group-hover:w-full"
              ></span>
            </a>
          }
          <button
            type="button"
            (click)="savedClick.emit()"
            class="shrink-0 whitespace-nowrap text-[13.5px] font-medium text-white/65 transition-colors duration-150 hover:text-[#b9abff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b9abff]"
          >
            Saved ({{ savedCount }})
          </button>
        </nav>

        <!-- Zone 3: Single primary CTA -->
        <div class="flex shrink-0 items-center gap-3">
          <button
            type="button"
            (click)="bookClick.emit()"
            class="hidden shrink-0 whitespace-nowrap rounded-lg bg-[#ececf0] px-4 py-2 text-xs font-semibold text-[#09090d] transition-colors duration-150 hover:bg-[#36d67e] hover:text-[#04140a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#36d67e] sm:inline-flex"
          >
            Schedule Viewing
          </button>

          <button
            type="button"
            (click)="mobileMenuOpen.set(!mobileMenuOpen())"
            [attr.aria-expanded]="mobileMenuOpen()"
            aria-label="Toggle navigation menu"
            class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-white/80 transition-colors hover:border-white/30 hover:text-white md:hidden"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              @if (mobileMenuOpen()) {
                <path
                  d="M5 5L15 15M15 5L5 15"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              } @else {
                <path
                  d="M3 6H17M3 10H17M3 14H17"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              }
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Smoked-Glass Drawer -->
      @if (mobileMenuOpen()) {
        <div class="smoked-slab mx-auto mt-2.5 max-w-[1320px] rounded-2xl p-4 md:hidden">
          <nav class="flex flex-col gap-1" aria-label="Mobile navigation">
            @for (item of navItems; track item.id) {
              <a
                [href]="'#' + item.id"
                (click)="mobileMenuOpen.set(false)"
                class="rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                {{ item.label }}
              </a>
            }
            <button
              type="button"
              (click)="mobileMenuOpen.set(false); savedClick.emit()"
              class="rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-[#b9abff] transition-colors hover:bg-white/[0.06]"
            >
              Saved Residences ({{ savedCount }})
            </button>
            <button
              type="button"
              (click)="mobileMenuOpen.set(false); bookClick.emit()"
              class="mt-2 w-full rounded-xl bg-[#ececf0] px-4 py-3 text-sm font-semibold text-[#09090d] transition-colors hover:bg-[#36d67e]"
            >
              Schedule Viewing
            </button>
          </nav>
        </div>
      }
    </header>
  `,
})
export class StudioHeaderComponent {
  @Input({ required: true }) navItems: NavItem[] = [];
  @Input() savedCount = 0;
  @Output() readonly bookClick = new EventEmitter<void>();
  @Output() readonly savedClick = new EventEmitter<void>();

  readonly mobileMenuOpen = signal(false);
}
