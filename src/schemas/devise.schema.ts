import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DeviseDocument = Devise & mongoose.Document;

@Schema()
export class Devise {

  @Prop({ unique: [true, 'Duplicate Devise entered'] })
  Nom_D: string;

  @Prop({ type: String })
  Symbole: string;
  @Prop({ default: true })
  status: boolean;
}

export const DeviseSchema = SchemaFactory.createForClass(Devise);
