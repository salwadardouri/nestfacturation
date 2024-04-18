// service.schema.ts

import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Tva } from './tva.schema'; // Importez le schéma de la TVA
import { Client } from './clients.schema'; // Importez le schéma du client

export type ServiceDocument = Service & mongoose.Document;

@Schema()
export class Service {



  @Prop()
  reference: string;
  @Prop({ type: String })
  libelle: string;

  @Prop({ type:  Number })
  quantite: number;

  @Prop({ type:  Number })
  prix_unitaire: number;

  @Prop({ type:  Number })
  montant_HT: number;

  // @Prop({ type: String, ref: 'Client' }) // Définissez la relation avec le client
  // clientId: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client' })
  client: Client; // Relation avec la table Client
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tva' }) // Relation avec la table TVA
  tva: Tva;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
