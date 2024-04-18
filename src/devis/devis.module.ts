import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DevisController } from './devis.controller';
import { DevisService } from './devis.service';
import { Devis, DevisSchema } from 'src/schemas/devis.schema';
import { Client, ClientSchema } from 'src/schemas/clients.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Devis.name, schema: DevisSchema },
      { name: Client.name, schema: ClientSchema },
    ]),
  ],
  controllers: [DevisController],
  providers: [DevisService],
})
export class DevisModule {}
