
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Client } from './clients.schema'; 
import { Devise } from './devise.schema'; 
import { Service } from './services.schema'; 
export type FactureDocument = Facture & mongoose.Document;

@Schema()
export class Facture {
  @Prop({ type: String })
  Num_Fact: string;
  
  @Prop({ type: Date })
  Date_Fact: Date;


  @Prop({ type: Date })
  Date_Echeance: Date;
  @Prop({ type: Date })
  Date_Jour_Actuel: Date;
  @Prop({ type: String })
  Status_delais: string;
  @Prop({ type: String })
  Etat_delais: string;
  @Prop({ type:  Number })  
  nombre_jours_retard: number;
  @Prop({ type:  Number })  
  comptant_Reception: number;

  @Prop({ type:  Number })  
  total_TTC: number;
  @Prop({ type:  Number })  
montant_Paye: number;
@Prop({ type:  Number })  
  montant_Restant: number;  
  @Prop({ type:  Number })  
  total_HT: number;

  @Prop({ type:  Number })  
  total_TVA: number;
  @Prop({ type:  Number })  
  total_Remise: number;

  @Prop({ type:  Number })  
  total_HT_Apres_Remise: number;
  @Prop({ type:  String })  
  total_TTC_Lettre: string;



  @Prop({ type: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Service' }] })
  services: Service[];
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Devise',
  })
  devise: mongoose.Schema.Types.ObjectId;

  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Timbre' })
  timbre: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client' })
  client: Client;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Parametre' })
  parametre: mongoose.Schema.Types.ObjectId;
}


export const FactureSchema = SchemaFactory.createForClass(Facture);
