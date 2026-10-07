import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Hoagie, HoagieSchema } from './entities/hoagies.entity';
import { HoagiesController } from './hoagies.controller';
import { HoagieRepository } from './hoagies.repository';
import { HoagieService } from './hoagies.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hoagie.name, schema: HoagieSchema }]),
  ],
  controllers: [HoagiesController],
  providers: [HoagieService, HoagieRepository],
  exports: [HoagieService],
})
export class HoagiesModule {}
