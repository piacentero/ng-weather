import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { addLocation } from '../store/weather.actions';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {

  private store: Store = inject(Store);

  addLocation(zipCode: string): void {
    this.store.dispatch(addLocation({ zipCode }));
  }

}
