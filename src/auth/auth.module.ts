import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

import { Client, ClientSchema } from '../schemas/clients.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
   // MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
   MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: Client.name, schema: ClientSchema },
  ]), MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule ],
})
export class AuthModule {}