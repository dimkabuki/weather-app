import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ButtonModule} from 'primeng/button';
import {ChartModule} from 'primeng/chart';
import {DropdownModule} from 'primeng/dropdown';
import {PanelModule} from 'primeng/panel';
import {ToolbarModule} from 'primeng/toolbar';

import {provideHttpClient} from '@angular/common/http';
import {AppComponent} from './app.component';
import {WindChartComponent} from './wind-chart/wind-chart.component';

@NgModule({
  declarations: [AppComponent, WindChartComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ToolbarModule,
    ButtonModule,
    PanelModule,
    DropdownModule,
    ChartModule,
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {
}
