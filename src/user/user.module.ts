import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { MailerService } from 'src/mailer/mailer.service';
import { MailerModule } from '../mailer/mailer.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      
    ]),MailerModule
  ],
  providers: [UserService,MailerService],
  controllers: [UserController],
})
export class UserModule {}
