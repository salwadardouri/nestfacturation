import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type UserDocument = User & Document ;
@Schema({
  timestamps: true,
})



export class User  {
  
  @Prop({required: true})
  fullname: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop({required: true})
  password: string;

  @Prop({required: true})
  country: string;

  @Prop({required: true})
  num_phone: number;

  @Prop({required: true})
  address: string;

  @Prop({required: true})
  code_postal: number;

  @Prop({ type: [String]})
  roles: string[];
  // @Prop()
  // refreshToken?: string;

}

export const UserSchema = SchemaFactory.createForClass(User);

