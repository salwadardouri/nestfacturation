import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FactureService } from './facture.service';
import { FactureController } from './facture.controller';
import { Service, ServiceSchema } from 'src/schemas/services.schema';
import { Client, ClientSchema } from 'src/schemas/clients.schema';
import { Tva, TvaSchema } from 'src/schemas/tva.schema';
import { Timbre, TimbreSchema } from 'src/schemas/timbre.schema';
import { Facture, FactureSchema } from 'src/schemas/facture.schema'; // Add this import
import { Paiement, PaiementSchema } from 'src/schemas/paiement.schema';
import { Parametre, ParametreSchema } from 'src/schemas/parametre.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Service.name, schema: ServiceSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Tva.name, schema: TvaSchema },
      { name: Timbre.name, schema: TimbreSchema },
      { name: Paiement.name, schema: PaiementSchema }, 
      { name: Parametre.name, schema: ParametreSchema }, 
      { name: Facture.name, schema: FactureSchema }, 
    ])
  ],
  providers: [FactureService],
  controllers: [FactureController]
})
export class FactureModule {}
