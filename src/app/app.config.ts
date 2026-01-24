import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

import {
  SocialLoginModule,
  GoogleLoginProvider
} from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),

    // ✅ BẮT BUỘC – nếu thiếu sẽ crash
    importProvidersFrom(SocialLoginModule),

    // ✅ Config phải dùng string token
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '928084972512-3n247c94j8l4ij2omh2s5ngigvn3gr04.apps.googleusercontent.com'
            )
          }
        ]
      }
    }
  ]
};
