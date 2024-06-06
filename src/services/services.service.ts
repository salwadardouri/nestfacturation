import { Injectable, NotFoundException,BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Service, ServiceDocument } from '../schemas/services.schema';
import { ServicesDto } from './dto/services.dto';
import { UpdateDto } from './dto/update.dto';
import { ActivatedServiceDto } from './dto/activatedService.dto';
import * as mongoose from 'mongoose';
import { Client, ClientDocument } from '../schemas/clients.schema';
import {Tva, TvaDocument } from 'src/schemas/tva.schema';
import { Facture, FactureDocument } from 'src/schemas/facture.schema';
import {Categories, CategoriesDocument } from 'src/schemas/categories.schema';
import {Devise, DeviseDocument} from 'src/schemas/devise.schema';
import * as crypto from 'crypto';

@Injectable()
export class ServicesService {
  private sequenceNumbers: { [key: string]: number } = {};
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>, 
    @InjectModel(Tva.name) private tvaModel: Model<TvaDocument>,
    @InjectModel(Facture.name) private factureModel: Model<FactureDocument>,



  ) {}
  private async generateUniqueSequenceNumber(): Promise<string> {
    let isUnique = false;
    let refS: string;

    while (!isUnique) {
      // Generate sequence number
      if (!this.sequenceNumbers['services']) {
        this.sequenceNumbers['services'] = 0;
      }
      this.sequenceNumbers['services']++;
      const sequenceNumber = this.sequenceNumbers['services'].toString().padStart(4, '0');
      refS = `VST-S-${sequenceNumber}`;

      // Check if the reference already exists
      const existingService = await this.serviceModel.findOne({ reference: refS }).exec();
      if (!existingService) {
        isUnique = true;
      }
    }
    return refS;
  }
  async activatedService(id: string, activatedServiceDto: ActivatedServiceDto): Promise<any> {
    const service = await this.serviceModel.findById(id);
    if (!service) {
      throw new NotFoundException(`Service not found`);
    }
  
    service.status = activatedServiceDto.status;
  
    return await service.save();
  }
  async create(serviceDto: ServicesDto): Promise<Service> {
    const refS = await this.generateUniqueSequenceNumber();

    const { libelle, prix_unitaire, categoriesId, deviseId, tva } = serviceDto;

    const newService = new this.serviceModel({
      reference: refS,
      libelle,
      prix_unitaire,
      categories: categoriesId,
      devise: deviseId,
      quantite: null,
      remise: null,
      tva: null, 
      montant_HT: null,
      status:true,
    });

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


  async updateService(serviceId: string, UpdateDto: UpdateDto): Promise<Service> {
    // Convert the service ID to ObjectId
    const objectId = new Types.ObjectId(serviceId);

    // Find the existing service
    const existingService = await this.serviceModel.findById(objectId);
    if (!existingService) {
      throw new NotFoundException('Service not found');
    }
    existingService.libelle = UpdateDto.libelle;
    existingService.reference = UpdateDto.reference;
    existingService.prix_unitaire = UpdateDto.prix_unitaire;
    
    existingService.status = UpdateDto.status;
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

  async getServiceById(id: string): Promise<Service> {
    let service;
    try {
      service = await this.serviceModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Service introuvable.');
    }
    if (!service) {
      throw new NotFoundException('Service introuvable.');
    }
    return service;
  }
}
