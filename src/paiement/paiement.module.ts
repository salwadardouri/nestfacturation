import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaiementService } from './paiement.service';
import { PaiementController } from './paiement.controller';
import { Client, ClientSchema } from 'src/schemas/clients.schema';
import { Facture, FactureSchema } from 'src/schemas/facture.schema';
import { Echeance, EcheanceSchema } from 'src/schemas/echeance.schema';
import { Paiement, PaiementSchema  } from 'src/schemas/paiement.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Paiement.name, schema: PaiementSchema },
    ]),
    MongooseModule.forFeature([{ name: Facture.name, schema: FactureSchema }]),
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
    MongooseModule.forFeature([
      { name: Echeance.name, schema: EcheanceSchema },
    ]),
  ],
  controllers: [PaiementController],
  providers: [PaiementService],
})
export class PaiementModule {}