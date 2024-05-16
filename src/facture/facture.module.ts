import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FactureService } from './facture.service';
import { FactureController } from './facture.controller';
import { Service, ServiceSchema } from 'src/schemas/services.schema';
import { Client, ClientSchema } from 'src/schemas/clients.schema';
import { Tva, TvaSchema } from 'src/schemas/tva.schema';
import { Timbre, TimbreSchema } from 'src/schemas/timbre.schema';

import { Facture, FactureSchema } from 'src/schemas/facture.schema'; // Add this import

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Service.name, schema: ServiceSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Tva.name, schema: TvaSchema },
      { name: Timbre.name, schema: TimbreSchema },

      { name: Facture.name, schema: FactureSchema }, 
    ])
  ],
  providers: [FactureService],
  controllers: [FactureController]
})
export class FactureModule {}
