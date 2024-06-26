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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TimbreModule } from './timbre/timbre.module';

import { DeviseModule } from './devise/devise.module';
import { FactureModule } from './facture/facture.module';

import { ScheduleModule } from '@nestjs/schedule';
import { PaiementModule } from './paiement/paiement.module';
import { EcheanceController } from './echeance/echeance.controller';
import { EcheanceService } from './echeance/echeance.service';
import { EcheanceModule } from './echeance/echeance.module';

import { NotificationModule } from './notification/notification.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    
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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Chemin du dossier 'uploads'
      serveRoot: '/uploads', // Serveur statique point de départ
    }),
    DeviseModule,
    FactureModule,
    PaiementModule,
    EcheanceModule,
    NotificationModule,   ],
  controllers: [AppController, EcheanceController],
  providers: [AppService, MailerService, EcheanceService],

})
export class AppModule {}