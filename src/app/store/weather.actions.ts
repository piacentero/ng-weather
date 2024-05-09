import { createAction, props } from '@ngrx/store';
import { ConditionsAndZip } from '../conditions-and-zip.type';

export const setLocations = createAction(
  '[Weather] Set locations',
  props<{ locations: string[] }>()
);

export const addLocation = createAction(
  '[Weather] Add location',
  props<{ zipCode: string }>()
);

export const addLocationConditions = createAction(
  '[Weather] Add location conditions',
  props<{ conditions: ConditionsAndZip }>()
);

export const removeLocation = createAction(
  '[Weather] Remove location',
  props<{ zipCode: string }>()
);

export const removeLocationConditions = createAction(
  '[Weather] Remove location conditions',
  props<{ zipCode: string }>()
);

export const setLocationsConditions = createAction(
  '[Weather] Set locations conditions',
  props<{ conditions: ConditionsAndZip[] }>()
);
