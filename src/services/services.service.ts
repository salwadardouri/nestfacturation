import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from '../schemas/services.schema'; // Chemin corrigé
import { ServicesDto } from './dto/services.dto'; // Chemin corrigé
import { Client, ClientDocument } from '../schemas/clients.schema'; // Chemin corrigé
import * as crypto from 'crypto';
import { Tva, TvaDocument } from '../schemas/tva.schema';

@Injectable()
export class ServicesService {

  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    @InjectModel(Tva.name) private readonly tvaModel: Model<TvaDocument>
  ) {}

  async create(createServiceDto: ServicesDto): Promise<Service> {
    // Génération de la référence unique
    const timestamp = Date.now();
    const randomPart = crypto.randomBytes(4).toString('hex'); // Génère 8 caractères hexadécimaux
    const reference = `${timestamp}-${randomPart}`;

    // Récupère le pourcentage de TVA correspondant
    const tva = await this.tvaModel.findOne({ Pourcent_TVA: createServiceDto.tvaPourcent });
    if (!tva) {
        throw new Error('TVA not found');
    }

    // Conversion du pourcentage de TVA en nombre
    const pourcentTva = parseFloat(tva.Pourcent_TVA);

    // Calcul du montant hors taxes
    const montant_HT = createServiceDto.prix_unitaire * createServiceDto.quantite;

    // Calcule le montant TTC en ajoutant la TVA
    const montant_TTC = montant_HT * (1 + pourcentTva / 100);

    // Vérifie si le client existe
    const clientExists = await this.clientModel.exists({
        _id: createServiceDto.clientId,
    });
    if (!clientExists) {
        throw new Error('Client not found');
    }

    // Récupère le client à partir de l'ID
    const client = await this.clientModel.findById(createServiceDto.clientId);
    if (!client) {
        throw new Error('Client not found');
    }

    // Crée le service en incluant la TVA
    const createdService = new this.serviceModel({
        ...createServiceDto,
        reference,
        montant_HT,
        montant_TTC,
        client: client._id,
        tva: tva._id, // Assurez-vous que le champ "tva" dans votre schéma Service est configuré pour stocker l'ID de la TVA
    });

    // Enregistre le service créé dans la base de données
    return createdService.save();
}



  async findAll(): Promise<ServicesDto[]> {
    const services = await this.serviceModel.find().populate('client').exec();
    return services.map(service => service.toObject());
  }
}
