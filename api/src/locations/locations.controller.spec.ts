import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';

describe('LocationsController', () => {
  let controller: LocationsController;
  let service: LocationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationsController],
      providers: [
        {
          provide: LocationsService,
          useValue: {
            getLocationTimeSeries: jest.fn(),
            getAllLocations: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LocationsController>(LocationsController);
    service = module.get<LocationsService>(LocationsService);
  });

  describe('getLocationTimeSeries', () => {
    it('returns time series data for a valid location', () => {
      const mockLocationData = [
        { Time: '2022-12-22T20:00:00Z', WIND_GUST: 33, Warning: 0 },
      ];
      jest
        .spyOn(service, 'getLocationTimeSeries')
        .mockReturnValue(mockLocationData);

      const result = controller.getLocationTimeSeries('Hollenthon');
      expect(result).toEqual(mockLocationData);
      expect(service.getLocationTimeSeries).toHaveBeenCalledWith('Hollenthon');
    });

    it('throws NotFoundException for an invalid location', () => {
      jest.spyOn(service, 'getLocationTimeSeries').mockImplementation(() => {
        throw new NotFoundException();
      });

      expect(() => controller.getLocationTimeSeries('InvalidLocation')).toThrow(
        NotFoundException,
      );
      expect(service.getLocationTimeSeries).toHaveBeenCalledWith(
        'InvalidLocation',
      );
    });

    it('throws an internal server error for unexpected errors', () => {
      jest.spyOn(service, 'getLocationTimeSeries').mockImplementation(() => {
        throw new Error('Unexpected Error');
      });

      expect(() => controller.getLocationTimeSeries('Hollenthon')).toThrow(
        'Internal Server Error',
      );
      expect(service.getLocationTimeSeries).toHaveBeenCalledWith('Hollenthon');
    });
  });

  describe('getAllLocations', () => {
    it('returns all locations', () => {
      const mockLocations = ['Hollenthon', 'AnotherLocation'];
      jest.spyOn(service, 'getAllLocations').mockReturnValue(mockLocations);

      const result = controller.getAllLocations();
      expect(result).toEqual(mockLocations);
      expect(service.getAllLocations).toHaveBeenCalled();
    });
  });
});
