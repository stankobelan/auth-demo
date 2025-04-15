import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, tap, shareReplay } from 'rxjs';

const cache = new Map<string, HttpResponse<unknown>>();

export function CachingInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  // Only cache GET, HEAD, and OPTIONS requests
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next(req);
  }
  console.log('CachingInterceptor ');
  console.dir(req);
  // Generate a unique cache key based on the request URL and parameters
  const cacheKey = generateCacheKey(req);
  console.log(`cacheKey = ${cacheKey}`);

  // Check if request is already in cache
  const cachedResponse = cache.get(cacheKey);
  if (cachedResponse) {
    console.log(`cachedResponse `);
    console.dir(cachedResponse);
    return of(cachedResponse.clone());
  }

  // Send request and add response to cache
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        console.log(`cache.set(${cacheKey}, event.clone())`);
        cache.set(cacheKey, event.clone());
      }
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );
}

function generateCacheKey(req: HttpRequest<any>): string {
  const { urlWithParams, method, headers } = req;
  const headersString = headers.keys().sort().map(key => `${key}:${headers.getAll(key)?.join(',')}`).join('|');
  const keyString = `${method}:${urlWithParams}:${headersString}`;
  return simpleHash(keyString);
}

function simpleHash(input: string): string {
  let hash = 0;
  if (input.length === 0) return hash.toString();
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
}

function evictOldCacheEntries(): void {
  // Implement cache eviction strategy here (e.g., LRU)
  if (cache.size > 50) { // Example limit
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
}

export function clearCache() {
  cache.clear();
}
