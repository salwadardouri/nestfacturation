import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from '../schemas/clients.schema';

import { MailerService } from '../mailer/mailer.service';

@Module({
  imports: [
  MongooseModule.forFeature([
    { name: Client.name, schema: ClientSchema },
  ]),
  ],
  controllers: [ClientsController],
  providers: [ClientsService,MailerService]
})
export class ClientsModule {}
