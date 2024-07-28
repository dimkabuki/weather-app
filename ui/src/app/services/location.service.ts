import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {TimeSeriesData} from '../domain/location';
import {formatDate} from "./chart-utils";

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private apiUrl = 'http://localhost:3000/locations';

  constructor(private http: HttpClient) {
  }

  getLocations(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching locations', error);
        return of([]);
      })
    );
  }

  getTimeSeries(location: string): Observable<TimeSeriesData[]> {
    return this.http.get<TimeSeriesData[]>(`${this.apiUrl}/${location}/timeseries`)
      .pipe(
        catchError(error => {
          console.error('Error fetching time series data', error);
          return of([]);
        })
      );
  }

  transformTimeSeriesData(data: TimeSeriesData[]): { labels: string[], datasets: any[] } {
    return {
      labels: data.map(entry => formatDate(entry.Time)),
      datasets: [
        {
          type: 'line',
          label: 'Wind Gust',
          data: data.map(entry => entry.WIND_GUST),
          borderColor: '#006EB6',
          tension: 0.4,
        },
        {
          type: 'bar',
          label: 'Warning',
          backgroundColor: '#642626',
          data: data.map(entry => entry.Warning),
        },
      ],
    };
  }
}
