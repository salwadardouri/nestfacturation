import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TvaDocument = Tva & mongoose.Document;

@Schema()
export class Tva {

  @Prop({ type: Number})
  Pourcent_TVA: number;
  @Prop({ default: true })
  status: boolean;
}

export const TvaSchema = SchemaFactory.createForClass(Tva);
