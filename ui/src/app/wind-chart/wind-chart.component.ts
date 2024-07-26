import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { TimeSeriesData } from '../domain/location';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'wind-chart',
  templateUrl: './wind-chart.component.html',
  styleUrls: ['./wind-chart.component.scss'],
})
export class WindChartComponent implements OnChanges {
  @Input() locationName: string = '';

  documentStyle: CSSStyleDeclaration | undefined;
  timeSeries$: Observable<ChartData<'line'>> = of({ labels: [], datasets: [] });
  isLoading: boolean = false;
  error: string | null = null;

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
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

  constructor(private locationService: LocationService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['locationName'] && this.locationName) {
      this.loadTimeSeriesData();
    }
  }

  // TODO: refactor with extracting transformation functionality to dedicated service
  private loadTimeSeriesData(): void {
    this.isLoading = true;
    this.locationService
      .getTimeSeries(this.locationName)
      .pipe(
        switchMap((data) => {
          this.isLoading = false;
          this.error = null;
          return of({
            labels: data.map((entry: TimeSeriesData) =>
              this.formatDate(entry.Time)
            ),
            datasets: [
              {
                label: 'Wind Gust',
                data: data.map((entry: TimeSeriesData) => entry.WIND_GUST),
                borderColor: this.documentStyle?.getPropertyValue('--blue-500'),
                tension: 0.4,
                fill: false,
              },
            ],
          });
        }),
        catchError((error) => {
          this.isLoading = false;
          this.error = 'Error fetching data';
          return of({ labels: [], datasets: [] });
        })
      )
      .subscribe((data) => {
        this.timeSeries$ = of(data);
      });
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);

    return date.toLocaleDateString();
  }
}
