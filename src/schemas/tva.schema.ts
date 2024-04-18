
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type TvaDocument= Tva & mongoose.Document;

@Schema()
export class Tva  {

  @Prop({ unique: [true, 'Duplicate Categorie entered'] })
  Pourcent_TVA: string;

  @Prop({ type: String })
  montant_TTC: string;


 
}

export const TvaSchema = SchemaFactory.createForClass(Tva);
