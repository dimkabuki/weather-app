import { Injectable, NotFoundException } from '@nestjs/common';
import { TimeSeriesData } from 'src/common/types/location';
import { LocationsRepository } from './locations.repository';

@Injectable()
export class LocationsService {
  constructor(private readonly locationsRepository: LocationsRepository) {}

  getLocationTimeSeries(locationName: string): TimeSeriesData[] {
    const locationData =
      this.locationsRepository.findLocationByName(locationName);
    if (!locationData) {
      throw new NotFoundException('Location not found');
    }
    return locationData;
  }
}
