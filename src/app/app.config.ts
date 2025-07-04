import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/Aura';
import { routes } from './app.routes';
import { NavbarComponent } from './components/navbar/navbar.component';
import { provideHighcharts } from 'highcharts-angular';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideHighcharts({
      // Optional: Define the Highcharts instance dynamically
      instance: () => import('highcharts'),

      // Global chart options applied across all charts
      options: {
        title: {
          style: {
            color: 'tomato'
          }
        },
        legend: {
          enabled: false
        }
      },

      // Include Highcharts additional modules (e.g., exporting, accessibility) or custom themes
      modules: () => {
        return [
          import('highcharts/esm/modules/accessibility'),
          import('highcharts/esm/modules/exporting'),
          import('highcharts/esm/themes/sunset')
        ]
      }
    }),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector:'.my-app-dark'
        }
      }
    }),


  ],

};
