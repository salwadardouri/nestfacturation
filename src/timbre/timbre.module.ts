import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Timbre, TimbreSchema } from 'src/schemas/timbre.schema';
import { TimbreService } from './timbre.service';
import { TimbreController } from './timbre.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Timbre.name, schema: TimbreSchema }])],
  providers: [TimbreService],
  controllers: [TimbreController],
})
export class TimbreModule {}
