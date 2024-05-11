import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TvaDocument = Tva & mongoose.Document;

@Schema()
export class Tva {

  @Prop({ unique: [true, 'Duplicate Pourcent_TVA entered'] })
  Pourcent_TVA: string;

  @Prop({ type: Number })
  valeur_TVA: number;
}

export const TvaSchema = SchemaFactory.createForClass(Tva);
