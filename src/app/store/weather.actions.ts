import { createAction, props } from '@ngrx/store';
import { ConditionsAndZip } from '../conditions-and-zip.type';
import { Forecast } from '../forecasts-list/forecast.type';
import { CurrentConditions } from '../current-conditions/current-conditions.type';
import { ForecastAndZip } from '../forecast-and-zip.type';

export const setLocations = createAction(
  '[Weather] Set locations',
  props<{ locations: string[] }>()
);

export const addLocation = createAction(
  '[Weather] Add location',
  props<{ zipCode: string }>()
);

export const addLocationData = createAction(
  '[Weather] Add location data',
  props<{ zipCode: string, conditions: CurrentConditions, forecast: Forecast }>()
);

export const removeLocation = createAction(
  '[Weather] Remove location',
  props<{ zipCode: string }>()
);

export const removeLocationData = createAction(
  '[Weather] Remove location data',
  props<{ zipCode: string }>()
);

export const refreshLocationData = createAction(
  '[Weather] Refresh location data',
  props<{ zipCode: string }>()
);

export const setLocationsData = createAction(
  '[Weather] Set locations data',
  props<{ conditions: ConditionsAndZip[], forecasts: ForecastAndZip[] }>()
);

export const addLocationsData = createAction(
  '[Weather] Add locations data',
  props<{ data: { zipCode: string, conditions: CurrentConditions, forecast: Forecast }[] }>()
);

export const refreshLocationsData = createAction(
  '[Weather] Refresh locations data',
  props<{ zipCodes: string[] }>()
);
