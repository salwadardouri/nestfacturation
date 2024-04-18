import { Injectable, ConflictException } from '@nestjs/common';
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
        const { Pourcent_TVA } = tvaDto;
    
        // Vérifier si la catégorie existe déjà
        const existingTva = await this.tvaModel.findOne({ Pourcent_TVA }).exec();
        if (existingTva) {
          throw new ConflictException('Duplicate Tva entered');
        }
    
        const createdTva = new this.tvaModel(tvaDto);
        return createdTva.save();
      }
    
      async findAll() {
        return this.tvaModel.find();
      }
    
}
