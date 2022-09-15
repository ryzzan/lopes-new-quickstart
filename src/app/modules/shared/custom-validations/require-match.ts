import { AbstractControl } from '@angular/forms';

export function RequireMatch(control: AbstractControl) {
  const selection: any = control.value;

  if (selection !== '' && typeof selection === 'string') {
    return { incorrect: true };
  }
  return null;
}
