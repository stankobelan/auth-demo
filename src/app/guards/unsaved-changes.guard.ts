import { CanDeactivateFn } from '@angular/router';
import {Observable, of} from "rxjs";

export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component: CanComponentDeactivate
): boolean | Observable<boolean> => {
  if (component.canDeactivate) {
    return component.canDeactivate();
  }
  // Example with a confirmation dialog
  return of(window.confirm('You have unsaved changes. Do you really want to leave?'));
};
