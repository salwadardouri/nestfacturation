// categories.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Categories, CategoriesSchema } from 'src/schemas/categories.schema';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Categories.name, schema: CategoriesSchema }])],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
