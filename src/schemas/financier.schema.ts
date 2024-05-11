import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';

export type FinancierDocument = Financier & Document;

@Schema({collection:'users',timestamps:true})
export class Financier extends User {
    @Prop({ unique: [true, 'Duplicate reference '] })
    refFin: string;
    @Prop() 
    resetToken: string;
    
    @Prop()
    resetTokenExpiration: Date;
    

}
export const FinancierSchema = SchemaFactory.createForClass(Financier);
