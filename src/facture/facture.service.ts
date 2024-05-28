import { Injectable, NotFoundException,ConflictException ,BadRequestException} from '@nestjs/common';
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
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    @InjectModel(Tva.name) private tvaModel: Model<TvaDocument>,
    @InjectModel(Timbre.name) private timbreModel: Model<TimbreDocument>,

    

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
    const { montant_TTC,unite,serviceId,  timbreId } = factureDto;

    // Vérifie si le client existe
    const client = await this.clientModel.findById(factureDto.clientId);
    if (!client) {
      throw new NotFoundException('Client not found');
    }
  
    // Vérifie si les services existent
    const services = await this.serviceModel.find({ '_id': { $in: serviceId } });
    if (services.length !== serviceId.length) {
      throw new NotFoundException('One or more services not found');
    }
    // Vérifie si le timbre existe, sinon prend une valeur par défaut de 0
    const timbre = timbreId ? await this.timbreModel.findById(timbreId) : null;
    if (timbreId && !timbre) {
      throw new NotFoundException('Timbre not found');
    }
    const Num_Fact = await this.generateUniqueNumFact();
    const newFacture = new this.factureModel({
      Date_Fact: new Date(), 
      Num_Fact,
      unite,
      montant_TTC,
      services: serviceId,
      client: client._id,
      timbre: timbre ? timbre._id : null,
    });
    return await newFacture.save();
  }

  async delete(id: string): Promise<boolean> {
    const deletedService = await this.factureModel.findByIdAndDelete(id).exec();
    return !!deletedService;
  }
  async findAll(): Promise<FactureDto[]> {
    const factures = await this.factureModel
      .find()
      .populate('client')
      .populate({
        path: 'services',
        populate: [
          { path: 'tva', model: 'Tva' },
          { path: 'devise', model: 'Devise' },
          { path: 'categories', model: 'Categories' },
        ],
      })
      .populate('timbre')
   
      .exec();

    return factures.map(facture => facture.toObject());
  }


}
