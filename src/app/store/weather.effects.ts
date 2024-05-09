import { inject, Injectable } from '@angular/core';
import { WeatherService } from '../weather.service';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { LocationService } from '../location.service';
import { catchError, exhaustMap, map, take, tap } from 'rxjs/operators';
import { addLocation, addLocationConditions, removeLocation, removeLocationConditions, setLocationsConditions } from './weather.actions';
import { EMPTY } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectConditions } from './weather.selectors';
import { concatLatestFrom } from '@ngrx/operators';

@Injectable()
export class WeatherEffects {

  private store: Store = inject(Store);
  private actions$: Actions = inject(Actions);
  private locationService: LocationService = inject(LocationService);
  private weatherService: WeatherService = inject(WeatherService);

  initEffect$ = createEffect(() => this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    map(() => this.locationService.getConditions()),
    map(conditions => setLocationsConditions({ conditions }))
  ));

  addLocationEffect$ = createEffect(() => this.actions$.pipe(
    ofType(addLocation),
    exhaustMap(({ zipCode }) => this.weatherService.getLocationConditions(zipCode).pipe(
      map(currentConditions => addLocationConditions({ conditions: { zip: zipCode, data: currentConditions } })),
      catchError(() => EMPTY)
    ))
  ));

  removeLocationEffect$ = createEffect(() => this.actions$.pipe(
    ofType(removeLocation),
    map(({ zipCode }) => removeLocationConditions({ zipCode }))
  ));

  addLocationConditionsEffect$ = createEffect(() => this.actions$.pipe(
    ofType(addLocationConditions, removeLocationConditions),
    concatLatestFrom(() => this.store.select(selectConditions).pipe(
      take(1)
    )),
    tap(([, conditions]) => this.locationService.setConditions(conditions))
  ),{ dispatch: false });

}
