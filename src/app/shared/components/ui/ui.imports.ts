import {
  ZardButtonGroupComponent,
  ZardButtonGroupDividerComponent,
  ZardButtonGroupTextDirective
} from './button-group';
import {
  ZardButtonComponent
} from './button';
import { ZardIconComponent } from './icon';
import { ZardCardComponent } from './card';
import { LayoutImports } from './layout';
import { ZardDividerComponent } from './divider';
import {
  ZardPaginationButtonComponent,
  ZardPaginationComponent,
  ZardPaginationContentComponent,
  ZardPaginationEllipsisComponent,
  ZardPaginationItemComponent,
  ZardPaginationNextComponent,
  ZardPaginationPreviousComponent,
} from '@/shared/components/ui/pagination/pagination.component';
import { ZardInputDirective } from './input';
import { ZardFormImports } from './form/form.imports';

export const SHARED_UI_IMPORTS = [
  // Base UI
  ZardDividerComponent,
  ZardCardComponent,
  ZardButtonComponent,
  ZardIconComponent,

  // Input
  ZardInputDirective,

  // Form
  ...ZardFormImports,

  // Button group
  ZardButtonGroupComponent,
  ZardButtonGroupDividerComponent,
  ZardButtonGroupTextDirective,

  // Pagination
  ZardPaginationComponent,
  ZardPaginationContentComponent,
  ZardPaginationItemComponent,
  ZardPaginationButtonComponent,
  ZardPaginationPreviousComponent,
  ZardPaginationNextComponent,
  ZardPaginationEllipsisComponent,

  // Layout
  ...LayoutImports,
] as const;