import { Injectable, ConflictException,InternalServerErrorException,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tva, TvaDocument } from 'src/schemas/tva.schema';
import { TvaDto } from './dto/tva.dto';
import { ActivatedTvaDto } from './dto/activatedTva.dto';

@Injectable()
export class TvaService {
    constructor(
        @InjectModel(Tva.name)
        private tvaModel: Model<TvaDocument>,
      ) {}
        
      async create(tvaDto: TvaDto): Promise<Tva> {
        const { Pourcent_TVA } = tvaDto;
       // Vérifier si la tva existe déjà
       const existingTva = await this.tvaModel.findOne({ Pourcent_TVA  }).exec();
       if (existingTva) {
         throw new ConflictException('Duplicate Tva entered');
       }

       const createdTva = new this.tvaModel({ 
        ...tvaDto, 
        status: true // Ajout du champ status ici
      });

        return createdTva.save();
      } catch (error) {
        if (error instanceof ConflictException) {
          throw error;
        }
        throw new InternalServerErrorException('Failed to create TVA');
      }
      async activatedTva(id: string, activatedTvaDto: ActivatedTvaDto): Promise<any> {
        const tva = await this.tvaModel.findById(id);
        if (!tva) {
          throw new NotFoundException(`tva not found`);
        }
      
        tva.status = activatedTvaDto.status;
      
        return await tva.save();
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
    

