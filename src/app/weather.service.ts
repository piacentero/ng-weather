import { Injectable, Signal, signal } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { CurrentConditions } from './current-conditions/current-conditions.type';
import { ConditionsAndZip } from './conditions-and-zip.type';
import { Forecast } from './forecasts-list/forecast.type';
import { map } from 'rxjs/operators';
import { LocationData } from './location-data.type';

@Injectable()
export class WeatherService {

  static URL = 'http://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditions = signal<ConditionsAndZip[]>([]);

  constructor(private http: HttpClient) { }

  getLocationConditions(zipCode: string): Observable<CurrentConditions> {
    return this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipCode},us&units=imperial&APPID=${WeatherService.APPID}`);
  }

  getForecast(zipCode: string): Observable<Forecast> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipCode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`);
  }

  getLocationData(zipCode: string): Observable<LocationData> {
    return forkJoin([this.getLocationConditions(zipCode), this.getForecast(zipCode)]).pipe(
      map(([conditions, forecast]) => ({ conditions, forecast }))
    );
  }

  getLocationsData(zipCode: string[]) {
    const locationsData$: Observable<LocationData>[] = [];
    zipCode.forEach(zipCode => locationsData$.push(this.getLocationData(zipCode)));
    return forkJoin([...locationsData$]);
  }

  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else
      return WeatherService.ICON_URL + "art_clear.png";
  }

}
