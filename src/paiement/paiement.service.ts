import { Injectable ,NotFoundException,BadRequestException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Paiement, PaiementDocument } from 'src/schemas/paiement.schema';
import { Facture, FactureDocument } from 'src/schemas/facture.schema';
import { Client, ClientDocument } from 'src/schemas/clients.schema';
import { PaiementDto } from 'src/paiement/Dto/paiement.dto';
import { Echeance, EcheanceDocument } from 'src/schemas/echeance.schema';
import { EcheanceDto } from 'src/echeance/dto/echeance.dto';

@Injectable()
export class PaiementService {
  constructor(
    @InjectModel(Paiement.name) private paiementModel: Model<PaiementDocument>,
    @InjectModel(Echeance.name) private echeanceModel: Model<EcheanceDocument>,
    @InjectModel(Facture.name) private factureModel: Model<FactureDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
  ) {}
  async create(paiementDto: PaiementDto): Promise<any> {
    const { etatpaiement, montantPaye, typepaiement, datepaiement, factures } = paiementDto;
    let echeances: Echeance[] = [];

    try {
      // Si le type de paiement est "cheque", enregistrer les échéances
      if (typepaiement === 'cheque' && paiementDto.echeances) {
        echeances = await Promise.all(
          paiementDto.echeances.map(async (echeanceDto: EcheanceDto) => {
            const { numCheque, montantCheque, dateEcheance, dateCh } = echeanceDto;
            const createdEcheance = new this.echeanceModel({
              numCheque,
              montantCheque,
              dateEcheance,
              dateCh,
            });
            return createdEcheance.save();
          }),
        );
      }

      // Créer une nouvelle instance de paiement
      const createdPaiement = new this.paiementModel({
        factures,
        etatpaiement,
        montantPaye,
        typepaiement,
        datepaiement,
        echeances, // Assigner les échéances créées au paiement
      });

      // Enregistrer le paiement dans la base de données
      const savedPaiement = await createdPaiement.save();

      // Mettre à jour la facture avec l'ID du paiement créé
      const facture = await this.factureModel.findById(factures).exec();
      if (!facture) {
        throw new NotFoundException('Facture non trouvée');
      }
      facture.paiement.push(savedPaiement._id);
      await facture.save();

      // Charger les détails du client associé à la facture
      const client = await this.clientModel.findById(facture.client).exec();

      // Retourner le paiement créé avec les détails de la facture et du client
      return {
        ...savedPaiement.toObject(),
        factures: {
          ...facture.toObject(),
          client: client ? client.toObject() : null, // Inclure les détails complets du client si trouvé
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<Paiement[]> {
    try {
      const paiements = await this.paiementModel.find().exec();
      return paiements;
    } catch (error) {
      // Gérer les erreurs ici, par exemple en lançant une exception NotFoundException si aucun paiement n'est trouvé
      throw new NotFoundException('Aucun paiement trouvé');
    }
  }
  
}