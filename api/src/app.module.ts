import { Module } from '@nestjs/common';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [LocationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
