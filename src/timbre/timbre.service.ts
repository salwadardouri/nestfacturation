import { Injectable, ConflictException } from '@nestjs/common';
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
    
}
