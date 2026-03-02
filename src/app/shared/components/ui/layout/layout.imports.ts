import { ContentComponent } from '@/shared/components/ui/layout/content.component';
import { FooterComponent } from '@/shared/components/ui/layout/footer.component';
import { HeaderComponent } from '@/shared/components/ui/layout/header.component';
import { LayoutComponent } from '@/shared/components/ui/layout/layout.component';
import {
  SidebarComponent,
  SidebarGroupComponent,
  SidebarGroupLabelComponent,
} from '@/shared/components/ui/layout/sidebar.component';

export const LayoutImports = [
  LayoutComponent,
  HeaderComponent,
  FooterComponent,
  ContentComponent,
  SidebarComponent,
  SidebarGroupComponent,
  SidebarGroupLabelComponent,
] as const;
