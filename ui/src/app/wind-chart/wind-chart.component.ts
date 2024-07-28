import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ChartOptions, ChartTypeRegistry, ScriptableContext} from 'chart.js';
import {of} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {TimeSeriesData} from '../domain/location';
import {LocationService} from '../services/location.service';

const isWarning = (ctx:  ScriptableContext<keyof ChartTypeRegistry>) => {
    const index = ctx.dataIndex;
    const windValue = ctx.chart.data.datasets[0].data[index] || 0;
    const warningValue = ctx.chart.data.datasets[1].data[index] || 0;
    return warningValue > windValue;
}

@Component({
  selector: 'wind-chart',
  templateUrl: './wind-chart.component.html',
  styleUrls: ['./wind-chart.component.scss'],
})
export class WindChartComponent implements OnChanges {
  @Input() locationName: string = '';

  timeSeries$: any = of({ labels: [], datasets: [] });
  isLoading: boolean = false;
  error: string | null = null;

  chartOptions: ChartOptions = {
    responsive: true,
    elements: {
      point: {
        radius: ctx => isWarning(ctx) ? 4 : 3,
        backgroundColor: ctx => isWarning(ctx) ? '#c1cffe' : '#00239C'
      }
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
                type: 'line',
                label: 'Wind Gust',
                data: data.map((entry: TimeSeriesData) => entry.WIND_GUST),
                borderColor: '#006EB6',
                tension: 0.4,
              },
              {
                type: 'bar',
                label: 'Warning',
                backgroundColor: '#642626',
                data: data.map((entry: TimeSeriesData) => entry.Warning),
              },
            ],
          });
        }),
        catchError((error) => {
          console.error(error)
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
