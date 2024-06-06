import { Injectable ,HttpException, HttpStatus ,NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ParametreDto } from './dto/parametre.dto';
import { Parametre } from 'src/schemas/parametre.schema';
import * as crypto from 'crypto'; // Importez le module crypto
import { ActivatedParamDto } from './dto/activatedParam.dto';
@Injectable()
export class ParametreService {
  constructor(
    @InjectModel(Parametre.name) private readonly parametreModel: Model<Parametre>,
  ) {}

  // async create(body: ParametreDto) {
  //   const createdParametre = new this.parametreModel(body);
  //   return createdParametre.save();
  // }
  async create(parametreDto: ParametreDto) {
    try {
      // Vérifier si l'e-mail existe déjà dans la base de données
      const existingParametre = await this.parametreModel.findOne({ Email_S: parametreDto.Email_S });
      if (!existingParametre) {
        // Ajout du statut par défaut à true
        const createdParametre = new this.parametreModel({ 
          ...parametreDto, 
          status: true // Ajout du champ status ici
        });
        await createdParametre.save();
        return { message: 'Parametre created successfully', data: createdParametre };
      } else {
        throw new HttpException('Email already exists, please enter another email', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException('Failed to create parameter', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  async FindAll() {
    return this.parametreModel.find();
  }

  async FindOne(id: string) {
    return this.parametreModel.findOne({ _id: id });
  }



async update(id: string, parametreDto: ParametreDto): Promise<Parametre> {
  const updatedParametre = await this.parametreModel.findByIdAndUpdate(id, parametreDto, { new: true }).exec();
  if (!updatedParametre) {
    throw new NotFoundException(`Parametre not found`);
  }
  return updatedParametre;
}

  async delete(id: string): Promise<boolean> {
    const deletedParametre = await this.parametreModel.findByIdAndDelete(id).exec();
    return !!deletedParametre;
  }
  // async Search(key: string) {
  //   const keyword = key ? { $or: [{ nom_S: { $regex: key, $options: 'i' } }] } : {};
  //   return this.parametreModel.find(keyword);
  // }
  async Search(key: string): Promise<any> {
    const keyword = key
      ? {
          $or: [
            { Nom_S: { $regex: key, $options: 'i' } },
            { Email_S: { $regex: key, $options: 'i' } },
            { Paye_S: { $regex: key, $options: 'i' } },
            { Address_S: { $regex: key, $options: 'i' } },
            { Num_Phone_S: { $regex: key, $options: 'i' } },
            { Code_Postal_S: { $regex: key, $options: 'i' } },
            { Matricule_Fiscale_S: { $regex: key, $options: 'i' } },

          ],
        }
      : {};

    try {
      const results = await this.parametreModel.find(keyword);
      return results.length > 0 ? results : [];
    } catch (error) {
      throw new Error('An error occurred while searching');
    }
  }
  async activatedParam(id:  string, activatedParamDto: ActivatedParamDto): Promise<any> {
    const parameter = await this.parametreModel.findById(id);
    if (!parameter) {
      throw new NotFoundException(`param not found`);
    }
  
    parameter.status = activatedParamDto.status;
  
    return await parameter.save();
  }
  
}
