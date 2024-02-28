import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from '../mailer/mailer.module';
import { User, UserSchema } from '../schemas/user.schema';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),MailModule],
  controllers: [UserController],
  providers: [UserService, MailerService],

  
})
export class UserModule {}
