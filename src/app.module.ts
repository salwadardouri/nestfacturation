import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MailerService } from './mailer/mailer.service';
import { MailerModule } from './mailer/mailer.module';
import { ClientsModule } from './clients/clients.module';
import { FinancierModule } from './financier/financier.module';
import { ParametreModule } from './parametre/parametre.module';
import { DevisModule } from './devis/devis.module';
import { ServicesModule } from './services/services.module';
import { CategoriesModule } from './categories/categories.module';
import { TvaModule } from './tva/tva.module';

import { TimbreModule } from './timbre/timbre.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    AuthModule,
    MailerModule,
    UserModule,
    ClientsModule,
    FinancierModule,
    ParametreModule,
    DevisModule,
    ServicesModule,
    CategoriesModule,
    TvaModule,
    TimbreModule,
  

  ],
  controllers: [AppController],
  providers: [AppService, MailerService,],
})
export class AppModule {}