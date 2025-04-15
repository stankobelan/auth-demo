import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';

export const TimingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const started = Date.now();
  return next(req).pipe(
    tap({
      next: (event) => {
        // Do nothing with the event
      },
      error: (error) => {
        // Do nothing with the error here
      },
      complete: () => {
        const elapsed = Date.now() - started;
        console.log(`Request for ${req.url} took ${elapsed} ms.`);
      }
    })
  );
};
