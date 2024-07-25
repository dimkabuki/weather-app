export interface TimeSeriesData {
  Time: string;
  WIND_GUST_ACC: number;
  WIND_GUST: number;
  Warning: number;
  Validity: string;
  Intensity: string | number;
  k_1h?: string;
  k_2h?: string;
  k_3h?: string;
}
