import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean;
  hasUnsavedChanges?(): boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(
    component: CanComponentDeactivate
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (component.hasUnsavedChanges && component.hasUnsavedChanges()) {
      return this.showConfirmationDialog();
    }
    
    if (component.canDeactivate) {
      return component.canDeactivate();
    }
    
    return true;
  }

  private showConfirmationDialog(): boolean {
    const message = '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.';
    return confirm(message);
  }
}