import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WeatherState } from './weather.reducer';

const selectState = createFeatureSelector<WeatherState>('weather');

export const selectConditions = createSelector(
  selectState,
  state => state.conditions
);
