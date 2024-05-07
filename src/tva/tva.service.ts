import { Injectable, ConflictException,InternalServerErrorException,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tva, TvaDocument } from 'src/schemas/tva.schema';
import { TvaDto } from './dto/tva.dto';


@Injectable()
export class TvaService {
    constructor(
        @InjectModel(Tva.name)
        private tvaModel: Model<TvaDocument>,
      ) {}
    
      async create(tvaDto: TvaDto): Promise<Tva> {
        let { Pourcent_TVA} = tvaDto;
  // Nettoyer les espaces autour de Pourcent_TVA et vérifier le signe %
  const cleanedPourcentTVA = Pourcent_TVA.trim();  // Supprime les espaces avant et après
  const pourcentTVAString = cleanedPourcentTVA.endsWith('%')
                              ? cleanedPourcentTVA
                              : `${cleanedPourcentTVA}%`;
     
        // Vérifier si la tva existe déjà
        const existingTva = await this.tvaModel.findOne({ Pourcent_TVA  }).exec();
        if (existingTva) {
          throw new ConflictException('Duplicate Tva entered');
        }
    
      
        // Créez l'objet avec le pourcentage formaté
        const createdTva = new this.tvaModel({
          ...tvaDto,
          Pourcent_TVA: pourcentTVAString
        });
        return createdTva.save();
      } catch (error) {
        if (error instanceof ConflictException) {
          throw error;
        }
        throw new InternalServerErrorException('Failed to create TVA');
      }
    
    
      async findAll() {
        return this.tvaModel.find();
      }
      
  async update(id: string, tvaDto: TvaDto): Promise<Tva> {
    const updatedTva = await this.tvaModel.findByIdAndUpdate(id, tvaDto, { new: true }).exec();
    if (!updatedTva) {
      throw new NotFoundException(`TVA not found`);
    }
    return updatedTva;
  }

  async delete(id: string): Promise<boolean> {
    const deletedTva = await this.tvaModel.findByIdAndDelete(id).exec();
    return !!deletedTva;
  }

  // // Méthode pour rechercher des TVA par titre ou pourcentage
  // async search(query: { title?: string; percent?: string }): Promise<Tva[]> {
  //   const { title, percent } = query;
  //   const searchCriteria: any = {};

  //   if (title) {
  //     searchCriteria['Titre_TVA'] = { $regex: title, $options: 'i' }; // Recherche insensible à la casse
  //   }

  //   if (percent) {
  //     searchCriteria['Pourcent_TVA'] = { $regex: percent, $options: 'i' };
  //   }

  //   return this.tvaModel.find(searchCriteria).exec();
  // }
  async Search(key: string): Promise<any> {
    const keyword = key
      ? {
          $or: [
            { Pourcent_TVA: { $regex: key, $options: 'i' } },
          ],
        }
      : {};

    try {
      const results = await this.tvaModel.find(keyword);
      return results.length > 0 ? results : [];
    } catch (error) {
      throw new Error('An error occurred while searching');
    }
  }
}
    

