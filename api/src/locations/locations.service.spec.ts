import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LocationsRepository } from './locations.repository';
import { LocationsService } from './locations.service';

describe('LocationsService', () => {
  let service: LocationsService;
  let repository: LocationsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: LocationsRepository,
          useValue: {
            findLocationByName: jest.fn(),
            getAllLocations: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
    repository = module.get<LocationsRepository>(LocationsRepository);
  });

  describe('getLocationTimeSeries', () => {
    it('returns time series data for a valid location', () => {
      const mockLocationData = [
        {
          Time: '2022-12-22T20:00:00Z',
          WIND_GUST: 33,
          Warning: 0,
        },
      ];
      jest
        .spyOn(repository, 'findLocationByName')
        .mockReturnValue(mockLocationData);

      const result = service.getLocationTimeSeries('Hollenthon');
      expect(result).toEqual(mockLocationData);
      expect(repository.findLocationByName).toHaveBeenCalledWith('Hollenthon');
    });

    it('throws NotFoundException for an invalid location', () => {
      jest.spyOn(repository, 'findLocationByName').mockReturnValue(null);

      expect(() => service.getLocationTimeSeries('InvalidLocation')).toThrow(
        NotFoundException,
      );
      expect(repository.findLocationByName).toHaveBeenCalledWith(
        'InvalidLocation',
      );
    });
  });

  describe('getAllLocations', () => {
    it('returns all locations', () => {
      const mockLocations = ['Hollenthon', 'AnotherLocation'];
      jest.spyOn(repository, 'getAllLocations').mockReturnValue(mockLocations);

      const result = service.getAllLocations();
      expect(result).toEqual(mockLocations);
      expect(repository.getAllLocations).toHaveBeenCalled();
    });
  });
});
