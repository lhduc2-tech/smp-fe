import { Component, Input } from '@angular/core';

type IconType = 'edit' | 'delete' | 'add' | 'search' | 'view';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <span class="icon" [class]="'icon-' + type" [attr.title]="title">
      {{ getIcon() }}
    </span>
  `,
  styles: [`
    .icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .icon:hover {
      transform: scale(1.2);
    }

    .icon-edit {
      color: #0066ff;
    }

    .icon-delete {
      color: #dc3545;
    }

    .icon-add {
      color: #28a745;
    }

    .icon-search {
      color: #666;
    }

    .icon-view {
      color: #0066ff;
    }
  `]
})
export class IconComponent {
  @Input() type: IconType = 'edit';
  @Input() title = '';

  getIcon(): string {
    const icons: Record<IconType, string> = {
      edit: '✏️',
      delete: '🗑️',
      add: '➕',
      search: '🔍',
      view: '👁️'
    };
    return icons[this.type] || '';
  }
}
