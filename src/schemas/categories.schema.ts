
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type CategoriesDocument= Categories & mongoose.Document;

@Schema()
export class Categories  {

  @Prop({ unique: [true, 'Duplicate Categorie entered'] })
  Titre_Categorie: string;
  @Prop({ type: String })
  Description_Categorie: string;
  @Prop({ default: true })
  status: boolean;
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);
