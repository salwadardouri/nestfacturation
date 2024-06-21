
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Client } from './clients.schema'; 


export type NotificationDocument = Notification & mongoose.Document;

@Schema({ timestamps: true })
export class Notification {
    @Prop({
        required: true,
        enum: ['FactureCréée', 'PaiementRéglé', 'DevisClientNotif', 'DevisFinNotif'],
      })
      type: 'FactureCréée' | 'PaiementRéglé' | 'DevisClientNotif' | 'DevisFinNotif';
    
      @Prop({ required: true })
      notif: string;
      @Prop({ type: Date, default: Date.now })
      createdAt: Date;


  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true })
  client: mongoose.Schema.Types.ObjectId;


}


export const NotificationSchema = SchemaFactory.createForClass(Notification);
