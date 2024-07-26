import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'wind-chart',
  templateUrl: './wind-chart.component.html',
  styleUrl: './wind-chart.component.scss',
})
export class WindChartComponent implements OnInit {
  @Input() locationName: string = '';

  constructor() {}

  ngOnInit(): void {}
}
