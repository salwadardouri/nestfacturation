import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from '../schemas/services.schema';
import { ServicesDto } from './dto/services.dto';
import { Client, ClientDocument } from '../schemas/clients.schema';
import * as crypto from 'crypto';

import { Tva, TvaDocument } from '../schemas/tva.schema';


@Injectable()
export class ServicesService {
  private sequenceNumbers: { [key: string]: number } = {};
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,

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
    const { libelle, quantite, prix_unitaire, tvaId } = createServiceDto;
    const newService = new this.serviceModel({
      reference:refS,
      libelle,
      quantite,
      prix_unitaire,
      client: client._id,
      tva: tvaId,
      montant_HT: quantite * prix_unitaire

    });

 

    // Enregistre le service dans la base de données
    return await newService.save();
  }

 





  async findAll(): Promise<ServicesDto[]> {
    const services = await this.serviceModel.find().populate('client').populate('tva').exec();
    return services.map(service => service.toObject());
  }
}
