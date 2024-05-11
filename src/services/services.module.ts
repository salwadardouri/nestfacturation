// service.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { Service, ServiceSchema } from 'src/schemas/services.schema';
import { Client, ClientSchema } from 'src/schemas/clients.schema';
import {Tva, TvaSchema } from 'src/schemas/tva.schema';
import {Categories, CategoriesSchema } from 'src/schemas/categories.schema';
import {Devise, DeviseSchema } from 'src/schemas/devise.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Tva.name, schema: TvaSchema },
      { name: Categories.name, schema: CategoriesSchema },
      { name: Devise.name, schema: DeviseSchema },])
  ],
  controllers: [ServicesController],
  providers: [ServicesService]
})
export class ServicesModule {}
