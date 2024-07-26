import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private apiUrl = 'http://localhost:3000/locations';

  constructor(private http: HttpClient) {}

  getLocations(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching locations', error);
        return of([]);
      })
    );
  }
}
