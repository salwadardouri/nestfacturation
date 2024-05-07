// categories.service.ts
import { Injectable, ConflictException,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categories, CategoriesDocument } from 'src/schemas/categories.schema';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Categories.name)
    private categoriesModel: Model<CategoriesDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Categories> {
    const { Titre_Categorie ,Description_Categorie } = createCategoryDto;

    // Vérifier si la catégorie existe déjà
    const existingCategory = await this.categoriesModel.findOne({ Titre_Categorie,Description_Categorie }).exec();
    if (existingCategory) {
      throw new ConflictException('Duplicate category entered');
    }

    const createdCategory = new this.categoriesModel(createCategoryDto);
    return createdCategory.save();
  }
  // async findAll(): Promise<CreateCategoryDto[]> {
  //   const devis = await this.categoriesModel.find().populate('client').exec();
  //   return devis.map(devis => devis.toObject());
  // }
  async findAll() {
    return this.categoriesModel.find();
  }
  async update(id: string, categoryDto: CreateCategoryDto): Promise<Categories> {
    const updatedCategory = await this.categoriesModel.findByIdAndUpdate(id, categoryDto, { new: true }).exec();
    if (!updatedCategory) {
      throw new NotFoundException(`Category not found`);
    }
    return updatedCategory;
  }
  async delete(id: string): Promise<boolean> {
    const deletedCategory = await this.categoriesModel.findByIdAndDelete(id).exec();
    return !!deletedCategory;
  }
  async Search(key: string): Promise<any> {
    const keyword = key
      ? {
          $or: [
            { Titre_Categorie: { $regex: key, $options: 'i' } },
            { Description_Categorie: { $regex: key, $options: 'i' } },
          ],
        }
      : {};

    try {
      const results = await this.categoriesModel.find(keyword);
      return results.length > 0 ? results : [];
    } catch (error) {
      throw new Error('An error occurred while searching');
    }
  }
}
