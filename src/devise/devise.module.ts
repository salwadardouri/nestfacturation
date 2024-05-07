import { Module } from '@nestjs/common';
import { DeviseService } from './devise.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Devise, DeviseSchema } from 'src/schemas/devise.schema';
import { DeviseController } from './devise.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name:Devise.name, schema: DeviseSchema }])],
  providers: [DeviseService],
  controllers: [DeviseController],
})
export class DeviseModule {}


