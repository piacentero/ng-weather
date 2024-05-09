import { createReducer, on } from '@ngrx/store';
import { addLocationConditions, removeLocationConditions, setLocations, setLocationsConditions } from './weather.actions';
import { ConditionsAndZip } from '../conditions-and-zip.type';

export interface WeatherState {
  conditions: ConditionsAndZip[];
}

export const initialState: WeatherState = {
  conditions: []
}

export const weatherReducer = createReducer(
  initialState,
  on(setLocationsConditions, (state, { conditions }) => ({
    ...state,
    conditions
  })),
  on(setLocations, (state, { locations }) => ({
    ...state,
    locations
  })),
  on(addLocationConditions, (state, { conditions }) => ({
    ...state,
    conditions: [...state.conditions, conditions]
  })),
  on(removeLocationConditions, (state, { zipCode }) => ({
    ...state,
    conditions: [...state.conditions].filter(({ zip }) => zip !== zipCode)
  }))
);
