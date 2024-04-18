import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type TimbreDocument= Timbre & mongoose.Document;

@Schema()
export class Timbre  {

    @Prop({ type: String })
  Valeur: string;
}

export const TimbreSchema = SchemaFactory.createForClass(Timbre);
