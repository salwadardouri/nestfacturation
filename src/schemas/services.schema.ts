import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Tva } from './tva.schema'; 
export type ServiceDocument = Service & mongoose.Document;

@Schema()
export class Service {
  @Prop({ type: String })
  reference: string;

  @Prop({ type: String })
  libelle: string;

  @Prop({ type: Number })
  prix_unitaire: number;

  @Prop({ type: Number})
  remise: number;

  @Prop({ type: Number })
  quantite: number;

  @Prop({ type: Number })
  montant_HT: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Devise',
  })
  devise: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categories',
  })
  categories: mongoose.Schema.Types.ObjectId;


  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tva' })
  tva: Tva; 

}

export const ServiceSchema = SchemaFactory.createForClass(Service);
