import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Client } from './clients.schema';

export type DevisDocument = Devis & mongoose.Document;

@Schema()
export class Devis {
  @Prop({ type: String })
  Date_Envoi: string;

  @Prop({ type: Number })
  Total_HT: number;

  @Prop({ type: Number })
  Total_TVA: number;

  @Prop({ type: Number })
  Total_TTC: number;

  @Prop({ type: Boolean })
  Etat: boolean;

  @Prop({ type: String })
  Echeance_paiement: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client' })
  client: Client; // Relation avec la table Client
}

export const DevisSchema = SchemaFactory.createForClass(Devis);
