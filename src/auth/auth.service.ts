import { Injectable,HttpException, HttpStatus,BadRequestException  } from '@nestjs/common';
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
          return (payload as any)._id; // Utilisation de la propriété _id du payload
        } catch (error) {
          throw new Error('Token invalide'); // Gérer l'erreur en conséquence
        }
      }
      
      
      async signUp(signUpDto: SignUpDto): Promise<{ token: string, user: User }> {
        const { fullname, email, password, country, num_phone, address, code_postal, roles } = signUpDto;
    
        try {
          const hashedPassword = await bcrypt.hash(password, 10);
    
          const user = await this.userModel.create({
            fullname, email, password: hashedPassword, country, num_phone, address, code_postal, roles,
          });
    
          const token = this.jwtService.sign({ id: user._id });
    
          return { token, user };
        } catch (error) {
          if (error.code === 11000) {
            // MongoDB duplicate key error (e.g., duplicate email)
            throw new HttpException('Email already exists', HttpStatus.CONFLICT);
          } else {
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
          }
        }
      }


      async signUpClient(clientDto: ClientDto): Promise<{ token: string; user: any }> {
        const { fullname, email, password, country, num_phone, address, code_postal, roles, matricule_fiscale } = clientDto;


        // Vérifier la validité de l'e-mail
        try {
 
    
     // Recherche d'un client existant avec cet email
  const existingClient = await this.clientModel.findOne({ email: clientDto.email });

  if (existingClient) {
    throw new HttpException("L'email existe déjà", HttpStatus.CONFLICT);
  }
  // Vérifiez la force du mot de passe (une validation supplémentaire au cas où)
          const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
          if (!strongPasswordPattern.test(password)) {
            throw new HttpException(
              'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre, et un caractère spécial',
              HttpStatus.BAD_REQUEST,
            );
          }
    
          // Hash le mot de passe
          const hashedPassword = await bcrypt.hash(password, 10);
    
          // Détermine le type de client
          let type = 'physique';
          if (matricule_fiscale) {
            type = 'morale';
          }
    
          // Crée le client
          const client = await this.clientModel.create({
            updatedPass:true,
            status:true,
            fullname,
            email,
            password: hashedPassword,
            country,
            num_phone,
            address,
            code_postal,
            roles,
            type,
            matricule_fiscale,
          });
    
          // Génère le token JWT
          const token = this.jwtService.sign({ id: client._id });
    
          return { token, user: client };
        } catch (error) {
          if (error.code === 11000 || error.status === HttpStatus.CONFLICT) {
            throw new HttpException("L'email existe déjà", HttpStatus.CONFLICT);
          } else {
            throw new HttpException("Erreur interne du serveur", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        }
      }
    
    
      async login(loginDto: LoginDto): Promise<{ token: string, user: User }> {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
          const token = this.jwtService.sign({ id: user._id });
          return { token, user };
        } else {
          throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
        
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
    //   async comparecodeauth(email: string, code: string): Promise<void> {
    //     const user = await this.userModel.findOne({ email });

    //     if (!user) {
    //         throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    //     }

    //     if (user.resetCode !== code ) {
    //         // Supprime le compte si le code est incorrect ou expiré
    //         await this.userModel.deleteOne({ email });
    //         throw new HttpException('Invalid reset code', HttpStatus.BAD_REQUEST);
    //     }

    //     // Réinitialise les champs resetCode et resetCodeExpiration
    //     user.resetCode = null;
      
    //     await user.save();
    // }
}
    
    
      // async logout(userId: string): Promise<void> {
      //   await this.userModel.updateOne({ _id: userId }, { refreshToken: null });
      // }
      
        
    // async signUp(body: SignUpDto):Promise<{ message: string, user?: User }> {
    //     const { fullname, email, password, country, num_phone, address, code_postal, roles } = body;
    //     try {
    //       const hashedPassword = await bcrypt.hash(password, 10);
    
    //       const user = await this.userModel.create({fullname,email,password: hashedPassword,country,num_phone,address,code_postal,roles, });
    //       return { message: 'User created successfully', user };
    //         } catch (error) {
    //       if (error.code === 11000) {
    //         // MongoDB duplicate key error (e.g., duplicate email)
    //         throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    //       }
      // }
     // }

