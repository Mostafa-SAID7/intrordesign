import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-section-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [ngClass]="
        description
          ? 'flex flex-col md:flex-row md:items-end justify-between gap-6'
          : 'max-w-2xl'
      "
    >
      <div class="max-w-2xl">
        @if (kicker) {
          <p class="text-xs text-[#C8A97E] mb-3">{{ kicker }}</p>
        }
        <h2
          class="font-serif text-3xl md:text-5xl font-medium text-white tracking-tight [text-wrap:balance]"
        >
          {{ title }}
        </h2>
      </div>
      @if (description) {
        <p class="text-sm text-neutral-400 max-w-md leading-relaxed">
          {{ description }}
        </p>
      }
    </div>
  `,
})
export class UiSectionHeaderComponent {
  @Input() kicker = '';
  @Input({ required: true }) title!: string;
  @Input() description?: string;
}
