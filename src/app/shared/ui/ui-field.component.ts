import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      @if (label) {
        <label [attr.for]="forId" class="block text-xs font-medium text-neutral-300 mb-2">
          {{ label }}
        </label>
      }
      <ng-content></ng-content>
      @if (errorText) {
        <p class="mt-1.5 text-xs text-amber-400" role="alert">{{ errorText }}</p>
      } @else if (hint) {
        <p class="mt-1.5 text-xs text-neutral-500">{{ hint }}</p>
      }
    </div>
  `,
})
export class UiFieldComponent {
  @Input() label = '';
  @Input() forId = '';
  @Input() errorText = '';
  @Input() hint = '';
}
