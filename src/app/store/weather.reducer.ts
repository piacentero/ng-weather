import { createReducer, on } from '@ngrx/store';
import { addLocationData, addLocationsData, removeLocationData, setLocationsData } from './weather.actions';
import { ConditionsAndZip } from '../conditions-and-zip.type';
import { ForecastAndZip } from '../forecast-and-zip.type';

export interface WeatherState {
  conditions: ConditionsAndZip[];
  forecasts: ForecastAndZip[];
}

export const initialState: WeatherState = {
  conditions: [],
  forecasts: []
}

export const weatherReducer = createReducer(
  initialState,
  on(setLocationsData, (state, { conditions, forecasts }) => ({
    ...state,
    conditions: conditions || [],
    forecasts: forecasts || []
  })),
  on(addLocationData, (state, { zipCode, conditions, forecast }) => ({
    ...state,
    conditions: !state.conditions.some(({ zip }) => zip === zipCode) ?
      [...state.conditions, { zip: zipCode, data: conditions }] :
      [...state.conditions].map(cond => {
        return cond.zip === zipCode ? { zip: zipCode, data: conditions } : cond;
      }),
    forecasts: !state.forecasts.some(({ zip }) => zip === zipCode) ?
      [...state.forecasts, { zip: zipCode, data: forecast }] :
      [...state.forecasts].map(fore => {
        return fore.zip === zipCode ? { zip: zipCode, data: forecast } : fore;
      }),
  })),
  on(removeLocationData, (state, { zipCode }) => ({
    ...state,
    conditions: [...state.conditions].filter(({ zip }) => zip !== zipCode),
    forecasts: [...state.forecasts].filter(({ zip }) => zip !== zipCode)
  }))
);
