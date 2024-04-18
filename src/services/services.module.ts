// service.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { Service, ServiceSchema } from 'src/schemas/services.schema';
import { Client, ClientSchema } from 'src/schemas/clients.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema },{ name: Client.name, schema: ClientSchema },])
  ],
  controllers: [ServicesController],
  providers: [ServicesService]
})
export class ServicesModule {}
