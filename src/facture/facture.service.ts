import { Injectable, NotFoundException,ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Facture, FactureDocument } from '../schemas/facture.schema';
import { FactureDto } from './dto/facture.dto';
import * as numberToWords from 'number-to-words';
import { Client, ClientDocument} from 'src/schemas/clients.schema';
import { Tva, TvaDocument} from 'src/schemas/tva.schema';
import { Timbre, TimbreDocument} from 'src/schemas/timbre.schema';

import { Service, ServiceDocument } from 'src/schemas/services.schema'; // Add this import


@Injectable()
export class FactureService {

  constructor(
    @InjectModel(Facture.name) private factureModel: Model<FactureDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    @InjectModel(Tva.name) private tvaModel: Model<TvaDocument>,
    @InjectModel(Timbre.name) private timbreModel: Model<TimbreDocument>,
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,

  ) {}
  private async generateUniqueNumFact(): Promise<string> {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    
    // Trouver la dernière facture pour le mois et l'année courants
    const lastFacture = await this.factureModel
      .findOne({ Num_Fact: new RegExp(`^${year}${month}`) })
      .sort({ Num_Fact: -1 });

    let lastSequenceNumber = 0;

    if (lastFacture) {  
      const lastNumFact = String(lastFacture.Num_Fact); 
      lastSequenceNumber = parseInt(lastNumFact.slice(-4), 10);
      
    }

    const newSequenceNumber = (lastSequenceNumber + 1).toString().padStart(4, '0');
    const uniqueNum = `${year}${month}${newSequenceNumber}`;

    return uniqueNum;
  }
  async create(factureDto: FactureDto): Promise<Facture> {
    const { remise,  quantite, montant_TTC, tvaId, montant_HT, unite,serviceId,  timbreId } = factureDto;

    // Vérifie si le client existe
    const client = await this.clientModel.findById(factureDto.clientId);
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    // Vérifie si le service existe
    const service = await this.serviceModel.findById(serviceId);
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Vérifie si la TVA existe
    const tva = await this.tvaModel.findById(tvaId);
    if (!tva) {
      throw new NotFoundException('TVA not found');
    }

    // Vérifie si le timbre existe, sinon prend une valeur par défaut de 0
    const timbre = timbreId ? await this.timbreModel.findById(timbreId) : null;
    if (timbreId && !timbre) {
      throw new NotFoundException('Timbre not found');
    }
    const Num_Fact = await this.generateUniqueNumFact();
 
    const montant_HT_Lettre = numberToWords.toWords(montant_HT);


    const newFacture = new this.factureModel({
      Date_Fact: new Date(), // Génère automatiquement la date actuelle
      Num_Fact,
      montant_HT_Lettre,
      quantite,
      unite,
      montant_TTC,
      remise,
      montant_HT,
      service: serviceId,
      client: client._id,
      tva: tvaId,
      timbre: timbreId,
    });

    return await newFacture.save();
  }

  async delete(id: string): Promise<boolean> {
    const deletedService = await this.factureModel.findByIdAndDelete(id).exec();
    return !!deletedService;
  }
  async findAll(): Promise<FactureDto[]> {
    const facture = await this.factureModel.find().populate('client').populate('tva').populate('timbre').populate('service').exec();
    return facture.map(facture => facture.toObject());
  }
}
