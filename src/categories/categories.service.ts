// categories.service.ts
import { Injectable, ConflictException,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categories, CategoriesDocument } from 'src/schemas/categories.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ActivatedCategoriesDto } from './dto/activatedCategories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Categories.name)
    private categoriesModel: Model<CategoriesDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Categories> {
    const { Titre_Categorie, Description_Categorie } = createCategoryDto;
  
    // Ajouter la valeur de status à true dans l'objet createCategoryDto
    const postData = {
      ...createCategoryDto,
      status: true,
    };
  
    // Vérifier si la catégorie existe déjà
    const existingCategory = await this.categoriesModel.findOne({ Titre_Categorie, Description_Categorie, status: true }).exec();
    if (existingCategory) {
      throw new ConflictException('Duplicate category entered');
    }
  
    const createdCategory = new this.categoriesModel(postData);
    return createdCategory.save();
  }
  
  async activatedCategories(id: string, activatedCategoriesDto: ActivatedCategoriesDto): Promise<any> {
    const categories = await this.categoriesModel.findById(id);
    if (!categories) {
      throw new NotFoundException(`categorie not found`);
    }
  
    categories.status = activatedCategoriesDto.status;
  
    return await categories.save();
  }
  
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
