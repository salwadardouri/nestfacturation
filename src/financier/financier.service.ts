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
import { UpdateDto } from 'src/financier/dto/update.dto';
import { UpdateFinancierDto } from './dto/updatefinancier.dto';
@Injectable()
export class FinancierService{
  private sequenceNumbers: { [key: string]: number } = {};

  constructor(
    @InjectModel(Financier.name) private financierModel: Model<FinancierDocument>,private readonly mailerService: MailerService 
  ) {}
  async deleteFinancier(financierId: string): Promise<void> {
    const result = await this.financierModel.deleteOne({ _id: financierId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Financier not found`);
    }
  }
  async updateFinancier(id: string, updateFinancierDto: UpdateFinancierDto): Promise<any> {
    const financier = await this.financierModel.findById(id); // Utilisez findById pour rechercher par ID
    if (!financier) {
      throw new NotFoundException(`financier with ID ${id} not found`);
    }

    // Mettez à jour les propriétés du financier avec les données de l'updateFinancierDto
    financier.fullname = updateFinancierDto.fullname;
    financier.email = updateFinancierDto.email;
    financier.status = updateFinancierDto.status;
    financier.country = updateFinancierDto.country;
    financier.num_phone = updateFinancierDto.num_phone;
    financier.address = updateFinancierDto.address;
    financier.code_postal = updateFinancierDto.code_postal;
   
  

    // Mettez à jour d'autres propriétés si nécessaire...

    // Enregistrez les modifications en utilisant la méthode save
    return await financier.save();
}
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
 
    async createAccount(financierDto: FinancierDto): Promise<{ user: Financier; resetLink: string; message: string }> {
      const { fullname, email, country, num_phone, address, code_postal} = financierDto;
    
 // Vérifier la validité de l'e-mail

 const isEmailValid = await this.isEmailValid(email);
 if (!isEmailValid) {
   throw new HttpException('Invalid email address', HttpStatus.BAD_REQUEST);
 }


 // Check if the email already exists
 const existingFinancier = await this.financierModel.findOne({ email });

 if (existingFinancier) {
   throw new HttpException('Email already exists', HttpStatus.CONFLICT);
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


     
      const financier = await this.financierModel.create({
        status:true,
        updatedPass:false,
        fullname,
        email,
        password: hashedPassword,
        country,
        num_phone,
        address,
        code_postal,
        roles:['FINANCIER'],

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
      const financier = await this.financierModel.findOne({ email });

      if (!financier) {
        throw new NotFoundException('financier introuvable.');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      financier.password = hashedPassword;
      await financier.save();

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

  async update(id: string, updateDto: UpdateDto): Promise<Financier> {
    const updatedFinancier = await this.financierModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!updatedFinancier) {
      throw new NotFoundException(`financier  not found`);
    }
    return updatedFinancier;
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
          ],
        }
      : {};


   
      try {
        const results = await this.financierModel.find(keyword);
        return results.length > 0 ? results : [];
      } catch (error) {
        throw new Error('An error occurred while searching');
      }
    }
    
  

}