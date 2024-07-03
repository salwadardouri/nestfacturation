import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Echeance } from './echeance.schema';
import {Facture } from './facture.schema'; 

export type PaiementDocument = Paiement & mongoose.Document;

@Schema({ timestamps: true })
export class Paiement {
  @Prop({ type: String, default: 'Unpaid' }) 
  etatpaiement: string;

  @Prop({ type: Number, default: null }) 
  montantPaye: number;
 
  @Prop({ type: String })
  typepaiement: string;

  @Prop({ type: Date, default: Date.now })
  datepaiement: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Facture' }] })
  factures: mongoose.Schema.Types.ObjectId[];
  
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Echeance' }] })
  echeances: Echeance[]; 
  
}

export const PaiementSchema = SchemaFactory.createForClass(Paiement);