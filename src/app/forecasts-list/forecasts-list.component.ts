import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Forecast } from './forecast.type';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectForecasts } from '../store/weather.selectors';
import { map } from 'rxjs/operators';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css']
})
export class ForecastsListComponent implements OnInit {

  forecast$: Observable<Forecast>;

  private route: ActivatedRoute = inject(ActivatedRoute);
  private store: Store = inject(Store);
  private weatherService: WeatherService = inject(WeatherService);

  ngOnInit(): void {
    this.forecast$ = this.store.select(selectForecasts).pipe(
      map(forecasts => forecasts.find(({ zip }) => zip === this.route.snapshot.paramMap.get('zipcode'))),
      map(({ data }) => data)
    );
  }

  getWeatherIcon(id: number): string {
    return this.weatherService.getWeatherIcon(id);
  }
}
