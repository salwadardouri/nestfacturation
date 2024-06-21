import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';
import * as mongoose from 'mongoose';

export type ClientDocument = Client & Document;

@Schema({collection:'users',timestamps:true})
export class Client extends User {
 


  @Prop({ default: null })
  matricule_fiscale: string;
  
  @Prop({ default: 'physique' })
  type: string; // Peut être 'physique' ou 'morale'

@Prop()
resetToken: string;

@Prop()
resetTokenExpiration: Date;
@Prop({ default: null, required: false })
Nom_entreprise?: string;

@Prop({ default: null, required: false })
num_fax?: string;

@Prop({ default: null, required: false })
num_bureau?: string;

@Prop({ default: null, required: false })
siteweb?: string;


@Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Facture' }])
facture: mongoose.Schema.Types.ObjectId[];

@Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }])
  notifications: mongoose.Schema.Types.ObjectId[];

}


export const ClientSchema = SchemaFactory.createForClass(Client);
