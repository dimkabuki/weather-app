import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ChartOptions} from 'chart.js';
import {of} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {LocationService} from '../services/location.service';
import {isWarning} from "../services/chart-utils";

@Component({
  selector: 'wind-chart',
  templateUrl: './wind-chart.component.html',
  styleUrls: ['./wind-chart.component.scss'],
})
export class WindChartComponent implements OnChanges {
  @Input() locationName: string = '';

  timeSeries$: any = of({labels: [], datasets: []});
  isLoading: boolean = false;
  error: string | null = null;

  chartOptions: ChartOptions = {
    responsive: true,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    elements: {
      point: {
        radius: ctx => isWarning(ctx) ? 4 : 3,
        backgroundColor: ctx => isWarning(ctx) ? '#c1cffe' : '#00239C',
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          autoSkipPadding: 16,
          maxRotation: 0,
        },
      },
    },
  };

  constructor(private locationService: LocationService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['locationName'] && this.locationName) {
      this.loadTimeSeriesData();
    }
  }

  private loadTimeSeriesData(): void {
    this.isLoading = true;
    this.locationService
      .getTimeSeries(this.locationName)
      .pipe(
        switchMap(data => {
          this.isLoading = false;
          this.error = null;
          return of(this.locationService.transformTimeSeriesData(data));
        }),
        catchError(error => {
          console.error(error);
          this.isLoading = false;
          this.error = 'Error fetching data';
          return of({labels: [], datasets: []});
        })
      )
      .subscribe(data => {
        this.timeSeries$ = of(data);
      });
  }
}
