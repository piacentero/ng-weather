import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WeatherState } from './weather.reducer';

const selectState = createFeatureSelector<WeatherState>('weather');

export const selectConditions = createSelector(
  selectState,
  state => state.conditions
);

export const selectForecasts = createSelector(
  selectState,
  state => state.forecasts
);

export const selectLocationData = createSelector(
  selectConditions,
  selectForecasts,
  (conditions, forecasts) => ({ conditions, forecasts })
);
