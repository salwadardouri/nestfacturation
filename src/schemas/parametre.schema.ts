import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
export type ParametreDocument = Parametre & mongoose.Document;
@Schema({
  timestamps: true,
})
export class Parametre  {

  @Prop({ required: true })
  Nom_S: string;

  @Prop({ required: true })
  Email_S: string;

  @Prop({ required: true })
  Paye_S:string;

  @Prop({ required: true })
  Address_S: string;

  @Prop({ required: true })
  Num_Phone_S:string;

  @Prop({ required: true })
  Code_Postal_S:string;

  @Prop({ required: true })
  Matricule_Fiscale_S: string;
  @Prop({ default: true })
  status: boolean;
}

export const ParametreSchema = SchemaFactory.createForClass(Parametre);
