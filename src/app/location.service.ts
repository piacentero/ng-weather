import { Injectable } from '@angular/core';
import { ConditionsAndZip } from './conditions-and-zip.type';

export const CONDITIONS: string = 'conditions';

@Injectable()
export class LocationService {

  getConditions(): ConditionsAndZip[] {
    const condString: string = localStorage.getItem(CONDITIONS);
    return !!condString ? JSON.parse(condString) : [];
  }

  setConditions(conditions: ConditionsAndZip[]): void {
    localStorage.setItem(CONDITIONS, JSON.stringify(conditions));
  }
}
