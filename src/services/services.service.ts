import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Service, ServiceDocument } from '../schemas/services.schema';
import { ServicesDto } from './dto/services.dto';
import { Client, ClientDocument } from '../schemas/clients.schema';
import {Tva, TvaDocument } from 'src/schemas/tva.schema';
import {Categories, CategoriesDocument } from 'src/schemas/categories.schema';
import {Devise, DeviseDocument} from 'src/schemas/devise.schema';
import * as crypto from 'crypto';

@Injectable()
export class ServicesService {
  private sequenceNumbers: { [key: string]: number } = {};
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,


  ) {}

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
  async create(ServiceDto: ServicesDto): Promise<Service> {




    
 // Génération du numéro de séquence
 const sequenceNumber = await this.generateSequenceNumber('services');

 // Génération du Ref unique
 const refS = `VST-S-${sequenceNumber.toString().padStart(4, '0')}`;
 

    // Crée un nouveau service avec les données du DTO
    const { libelle, prix_unitaire,categoriesId,deviseId} = ServiceDto;
    const newService = new this.serviceModel({
      reference:refS,
      libelle,
      
      prix_unitaire,
    
      categories:categoriesId,
      devise:deviseId,


    });

 

    // Enregistre le service dans la base de données
    return await newService.save();
  }




  async delete(id: string): Promise<boolean> {
    const deletedService = await this.serviceModel.findByIdAndDelete(id).exec();
    return !!deletedService;
  }
  async findAll(): Promise<ServicesDto[]> {
    const services = await this.serviceModel.find().populate('categories').populate('devise').exec();
    return services.map(service => service.toObject());
  }


  async updateService(serviceId: string, ServiceDto: ServicesDto): Promise<Service> {
    // Convert the service ID to ObjectId
    const objectId = new Types.ObjectId(serviceId);

    // Find the existing service
    const existingService = await this.serviceModel.findById(objectId);
    if (!existingService) {
      throw new NotFoundException('Service not found');
    }


    // Update other fields
    existingService.libelle = ServiceDto.libelle;
    existingService.reference = ServiceDto.libelle;
    existingService.prix_unitaire = ServiceDto.prix_unitaire;

    

    // Save the updated service
    return await existingService.save();
  }

  async Search(key: string): Promise<any> {
    const keyword = key
      ? {
          $or: [
            { prix_unitaire: { $regex: key, $options: 'i' } },
            { libelle: { $regex: key, $options: 'i' } },
            {reference: { $regex: key, $options: 'i' } },
            { devise: { $regex: key, $options: 'i' } },
            { categories: { $regex: key, $options: 'i' } },
  
          ],
        }
      : {};

    try {
      const results = await this.serviceModel.find(keyword);
      return results.length > 0 ? results : [];
    } catch (error) {
      throw new Error('An error occurred while searching');
    }
  }
}
