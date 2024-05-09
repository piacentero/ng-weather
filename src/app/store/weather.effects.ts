import { inject, Injectable } from '@angular/core';
import { WeatherService } from '../weather.service';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { LocationService } from '../location.service';
import { catchError, delay, exhaustMap, map, take, tap } from 'rxjs/operators';
import { addLocation, addLocationData, addLocationsData, refreshLocationData, refreshLocationsData, removeLocation, removeLocationData, setLocationsData } from './weather.actions';
import { EMPTY, iif } from 'rxjs';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { selectLocationData } from './weather.selectors';
import { ConditionsAndZip } from '../conditions-and-zip.type';
import { ForecastAndZip } from '../forecast-and-zip.type';
import { CurrentConditions } from '../current-conditions/current-conditions.type';
import { Forecast } from '../forecasts-list/forecast.type';

export const CONDITIONS: string = 'conditions';
export const FORECAST: string = 'forecast';
export const CACHE_TIME_MS: number = 7200000;

@Injectable()
export class WeatherEffects {

  private store: Store = inject(Store);
  private actions$: Actions = inject(Actions);
  private locationService: LocationService = inject(LocationService);
  private weatherService: WeatherService = inject(WeatherService);

  initEffect$ = createEffect(() => this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    map(() => ({
      conditions: this.locationService.getData<ConditionsAndZip[]>(CONDITIONS),
      forecasts: this.locationService.getData<ForecastAndZip[]>(FORECAST)
    })),
    map(({ conditions, forecasts }) => setLocationsData({ conditions, forecasts }))
  ));

  setLocationsDataEffect$ = createEffect(() => this.actions$.pipe(
    ofType(setLocationsData),
    map(({ conditions }) => refreshLocationsData({ zipCodes: conditions.map(({ zip }) => zip) }))
  ));

  addLocationEffect$ = createEffect(() => this.actions$.pipe(
    ofType(addLocation),
    exhaustMap(({ zipCode }) => this.weatherService.getLocationData(zipCode).pipe(
      map(({ conditions, forecast }) => addLocationData({ zipCode, conditions, forecast })),
      catchError(() => EMPTY)
    ))
  ));

  removeLocationEffect$ = createEffect(() => this.actions$.pipe(
    ofType(removeLocation),
    map(({ zipCode }) => removeLocationData({ zipCode }))
  ));

  addLocationDataEffect$ = createEffect(() => this.actions$.pipe(
    ofType(addLocationData),
    concatLatestFrom(({ zipCode }) => this.store.select(selectLocationData).pipe(
      take(1),
      map(({ conditions: conditionsAndZip, forecasts: forecastAndZip }) => ({ zipCode, conditionsAndZip, forecastAndZip }))
    )),
    tap(([, { conditionsAndZip }]) => this.locationService.storeData<ConditionsAndZip[]>(CONDITIONS, conditionsAndZip)),
    tap(([, { forecastAndZip }]) => this.locationService.storeData<ForecastAndZip[]>(FORECAST, forecastAndZip)),
    map(([, { zipCode }]) => refreshLocationData({ zipCode }))
  ));

  removeLocationDataEffect$ = createEffect(() => this.actions$.pipe(
    ofType(removeLocationData),
    concatLatestFrom(() => this.store.select(selectLocationData).pipe(
      take(1),
    )),
    tap(([, { conditions }]) => this.locationService.storeData<ConditionsAndZip[]>(CONDITIONS, conditions)),
    tap(([, { forecasts }]) => this.locationService.storeData<ForecastAndZip[]>(FORECAST, forecasts))
  ),{ dispatch: false });

  refreshLocationDataEffect$ = createEffect(() => this.actions$.pipe(
    ofType(refreshLocationData),
    delay(CACHE_TIME_MS),
    concatLatestFrom(({ zipCode }) => this.store.select(selectLocationData).pipe(
      take(1),
      map(({ conditions}) => ({
        exists: conditions.some(({ zip }) => zip === zipCode),
        zipCode
      })
    ))),
    exhaustMap(([, { exists, zipCode }]) => iif(
      () => !!exists,
      this.weatherService.getLocationData(zipCode).pipe(
        map(({ conditions, forecast }) => addLocationData({ zipCode, conditions, forecast })),
        catchError(() => EMPTY)
      ),
      EMPTY
    ))
  ));

  refreshLocationsDataEffect$ = createEffect(() => this.actions$.pipe(
    ofType(refreshLocationsData),
    delay(CACHE_TIME_MS),
    concatLatestFrom(({ zipCodes }) => this.store.select(selectLocationData).pipe(
      take(1),
      map(({ conditions}) => ({
        zipCodes: conditions.filter(({ zip }) => zipCodes.includes(zip)).map(({ zip }) => zip)
      })
    ))),
    exhaustMap(([, { zipCodes }]) => this.weatherService.getLocationsData(zipCodes).pipe(
      map(locationsData => {
        const data: { zipCode: string, conditions: CurrentConditions, forecast: Forecast }[] = [];
        zipCodes.forEach(((zipCode, index) => {
          data.push({
            zipCode,
            conditions: locationsData[index].conditions,
            forecast: locationsData[index].forecast
          })
        }));
        return addLocationsData({ data });
      }),
      catchError(() => EMPTY)
    ))
  ));

  addLocationsDataEffect$ = createEffect(() => this.actions$.pipe(
    ofType(addLocationsData),
    concatLatestFrom(({ data }) => this.store.select(selectLocationData).pipe(
      take(1),
      map(({ conditions: conditionsAndZip, forecasts: forecastAndZip }) => ({
        zipCodes: data.map(({ zipCode }) => zipCode),
        conditionsAndZip,
        forecastAndZip
      }))
    )),
    tap(([, { conditionsAndZip }]) => this.locationService.storeData<ConditionsAndZip[]>(CONDITIONS, conditionsAndZip)),
    tap(([, { forecastAndZip }]) => this.locationService.storeData<ForecastAndZip[]>(FORECAST, forecastAndZip)),
    map(([, { zipCodes }]) => refreshLocationsData({ zipCodes }))
  ));

}
