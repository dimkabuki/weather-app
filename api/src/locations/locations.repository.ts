import { Injectable } from '@nestjs/common';
import { TimeSeriesData } from 'src/common/types/location';
import { locationData } from './data';

@Injectable()
export class LocationsRepository {
  private locations = new Map<string, TimeSeriesData[]>(locationData);

  findLocationByName(locationName: string): TimeSeriesData[] | undefined {
    return this.locations.get(locationName);
  }

  getAllLocations(): string[] {
    return [...this.locations.keys()];
  }
}
