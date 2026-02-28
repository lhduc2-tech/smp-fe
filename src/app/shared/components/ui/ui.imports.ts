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
export const SHARED_UI_IMPORTS = [
  ZardDividerComponent,
  ZardCardComponent,
  ZardButtonComponent,
  ZardIconComponent,
  ZardButtonGroupComponent,
  ZardButtonGroupDividerComponent,
  ZardButtonGroupTextDirective,
  ...LayoutImports
] as const;