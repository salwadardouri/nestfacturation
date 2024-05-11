import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({required: true})
  fullname: string;

   @Prop({ unique: true, required: true })
  email: string;

  // New boolean field with default value set to true
  @Prop({ default: true })
  status: boolean;
  @Prop({ default: false })
  updatedPass: boolean;

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
