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

  @Prop()
  Num_Devis: string;


  @Prop({ type:  Number })
  prix_unitaire: number;
  @Prop({ type:  Number })
  montant_HT: number;
  @Prop({ type:  Number })
  remise: number;

  
  @Prop({
    type: mongoose.Schema.Types.ObjectId,ref: 'Tva',})
  tva: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId,ref: 'Timbre',})
  timbre: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,ref: 'Devise',})
  devise: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,ref: 'Categories',})
  categories: mongoose.Schema.Types.ObjectId;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client' })
  client: Client; // Relation avec la table Client
  @Prop({ type: String })
  libelle: string;
  
  @Prop({ type:  String })
  unite: string;
  @Prop({ type: String, nullable: true })
  commentaire: string;
 

  @Prop({ type:  Number })
  quantite: number;
}

export const DevisSchema = SchemaFactory.createForClass(Devis);


