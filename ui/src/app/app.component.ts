import {Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {LocationService} from './services/location.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Weather Dashboard';
  locations$: Observable<string[]> = of([]);
  selectedLocation: string = '';

  constructor(private locationService: LocationService) {
  }

  ngOnInit() {
    this.locations$ = this.locationService.getLocations();
  }

  onLocationChange(location: string): void {
    this.selectedLocation = location;
  }
}
