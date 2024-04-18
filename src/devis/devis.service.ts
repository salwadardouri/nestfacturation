import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Devis, DevisDocument } from 'src/schemas/devis.schema';
import { DevisDto } from './dto/devis.dto';
import { Client, ClientDocument } from 'src/schemas/clients.schema';
import { ClientDto } from 'src/clients/dto/clients.dto';


@Injectable()
export class DevisService {
  constructor(
    @InjectModel(Devis.name) private devisModel: Model<DevisDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
  ) {}

  async create(createDevisDto: DevisDto): Promise<Devis> {
    const createdDevis = new this.devisModel(createDevisDto);

    // Vérifie si le client existe
    const clientExists = await this.clientModel.exists({
      _id: createDevisDto.clientId,
    });

    if (!clientExists) {
      throw new Error('Client not found');
    }

    // Récupère le client à partir de l'ID
    const client = await this.clientModel.findById(createDevisDto.clientId);

    // Associe le devis au client
    createdDevis.client = client;

    return createdDevis.save();
  }

    async findAll(): Promise<DevisDto[]> {
    const devis = await this.devisModel.find().populate('client').exec();
    return devis.map(devis => devis.toObject());
  }

  async findOne(id: string): Promise<DevisDto> {
    const devis = await this.devisModel.findById(id).populate('client').exec();
    return devis ? devis.toObject() : null;
  }


  async update(id: string, updateDevisDto: DevisDto): Promise<DevisDto> {
    const devis = await this.devisModel.findByIdAndUpdate(id, updateDevisDto, { new: true }).populate('client').exec();
    return devis ? devis.toObject() : null;
  }

  async findByClientId(clientId: string): Promise<{ client: ClientDto, devis: DevisDto[] }> {
    const client = await this.clientModel.findById(clientId).exec();
    const devis = await this.devisModel.find({ client: clientId }).exec();
    return { client: client ? client.toObject() : null, devis: devis ? devis.map(d => d.toObject()) : [] };
  }

  async search(query: string): Promise<DevisDto[]> {
    const regex = new RegExp(query, 'i');
    const devis = await this.devisModel.find({ Date_Envoi: regex }).populate('client').exec();
    return devis.map(devis => devis.toObject());
  }
}
