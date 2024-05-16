import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Timbre, TimbreSchema } from 'src/schemas/timbre.schema';
import { TimbreService } from './timbre.service';
import { TimbreController } from './timbre.controller';
import {Devise, DeviseSchema } from 'src/schemas/devise.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Timbre', schema: TimbreSchema }]),
    MongooseModule.forFeature([{ name: 'Devise', schema: DeviseSchema }]),
  ],
  providers: [TimbreService],
  controllers: [TimbreController],
})
export class TimbreModule {}
