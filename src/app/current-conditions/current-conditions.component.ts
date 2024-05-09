import { Component, inject, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { ConditionsAndZip } from '../conditions-and-zip.type';
import { TabDirective } from '../shared/tabset/tabset.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectConditions } from '../store/weather.selectors';
import { removeLocation } from '../store/weather.actions';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent implements OnInit {

  currentConditionsByZip$: Observable<ConditionsAndZip[]>;

  private weatherService: WeatherService = inject(WeatherService);
  private store: Store = inject(Store);

  ngOnInit(): void {
    this.currentConditionsByZip$ = this.store.select(selectConditions);
  }

  onTabRemove({ content }: TabDirective): void {
    this.store.dispatch(removeLocation({ zipCode: (content as ConditionsAndZip).zip }));
  }

  getWeatherIcon(id: number): string {
    return this.weatherService.getWeatherIcon(id);
  }
}
