import { Injectable, ConflictException ,NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Timbre, TimbreDocument } from 'src/schemas/timbre.schema';
import { TimbreDto } from './dto/timbre.dto';


@Injectable()
export class TimbreService {
    constructor(
        @InjectModel(Timbre.name)
        private TimbreModel: Model<TimbreDocument>,
      ) {}
    
      async create(TimbreDto: TimbreDto): Promise<Timbre> {
        const { Valeur } = TimbreDto;
    
        // Vérifier si la catégorie existe déjà
        const existingTimbre = await this.TimbreModel.findOne({ Valeur }).exec();
        if (existingTimbre) {
          throw new ConflictException('Duplicate Timbre entered');
        }
    
        const createdTimbre = new this.TimbreModel(TimbreDto);
        return createdTimbre.save();
      }
    
      async findAll() {
        return this.TimbreModel.find();
      }
      async update(id: string, timbreDto: TimbreDto): Promise<Timbre> {
        const updatedTimbre = await this.TimbreModel.findByIdAndUpdate(id, timbreDto, { new: true }).exec();
        if (!updatedTimbre) {
          throw new NotFoundException(`Timbre not found`);
        }
        return updatedTimbre;
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
