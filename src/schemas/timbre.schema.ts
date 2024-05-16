import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type TimbreDocument= Timbre & mongoose.Document;

@Schema()
export class Timbre  {

  @Prop({ type: Number, unique: [true, 'Duplicate Timbre entered'] })
  Valeur: number;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,ref: 'Devise',})
  devise: mongoose.Schema.Types.ObjectId;
}

export const TimbreSchema = SchemaFactory.createForClass(Timbre);
