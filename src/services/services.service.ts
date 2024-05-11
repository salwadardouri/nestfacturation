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
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    @InjectModel(Tva.name) private readonly tvaModel: Model<TvaDocument>,
    @InjectModel(Categories.name) private readonly categoriesModel: Model<CategoriesDocument>,
    @InjectModel(Devise.name) private readonly deviseModel: Model<DeviseDocument>,

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
  async create(createServiceDto: ServicesDto): Promise<Service> {


    // Vérifie si le client existe
    const clientExists = await this.clientModel.exists({
      _id: createServiceDto.clientId,
    });
    if (!clientExists) {
      throw new NotFoundException('Client not found');
    }

    // Récupère le client à partir de l'ID
    const client = await this.clientModel.findById(createServiceDto.clientId);
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    
 // Génération du numéro de séquence
 const sequenceNumber = await this.generateSequenceNumber('services');

 // Génération du Ref unique
 const refS = `VST-S-${sequenceNumber.toString().padStart(4, '0')}`;
 

    // Crée un nouveau service avec les données du DTO
    const { libelle, quantite, prix_unitaire,montant_TTC, tvaId ,montant_HT,categoriesId,deviseId} = createServiceDto;
    const newService = new this.serviceModel({
      reference:refS,
      libelle,
      quantite,
      prix_unitaire,
      montant_HT,
      montant_TTC,
      client: client._id,
      tva: tvaId,
      categories:categoriesId,
      devise:deviseId,


    });

 

    // Enregistre le service dans la base de données
    return await newService.save();
  }

  async updateService(serviceId: string, updateServiceDto: ServicesDto): Promise<Service> {
    // Convert the service ID to ObjectId
    const objectId = new Types.ObjectId(serviceId);

    // Find the existing service
    const existingService = await this.serviceModel.findById(objectId);
    if (!existingService) {
      throw new NotFoundException('Service not found');
    }


    // Update other fields
    existingService.libelle = updateServiceDto.libelle;
    existingService.quantite = updateServiceDto.quantite;
    existingService.prix_unitaire = updateServiceDto.prix_unitaire;
    existingService.montant_HT = updateServiceDto.montant_HT;
    existingService.montant_TTC = updateServiceDto.montant_TTC;

    // Save the updated service
    return await existingService.save();
  }



  async delete(id: string): Promise<boolean> {
    const deletedService = await this.serviceModel.findByIdAndDelete(id).exec();
    return !!deletedService;
  }
  async findAll(): Promise<ServicesDto[]> {
    const services = await this.serviceModel.find().populate('client').populate('tva').populate('categories').populate('devise').exec();
    return services.map(service => service.toObject());
  }
}
