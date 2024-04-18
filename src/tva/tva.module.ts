import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tva, TvaSchema } from 'src/schemas/tva.schema';
import { TvaService } from './tva.service';
import { TvaController } from './tva.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tva.name, schema: TvaSchema }])],
  providers: [TvaService],
  controllers: [TvaController],
})
export class TvaModule {}
