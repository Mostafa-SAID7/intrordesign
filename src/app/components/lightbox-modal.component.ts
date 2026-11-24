import { Component, EventEmitter, HostListener, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { PortfolioProject } from '../data/studio.data';

@Component({
  selector: 'app-lightbox-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (project) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/88 backdrop-blur-md p-4 md:p-8"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="project.title"
        (click)="onBackdropClick($event)"
      >
        <div
          class="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto custom-scroll bg-[#0C0C0C] border border-white/10 rounded-xl shadow-2xl"
        >
          <!-- Top Bar inside Modal -->
          <div
            class="sticky top-0 z-20 flex items-center justify-between gap-4 px-6 py-4 bg-[#0C0C0C]/95 backdrop-blur-md border-b border-white/10"
          >
            <div class="flex items-center gap-3 text-xs text-neutral-400 min-w-0">
              <span class="text-[#C8A97E] font-medium truncate">{{ project.category }}</span>
              <span aria-hidden="true">·</span>
              <span class="truncate">{{ project.location }}</span>
              <span aria-hidden="true" class="hidden sm:inline">·</span>
              <span class="hidden sm:inline font-mono tabular-nums">{{ project.year }}</span>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <button
                type="button"
                (click)="prev.emit()"
                aria-label="Previous project"
                class="h-9 px-3 text-xs font-medium text-neutral-300 border border-white/10 rounded-lg hover:border-[#C8A97E]/60 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[#C8A97E] whitespace-nowrap"
              >
                Prev
              </button>
              <button
                type="button"
                (click)="next.emit()"
                aria-label="Next project"
                class="h-9 px-3 text-xs font-medium text-neutral-300 border border-white/10 rounded-lg hover:border-[#C8A97E]/60 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[#C8A97E] whitespace-nowrap"
              >
                Next
              </button>
              <button
                type="button"
                (click)="close.emit()"
                aria-label="Close project detail"
                class="h-9 w-9 inline-flex items-center justify-center text-neutral-300 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[#C8A97E]"
              >
                <span aria-hidden="true" class="text-base leading-none">✕</span>
              </button>
            </div>
          </div>

          <!-- Media + Details -->
          <div class="grid grid-cols-1 lg:grid-cols-12">
            <div class="lg:col-span-7 bg-[#121212] relative min-h-[260px] lg:min-h-[440px]">
              @if (!imageFailed) {
                <img
                  [src]="project.image"
                  [alt]="project.title"
                  referrerPolicy="no-referrer"
                  (error)="imageFailed = true"
                  class="w-full h-full object-cover"
                />
              } @else {
                <div
                  class="w-full h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#161412] via-[#0e0d0b] to-[#1a1612]"
                >
                  <span class="font-serif text-2xl text-[#C8A97E]">{{ project.title }}</span>
                  <span class="text-xs text-neutral-400 mt-2">{{ project.location }}</span>
                </div>
              }
            </div>

            <div class="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between gap-6">
              <div class="space-y-5">
                <div>
                  <h3 class="font-serif text-3xl text-white tracking-tight">
                    {{ project.title }}
                  </h3>
                  <p class="text-sm text-neutral-400 mt-3 leading-relaxed">
                    {{ project.architecturalBrief }}
                  </p>
                </div>

                <!-- Specs Table -->
                <div class="border-t border-white/10 pt-4 space-y-3 text-sm">
                  <div class="flex items-center justify-between gap-4">
                    <span class="text-neutral-400">Floor Area</span>
                    <span class="text-white font-mono tabular-nums">{{ project.areaSqFt }}</span>
                  </div>
                  <div class="flex items-center justify-between gap-4">
                    <span class="text-neutral-400">Commission Timeline</span>
                    <span class="text-white font-mono tabular-nums">{{ project.duration }}</span>
                  </div>
                  <div class="flex items-center justify-between gap-4">
                    <span class="text-neutral-400">Completed</span>
                    <span class="text-white font-mono tabular-nums">{{ project.year }}</span>
                  </div>
                </div>

                <!-- Materials -->
                <div class="border-t border-white/10 pt-4">
                  <p class="text-xs font-medium text-neutral-400 mb-2">Primary Materiality</p>
                  <p class="text-sm text-neutral-200 leading-relaxed">
                    {{ project.materialsUsed.join(' · ') }}
                  </p>
                </div>
              </div>

              <div class="pt-4 border-t border-white/10">
                <a
                  href="#contact"
                  (click)="inquire.emit(project)"
                  class="inline-flex w-full items-center justify-center px-5 py-3 bg-[#C8A97E] text-[#050505] text-sm font-semibold rounded-lg hover:bg-[#d8bc93] transition-colors whitespace-nowrap"
                >
                  Inquire About a Similar Commission
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class LightboxModalComponent implements OnChanges {
  @Input() project: PortfolioProject | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() inquire = new EventEmitter<PortfolioProject>();

  imageFailed = false;

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (!this.project) return;
    if (event.key === 'Escape') {
      this.close.emit();
    } else if (event.key === 'ArrowRight') {
      this.next.emit();
    } else if (event.key === 'ArrowLeft') {
      this.prev.emit();
    }
  }

  ngOnChanges(): void {
    this.imageFailed = false;
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
