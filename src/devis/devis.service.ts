import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Devis, DevisDocument } from 'src/schemas/devis.schema';
import { DevisAjoutClientDto} from './dto/DevisAjoutClient.dto';
import { PatchDevisDto} from './dto/PatchDevis.dto';
import { Client, ClientDocument } from 'src/schemas/clients.schema';
import { ClientDto } from 'src/clients/dto/clients.dto';


@Injectable()
export class DevisService {
  constructor(
    @InjectModel(Devis.name) private devisModel: Model<DevisDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
  ) {}


  async updateDevis(id: string, patchDevisDto: PatchDevisDto): Promise<Devis> {
    const updatedDevis = await this.devisModel.findByIdAndUpdate(id, patchDevisDto, { new: true });
    if (!updatedDevis) {
      throw new NotFoundException(`Devis  not found`);
    }
    return updatedDevis;
  }
  async createDevis(createDevisDto: DevisAjoutClientDto): Promise<Devis> {
    const { clientId, libelle, categoriesId,deviseId, quantite, unite, commentaire } = createDevisDto;

    const newDevis = new this.devisModel({
      client: clientId,
      libelle,
      categories: categoriesId,
      devise: deviseId,
      quantite,
      unite,
      commentaire,
      etat:false,
      Date_Envoi: new Date(),  // Optionnel: définir la date d'envoi par défaut
    });

    return newDevis.save();
  }
    async findAll(): Promise<DevisAjoutClientDto[]> {
    const devis = await this.devisModel.find() .populate('client').populate('tva')
    .populate('devise')  .populate('categories')
  .populate('timbre').exec();
    return devis.map(devis => devis.toObject());
  }

  async findOne(id: string): Promise<DevisAjoutClientDto> {
    const devis = await this.devisModel.findById(id) .populate('client').populate('tva')
      .populate('devise')  .populate('categories')
    .populate('timbre')
 .exec();
    return devis ? devis.toObject() : null;
  }


  async update(id: string, updateDevisDto: DevisAjoutClientDto): Promise<DevisAjoutClientDto> {
    const devis = await this.devisModel.findByIdAndUpdate(id, updateDevisDto, { new: true }).populate('client').exec();
    return devis ? devis.toObject() : null;
  }

  async findByClientId(clientId: string): Promise<{ client: ClientDto, devis: DevisAjoutClientDto[] }> {
    const client = await this.clientModel.findById(clientId).exec();
    const devis = await this.devisModel.find({ client: clientId }).exec();
    return { client: client ? client.toObject() : null, devis: devis ? devis.map(d => d.toObject()) : [] };
  }

  async search(query: string): Promise<DevisAjoutClientDto[]> {
    const regex = new RegExp(query, 'i');
    const devis = await this.devisModel.find({ Date_Envoi: regex }).populate('client').exec();
    return devis.map(devis => devis.toObject());
  }
}
