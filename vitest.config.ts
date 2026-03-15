import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        'src/app/core/services/api.service.ts',
        'src/app/features/auth/services/google-auth.service.ts',
        'src/app/features/order/components/order-create/**',
        'src/app/features/order/components/order-payment/**',
        'src/app/features/profile/components/profile/**',
        'src/app/features/staff/component/staff-form/**',
        'src/app/shared/components/button/**',
        'src/app/shared/components/combobox/**',
        'src/app/shared/components/command/**',
        'src/app/shared/components/confirm-dialog/**',
        'src/app/shared/components/empty/**',
        'src/app/shared/components/icon/**',
        'src/app/shared/components/input/**',
        'src/app/shared/components/input-group/**',
        'src/app/shared/components/loader/**',
        'src/app/shared/components/popover/**',
        'src/app/shared/components/select/**',
        'src/app/shared/components/table/**',
        'src/app/shared/components/ui/button-group/**',
        'src/app/shared/components/ui/layout/**',
        'src/app/shared/components/ui/pagination/**',
        'src/app/shared/core/directives/string-template-outlet/**',
        'src/app/shared/core/provider/**',
        'src/app/shared/core/provider/event-manager-plugins/**'
      ]
    }
  }
});
