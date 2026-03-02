import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';import { provideZard } from '@/shared/core/provider/providezard';


import {
  SocialLoginModule,
  GoogleLoginProvider
} from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [
    // Router
    provideRouter(routes),

    // HttpClient + Auth Interceptor
    provideHttpClient(
      withInterceptors([authInterceptor,
    ])
    ),
    provideZard(),
    // Social login module
    importProvidersFrom(SocialLoginModule),

    // Social auth config (string token là đúng)
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
