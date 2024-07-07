import { Injectable, ConflictException ,NotFoundException,InternalServerErrorException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types  } from 'mongoose';
import { Timbre, TimbreDocument } from 'src/schemas/timbre.schema';
import { Devise, DeviseDocument } from 'src/schemas/devise.schema';
import { TimbreDto } from './dto/timbre.dto';
import { DeviseDto } from 'src/devise/dto/devise.dto';
import { ActivatedTimbreDto } from './dto/activatedTimbre.dto';
import { SearchDto } from './dto/search.dto';
@Injectable()
export class TimbreService {
    constructor(
        @InjectModel(Timbre.name)
        private TimbreModel: Model<TimbreDocument>,
        @InjectModel(Devise.name)
        private DeviseModel: Model<DeviseDocument>,
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
        const {deviseId, ...timbreData } = timbreDto;
    
        const timbre = await this.TimbreModel.findById(id);
        if (!timbre) {
          throw new NotFoundException('timbre not found');
        }
    
        timbre.set({
          ...timbreData,
    
          devise: deviseId,
        });
    
        return await timbre.save();
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
  async search(searchDto: SearchDto): Promise<Timbre[]> {
    const { Valeur } = searchDto;
    
    const query = {
      ...(Valeur && { Valeur: { $regex: Valeur, $options: 'i' } }),

    };

    return this.TimbreModel.find(query).exec();
  }
}
