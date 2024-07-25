import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { TimeSeriesData } from 'src/common/types/location';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get(':location/timeseries')
  getLocationTimeSeries(@Param('location') location: string): TimeSeriesData[] {
    try {
      return this.locationsService.getLocationTimeSeries(location);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Internal Server Error');
    }
  }
}
