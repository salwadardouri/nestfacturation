
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Client } from './clients.schema'; 

export type FactureDocument = Facture & mongoose.Document;

@Schema()
export class Facture {
 


  @Prop({ type: String })
  Num_Fact: string;

  @Prop({ type: Date })
  Date_Fact: Date;


  @Prop({ type:  Number })
  quantite: number;


  @Prop({ type:  Number })
  remise: number;


  @Prop({ type:  Number })
  montant_HT: number;

  @Prop({ type:  String })
  unite: string;

  @Prop({ type:  String })
  montant_HT_Lettre: string;

  @Prop({ type:  Number })
  montant_TTC: number;



  // @Prop({ type: String, ref: 'Client' }) // Définissez la relation avec le client
  // clientId: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client' })
  client: Client; 
  @Prop({ type: mongoose.Schema.Types.ObjectId,ref: 'Tva',})
  tva: mongoose.Schema.Types.ObjectId;
  @Prop({ type: mongoose.Schema.Types.ObjectId,ref: 'Timbre',})
  timbre: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,ref: 'Service',})
  service: mongoose.Schema.Types.ObjectId;

}


export const FactureSchema = SchemaFactory.createForClass(Facture);
