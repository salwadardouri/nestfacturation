import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { Devise, DeviseDocument } from 'src/schemas/devise.schema';
  import { DeviseDto } from './dto/devise.dto';
  
  @Injectable()
  export class DeviseService {
    constructor(
      @InjectModel(Devise.name)
      private deviseModel: Model<DeviseDocument>,
    ) {}
  
    async create(deviseDto: DeviseDto): Promise<Devise> {
      const { Nom_D, Symbole } = deviseDto; // Utilisation de `deviseDto`
  
      // Vérifier si la devise existe déjà
      const existingDevise = await this.deviseModel.findOne({ Nom_D, Symbole }).exec();
      if (existingDevise) {
        throw new ConflictException('Duplicate Devise entered');
      }
  
      const createdDevise = new this.deviseModel(deviseDto);
      return createdDevise.save();
    }
  
    async findAll() {
      return this.deviseModel.find().exec();
    }
  
    async update(id: string, deviseDto: DeviseDto): Promise<Devise> {
      const updatedDevise = await this.deviseModel.findByIdAndUpdate(id, deviseDto, {
        new: true,
      }).exec();
      if (!updatedDevise) {
        throw new NotFoundException('Devise not found');
      }
      return updatedDevise;
    }
  
    async delete(id: string): Promise<boolean> {
      const deletedDevise = await this.deviseModel.findByIdAndDelete(id).exec();
      return !!deletedDevise;
    }
  
    async search(key: string): Promise<Devise[]> {
      const keyword = key
        ? {
            $or: [
              { Nom_D: { $regex: key, $options: 'i' } },
              { Symbole: { $regex: key, $options: 'i' } },
            ],
          }
        : {};
  
      try {
        const results = await this.deviseModel.find(keyword).exec();
        return results;
      } catch (error) {
        throw new InternalServerErrorException('An error occurred while searching');
      }
    }
  }
  