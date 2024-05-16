import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TvaDocument = Tva & mongoose.Document;

@Schema()
export class Tva {

  @Prop({ type: Number, unique: [true, 'Duplicate Pourcent_TVA entered'] })
  Pourcent_TVA: number;
}

export const TvaSchema = SchemaFactory.createForClass(Tva);
