import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type EcheanceDocument = Echeance & Document;

@Schema({ timestamps: true })
export class Echeance {
  @Prop({ type: Number, default: null }) 
  numCheque: number;

  @Prop({ type: Number, default: null }) 
  montantCheque: number;
  @Prop({ type: Number, default: null }) 
  montantRestant: number;
  @Prop({ type: Date })
  dateCh: Date;

  @Prop({ type: Date, default: null })
  dateEcheance: Date;
}

export const EcheanceSchema = SchemaFactory.createForClass(Echeance);