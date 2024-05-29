import { Injectable, ConflictException ,NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types  } from 'mongoose';
import { Timbre, TimbreDocument } from 'src/schemas/timbre.schema';
import { TimbreDto } from './dto/timbre.dto';
import { Devise } from 'src/schemas/devise.schema';
import { ActivatedTimbreDto } from './dto/activatedTimbre.dto';

@Injectable()
export class TimbreService {
    constructor(
        @InjectModel(Timbre.name)
        private TimbreModel: Model<TimbreDocument>,
      ) {}
    
      async create(TimbreDto: TimbreDto): Promise<Timbre> {
        const { Valeur,  deviseId, } = TimbreDto;
    
        // Vérifier si la catégorie existe déjà
        const existingTimbre = await this.TimbreModel.findOne({ Valeur }).exec();
        if (existingTimbre) {
          throw new ConflictException('Duplicate Timbre entered');
        }

        const createdTimbre = new this.TimbreModel({
          Valeur,
          devise:deviseId,
    status:true,
    
        });
    
        return createdTimbre.save();
      }
    
      async findAll(): Promise<TimbreDto[]> {
        const timbre = await this.TimbreModel.find().populate('devise').exec();
        return timbre.map(timbre => timbre.toObject());
      }
      async update(id: string, timbreDto: TimbreDto): Promise<Timbre> {
        try {
          const objectId = new Types.ObjectId(id);
          
          // Trouvez le Timbre existant
          let updatedTimbre = await this.TimbreModel.findByIdAndUpdate(objectId, { Valeur: timbreDto.Valeur, deviseId: timbreDto.deviseId , status:timbreDto.status }, { new: true }).exec();
      
          if (!updatedTimbre) {
            throw new NotFoundException('Timbre not found');
          }
      
          // Enregistrez les modifications
          return updatedTimbre;
        } catch (error) {
          // Gérez les erreurs
          throw new NotFoundException('Timbre not found');
        }
      }
      async activatedTimbre(id: string, activatedTimbreDto: ActivatedTimbreDto): Promise<any> {
        const timbre = await this.TimbreModel.findById(id);
        if (!timbre) {
          throw new NotFoundException(`timbre not found`);
        }
      
        timbre.status = activatedTimbreDto.status;
      
        return await timbre.save();
      }
      
    
  
      
      
  async delete(id: string): Promise<boolean> {
    const deletedTimbre = await this.TimbreModel.findByIdAndDelete(id).exec();
    return !!deletedTimbre;
  }
  async Search(key: string): Promise<any> {
    const keyword = key
      ? {
          $or: [
            { Valeur: { $regex: key, $options: 'i' } },
          ],
        }
      : {};

    try {
      const results = await this.TimbreModel.find(keyword);
      return results.length > 0 ? results : [];
    } catch (error) {
      throw new Error('An error occurred while searching');
    }
  }
}
