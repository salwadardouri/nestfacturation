import { Injectable,HttpException,HttpStatus,NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientDto } from './dto/clients.dto';
import * as bcrypt from 'bcryptjs';
import { MailerService } from '../mailer/mailer.service';
import { Client, ClientDocument } from '../schemas/clients.schema';
import * as crypto from 'crypto';
import * as generator from 'generate-password';
import * as validator from 'validator'; 

@Injectable()
export class ClientsService {
  constructor(

    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,private readonly mailerService: MailerService
  ) {}
  

  async isEmailValid(email: string): Promise<boolean> {
    return validator.isEmail(email);
  }
    async createAccount(clientDto: ClientDto): Promise<{ user: Client; resetLink: string; message: string }> {
      const { fullname, email, country, num_phone, address, code_postal, roles, matricule_fiscale } = clientDto;
    
 // Vérifier la validité de l'e-mail

 const isEmailValid = await this.isEmailValid(email);
 if (!isEmailValid) {
   throw new HttpException('Invalid email address', HttpStatus.BAD_REQUEST);
 }
    
    try {
      // Génération du mot de passe aléatoire
      const generatedPassword = generator.generate({
        length: 10, // Longueur du mot de passe
        numbers: true, // Inclure des chiffres
        symbols: true, // Inclure des symboles
        uppercase: true, // Inclure des lettres majuscules
        excludeSimilarCharacters: true, // Exclure les caractères similaires comme '1' et 'l'
      });
  
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
  
      let type = 'physique';
      if (matricule_fiscale) {
        type = 'morale';
      }
  
    //Génération du Ref unique en combinant un timestamp et un identifiant aléatoire. 
    //Vous pouvez utiliser Date.now() pour obtenir le timestamp et crypto.
    const timestamp = Date.now();
     //randomBytes pour générer une chaîne aléatoire.
    const randomPart = crypto.randomBytes(4).toString('hex'); // Génère 8 caractères hexadécimaux
    const clientRef = `${timestamp}-${randomPart}`;

      const client = await this.clientModel.create({
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
        refClient: clientRef,
      });
  
      // Logique pour envoyer le lien unique
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiration = new Date(Date.now() + 3600000); // 1 heure plus tard
  
      // Mettre à jour les propriétés resetToken et resetTokenExpiration du client
      client.resetToken = resetToken;
      client.resetTokenExpiration = resetTokenExpiration;
      await client.save();
  
      // Envoyer le lien de réinitialisation du mot de passe avec le token généré
      const resetLink = `http://localhost:3000/create-password/${resetToken}`;
      await this.mailerService.sendResetPasswordLink(client.email, resetToken);
  
      return {
        user: client,
        resetLink,
        message: 'Le compte a été créé avec succès. Un lien de réinitialisation de mot de passe a été envoyé à votre adresse e-mail.',
      };
    }  catch (error) {
      if (error.code === 11000) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      } else {
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  
 
  
  async getEmailFromToken(token: string): Promise<string | null> {
    try {
      // Rechercher le client par le token dans la base de données
      const client = await this.clientModel.findOne({ resetToken: token });

      if (!client) {
        throw new NotFoundException('Client introuvable pour ce token.');
      }

      // Renvoyer l'email associé au client trouvé
      return client.email;
    } catch (error) {
      // Gérer les erreurs de recherche
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Une erreur est survenue lors de la recherche du client par le token.');
    }
  }
  async resetPassword(email: string, newPassword: string): Promise<string> {
    try {
      const client = await this.clientModel.findOne({ email });

      if (!client) {
        throw new NotFoundException('Client introuvable.');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      client.password = hashedPassword;
      await client.save();

      return 'Le mot de passe a été réinitialisé avec succès.';
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Une erreur est survenue lors de la réinitialisation du mot de passe.');
    }
  }

  FindOne(id: string) {
    return this.clientModel.findOne({ _id: id });
  }
  Update(id: string, body:  ClientDto) {
    return this.clientModel.findByIdAndUpdate(
      { _id: id },
      { $set: body },
      { new: true },
    );
  }
  
  async Search(key: string): Promise<any> {
    const keyword = key
      ? {
          $or: [
            { fullname: { $regex: key, $options: 'i' } },
            { email: { $regex: key, $options: 'i' } },
            { country: { $regex: key, $options: 'i' } },
            { num_phone: { $regex: key, $options: 'i' } },
            { address: { $regex: key, $options: 'i' } },
            { code_postal: { $regex: key, $options: 'i' } },
            { matricule_fiscale: { $regex: key, $options: 'i' } },
            { type: { $regex: key, $options: 'i' } },
        
          ],  roles: 'CLIENT'
        }
      : {  roles: 'CLIENT'};


    const results = await this.clientModel.find(keyword);
    if (results.length === 0) {
      throw new Error('no Data');
    }
    return results;
  }
  async getClients(): Promise<Client[]> {
    return this.clientModel.find({ roles: 'CLIENT' }).exec();
  }
  // Add(body: ClientDto ) {
  //   return this.clientModel.create(body);
  // }

  // async Add(body: ClientDto) {
  //   // Vérifier si le client a un matricule_fiscale
  //   let type = 'physique'; // Par défaut, le type est physique
  //   if (body.matricule_fiscale) {
  //     type = 'morale';
  //   }

  //   // Hacher le mot de passe
  //   const hashedPassword = await bcrypt.hash(body.password, 10);

  //   // Créer un nouvel objet client en fonction du DTO
  //   const newClient = new this.clientModel({
  //     ...body,
  //     type: type,
  //     password: hashedPassword,
  //   });

  //   // Sauvegarder le nouveau client dans la base de données
  //   return newClient.save();
  // }
  // async signUpClient(clientDto: ClientDto): Promise<{  user: Client }> {
  //   const { fullname, email, password, country, num_phone, address, code_postal,roles, matricule_fiscale } = clientDto;

  //   try {
  //     const hashedPassword = await bcrypt.hash(password, 10);


  //     let type = 'physique';
  //     if (matricule_fiscale) {
     
  //       type = 'morale';
  //     }

  //     const client = await this.clientModel.create({
  //       fullname,
  //       email,
  //       password: hashedPassword,
  //       country,
  //       num_phone,
  //       address,
  //       code_postal,
  //       roles,
  //       type,
  //       matricule_fiscale,
  //     });

   
  //     return { user: client };
  //   } catch (error) {
  //     if (error.code === 11000) {
  //       throw new HttpException('Email already exists', HttpStatus.CONFLICT);
  //     } else {
  //       throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  //     }
  //   }
  //}
  




 


}