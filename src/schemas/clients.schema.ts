import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';

export type ClientDocument = Client & Document;

@Schema({collection:'users',timestamps:true})
export class Client extends User {
 


  @Prop({ default: null })
  matricule_fiscale: string;
  @Prop() 
  logo: string;
  @Prop({ default: 'physique' })
  type: string; // Peut être 'physique' ou 'morale'

@Prop()
resetToken: string;

@Prop()
resetTokenExpiration: Date;
}
export const ClientSchema = SchemaFactory.createForClass(Client);
