import { Injectable, NotFoundException,BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Service, ServiceDocument } from '../schemas/services.schema';
import { ServicesDto } from './dto/services.dto';
import { UpdateDto } from './dto/update.dto';
import { ActivatedServiceDto } from './dto/activatedService.dto';
import { SearchDto } from './dto/search.dto';
import {Tva, TvaDocument } from 'src/schemas/tva.schema';
import { Facture, FactureDocument } from 'src/schemas/facture.schema';


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

    const { libelle,unite ,prix_unitaire, categoriesId, deviseId, tva } = serviceDto;

    const newService = new this.serviceModel({
      reference: refS,
      libelle,
      prix_unitaire,
      unite,
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


  async updateService(id: string, updateDto: UpdateDto): Promise<Service> {
    const { categoriesId, deviseId, ...serviceData } = updateDto;

    const service = await this.serviceModel.findById(id);
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    service.set({
      ...serviceData,

      categories: categoriesId,
      devise: deviseId,
    });

    return await service.save();
  }


  async search(searchServiceDto: SearchDto): Promise<Service[]> {
    const { reference, libelle, unite } = searchServiceDto;
    
    const query = {
      ...(reference && { reference: { $regex: reference, $options: 'i' } }),
      ...(libelle && { libelle: { $regex: libelle, $options: 'i' } }),
      ...(unite && { unite: { $regex: unite, $options: 'i' } }),
    };

    return this.serviceModel.find(query).exec();
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
