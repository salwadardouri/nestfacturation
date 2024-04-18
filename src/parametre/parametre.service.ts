import { Injectable ,HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ParametreDto } from './dto/parametre.dto';
import { Parametre } from 'src/schemas/parametre.schema';
import * as crypto from 'crypto'; // Importez le module crypto
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
      // Génération de la référence paramref
      const timestamp = Date.now();
      const randomPart = crypto.randomBytes(4).toString('hex'); 
      const ref = `${timestamp}-${randomPart}`;

      // Vérifier si l'e-mail existe déjà dans la base de données
      const existingParametre = await this.parametreModel.findOne({ Email_S: parametreDto.Email_S });
      if (!existingParametre) {
        // Création du parametre avec la référence paramref
        const createdParametre = new this.parametreModel({ ...parametreDto, ref });
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

  async Update(id: string, body: ParametreDto) {
    return this.parametreModel.findByIdAndUpdate(
      { _id: id },
      { $set: body },
      { new: true },
    );
  }

  async Search(key: string) {
    const keyword = key ? { $or: [{ nom_S: { $regex: key, $options: 'i' } }] } : {};
    return this.parametreModel.find(keyword);
  }
}
