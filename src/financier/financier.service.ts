import { Injectable,HttpException,HttpStatus,NotFoundException,BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FinancierDto } from './dto/financier.dto';
import * as bcrypt from 'bcryptjs';
import {ChangePasswordDto } from 'src/financier/dto/change-password.dto';
import { Financier,FinancierDocument } from '../schemas/financier.schema';
import { MailerService } from '../mailer/mailer.service';
import * as crypto from 'crypto';
import * as generator from 'generate-password';
import * as validator from 'validator'; 
//import { SearchDto } from 'src/financier/dto/search.dto';

@Injectable()
export class FinancierService{
  private sequenceNumbers: { [key: string]: number } = {};

  constructor(
    @InjectModel(Financier.name) private financierModel: Model<FinancierDocument>,private readonly mailerService: MailerService 
  ) {}

  async changePassword(financierId: string, changePasswordDto: ChangePasswordDto) {
    const { password, newPassword } = changePasswordDto;

    const financier = await this.financierModel.findById(financierId);
    if (!financier) {
      throw new NotFoundException('Financier not found');
    }

    const isPasswordValid = await bcrypt.compare(password, financier.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

  // Hacher le nouveau mot de passe avant de l'enregistrer
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  financier.password = hashedPassword;
  await financier.save();

  return { message: 'Password updated successfully' };
}
  async getFinanciers(): Promise<Financier[]> {
    return this.financierModel.find({ roles: 'FINANCIER' }).exec();
  }

  async isEmailValid(email: string): Promise<boolean> {
    return validator.isEmail(email);
  }
  private async generateSequenceNumber(type: string): Promise<number> {
    // Vérifier si le type existe déjà dans sequenceNumbers, sinon initialiser à 0
    if (!this.sequenceNumbers[type]) {
      this.sequenceNumbers[type] = 0;
    }

    // Incrémenter le numéro de séquence et le stocker
    this.sequenceNumbers[type]++;

    // Formater le numéro de séquence avec 4 chiffres
    const sequenceNumber = this.sequenceNumbers[type].toString().padStart(4, '0');

    // Retourner le numéro de séquence converti en nombre
    return parseInt(sequenceNumber);
  }

    async createAccount(financierDto: FinancierDto): Promise<{ user: Financier; resetLink: string; message: string }> {
      const { fullname, email, country, num_phone, address, code_postal, roles} = financierDto;
    
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

      // Génération du numéro de séquence
      const sequenceNumber = await this.generateSequenceNumber('financier');

      // Génération du Ref unique
      const finRef = `VST-FIN-${sequenceNumber.toString().padStart(4, '0')}`;

  
      const financier = await this.financierModel.create({
        fullname,
        email,
        password: hashedPassword,
        country,
        num_phone,
        address,
        code_postal,
        roles,
        refFin: finRef,
      });
  
      // Logique pour envoyer le lien unique
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiration = new Date(Date.now() + 3600000); // 1 heure plus tard
  
      // Mettre à jour les propriétés resetToken et resetTokenExpiration du financier
      financier.resetToken = resetToken;
      financier.resetTokenExpiration = resetTokenExpiration;
      await financier.save();
  
      // Envoyer le lien de réinitialisation du mot de passe avec le token généré
      const resetLink = `http://localhost:3000/create-passworfin/${resetToken}`;
      await this.mailerService.sendResetPasswordLink(financier.email, resetToken);
  
      return {
        user: financier,
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
      // Rechercher le financier par le token dans la base de données
      const financier = await this.financierModel.findOne({ resetToken: token });

      if (!financier) {
        throw new NotFoundException('financier introuvable pour ce token.');
      }

      // Renvoyer l'email associé au financier trouvé
      return financier.email;
    } catch (error) {
      // Gérer les erreurs de recherche
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Une erreur est survenue lors de la recherche du financier par le token.');
    }
  }
  async resetPassword(email: string, newPassword: string): Promise<string> {
    try {
      const client = await this.financierModel.findOne({ email });

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


  

  FindAll() {
    return this.financierModel.find();
  }

  FindOne(id: string) {
    return this.financierModel.findOne({ _id: id });
  }

  Update(id: string, body: FinancierDto) {
    return this.financierModel.findByIdAndUpdate(
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
          ],  roles: 'FINANCIER'
        }
      : {  roles: 'FINANCIER'};


    const results = await this.financierModel.find(keyword);
    if (results.length === 0) {
      throw new Error('no Data');
    }
    return results;
  }
  

}