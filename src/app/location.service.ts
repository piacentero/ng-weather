import { Injectable } from '@angular/core';
import { ConditionsAndZip } from './conditions-and-zip.type';

export const APP_NAME: string = 'ng-weather';

@Injectable()
export class LocationService {

  // getConditions(): ConditionsAndZip[] {
  //   const condString: string = localStorage.getItem(CONDITIONS);
  //   return !!condString ? JSON.parse(condString) : [];
  // }
  //
  // setConditions(conditions: ConditionsAndZip[]): void {
  //   localStorage.setItem(CONDITIONS, JSON.stringify(conditions));
  // }

  getData<T>(key: string): T {
    const value: string = localStorage.getItem(`${APP_NAME}-${key}`);
    return !!value ? JSON.parse(value) : null;
  }

  storeData<T>(key: string, data: T): void {
    localStorage.setItem(`${APP_NAME}-${key}`, JSON.stringify(data));
  }
}
