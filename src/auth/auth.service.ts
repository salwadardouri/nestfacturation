import { Injectable,HttpException, HttpStatus,BadRequestException ,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Client, ClientDocument } from '../schemas/clients.schema';
import { ClientDto } from 'src/clients/dto/clients.dto';
import * as crypto from 'crypto';
import { MailerService } from '../mailer/mailer.service';


@Injectable()
export class AuthService {
    constructor(
      @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
        private jwtService: JwtService,
        private mailerService: MailerService,
        
     
       
      ) {}
      async getClientIdFromToken(token: string): Promise<string> {
        try {
          const payload = this.jwtService.verify(token);
          return (payload as any)._id; // Utilisation de la propriété _id    du payload
        } catch (error) {
          throw new Error('Token invalide'); // Gérer l'erreur en conséquence
        }
      }
      async signUp(signUpDto: ClientDto): Promise<{ accessToken: string, refreshToken: string, user: any }> {
        const { email, password } = signUpDto;
    
        // Check if email already exists
        const existingUser = await this.userModel.findOne({ email }) || await this.clientModel.findOne({ email });
        if (existingUser) {
          throw new HttpException('Email already exists', HttpStatus.CONFLICT);
        }
    
        // Hash the password  
        const hashedPassword = await bcrypt.hash(password, 10);
        let user;
    
        if ('matricule_fiscale' in signUpDto) {
          // If it's a client, handle Client creation
          const clientDto = signUpDto as ClientDto;
          user = await this.clientModel.create({ ...clientDto, password: hashedPassword });
        } else {
          // If it's an admin or regular user, handle User creation
          const userDto = signUpDto as SignUpDto;
          user = await this.userModel.create({ ...userDto, password: hashedPassword });
        }
    
        const accessToken = this.jwtService.sign({ id: user._id });
        const refreshToken = this.jwtService.sign({ id: user._id }, { expiresIn: '7d' });
    
        return { accessToken, refreshToken, user };
      }
    
      async login(loginDto: LoginDto): Promise<{ accessToken: string, refreshToken: string, user: any }> {
        const { email, password } = loginDto;
    
        const user = await this.userModel.findOne({ email }) || await this.clientModel.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
          throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
    
        const accessToken = this.jwtService.sign({ id: user._id });
        const refreshToken = this.jwtService.sign({ id: user._id }, { expiresIn: '7d' });
    
        return { accessToken, refreshToken, user };
      }
    
async requestPasswordReset(email: string): Promise<{ resetCode: string; resetCodeExpiration: Date }> {
  const user = await this.userModel.findOne({ email });
  if (!user) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
  const currentTime = new Date();
  if (user.resetCodeExpiration && currentTime < user.resetCodeExpiration) {
    throw new HttpException('resendError', HttpStatus.BAD_REQUEST);
  }
  const resetCode = this.generateRandomCode();
  const resetCodeExpiration = new Date(Date.now() + 90000); // timeout : 60000 miliseconde =1min 
  user.resetCode = resetCode;
  user.resetCodeExpiration = resetCodeExpiration;
  await user.save();

  // Assurez-vous que mailerService est défini dans le constructeur
  await this.mailerService.sendResetPasswordCode(email, resetCode  );

  return { resetCode, resetCodeExpiration }; // Retourne le code de réinitialisation et son expiration
}


async resetPassword(email: string, newPassword: string): Promise<void> {
  const user = await this.userModel.findOne({ email });

  // Validate new password strength
  this.validatePasswordStrength(newPassword);

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  await user.save();
}
  private validatePasswordStrength(password: string): void {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            throw new BadRequestException('The password should be strong');
        }
    }

      private generateRandomCode(length: number = 6): string {
        const buffer = crypto.randomBytes(length);
        return buffer.toString('hex').slice(0, length).toUpperCase(); // Convertir en hexadécimal et prendre une sous-chaîne de longueur spécifiée
      }

      async comparecode(email: string, code: string): Promise<void> {
        const user = await this.userModel.findOne({ email });
        if (!user || user.resetCode !== code || user.resetCodeExpiration < new Date()) {
          throw new HttpException('Invalid reset code', HttpStatus.BAD_REQUEST);
        }
        user.resetCode = null;
        user.resetCodeExpiration = null;
        await user.save();
      }


  async getUserByToken(token: string): Promise<User | null> {
    const decodedToken = this.jwtService.decode(token) as { id: string };
    if (!decodedToken || !decodedToken.id) {
      throw new NotFoundException('Invalid token');
    }
    const user = await this.userModel.findById(decodedToken.id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async getClientByToken(token: string): Promise<Client | null> {
    const decodedToken = this.jwtService.decode(token) as { id: string };
    if (!decodedToken || !decodedToken.id) {
      throw new NotFoundException('Invalid token');
    }
      const user = await this.clientModel.findById(decodedToken.id) .populate({
      path: 'facture',
      populate: [
        { path: 'services' },
        { path: 'devise' },
        { path: 'timbre' },
        { path: 'client' },
        { path: 'parametre' },
      ]
    })
    .exec();
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
}
    

