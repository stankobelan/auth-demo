import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {AuthInterceptor} from "./interceptors/auth.interceptor";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {ErrorInterceptor} from "./interceptors/error.Interceptor";
import {TimingInterceptor} from "./interceptors/timing.interceptor";
import {CachingInterceptor} from "./interceptors/caching.Interceptor";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


export const appConfig: ApplicationConfig = {
  providers: [ provideZoneChangeDetection(),
    provideHttpClient(withInterceptors([AuthInterceptor,TimingInterceptor,CachingInterceptor ,ErrorInterceptor])),
    provideRouter(routes),
  importProvidersFrom(BrowserAnimationsModule)
]
};
