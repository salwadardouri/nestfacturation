import { Module } from '@nestjs/common';
import { FinancierController } from './financier.controller';
import { FinancierService } from './financier.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Financier, FinancierSchema } from '../schemas/financier.schema';
import { MailerService } from '../mailer/mailer.service';


@Module({
  imports: [
  MongooseModule.forFeature([{ name: Financier.name, schema: FinancierSchema }])],

  controllers: [FinancierController],
  providers: [FinancierService,MailerService]
})
export class FinancierModule {}
