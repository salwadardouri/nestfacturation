
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';



export type ServiceDocument = Service & mongoose.Document;

@Schema()
export class Service {
  @Prop({ type: String })
  reference: string;
  @Prop({ type: String })
  libelle: string;

  @Prop({ type:  Number })
  prix_unitaire: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,ref: 'Devise',})
  devise: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,ref: 'Categories',})
  categories: mongoose.Schema.Types.ObjectId;
}


export const ServiceSchema = SchemaFactory.createForClass(Service);
