import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({required: true})
  fullname: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop({required: true})
  password: string;

  @Prop({required: true})
  country: string;

  @Prop({required: true})
  num_phone: string;

  @Prop({required: true})
  address: string;

  @Prop({required: true})
  code_postal: string;

  @Prop({ type: [String]})
  roles: string[];
    // Ajoutez les propriétés resetCode et resetCodeExpiration
    @Prop()
    resetCode: string;
  
    @Prop()
    resetCodeExpiration: Date;
 
}

export const UserSchema = SchemaFactory.createForClass(User);
