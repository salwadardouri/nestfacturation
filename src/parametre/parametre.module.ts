import { Module } from '@nestjs/common';
import { ParametreService } from './parametre.service';
import { Parametre, ParametreSchema } from 'src/schemas/parametre.schema'; 
import { MongooseModule } from '@nestjs/mongoose';
import { ParametreController } from './parametre.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Parametre.name, schema: ParametreSchema }]),
    
  ],
  
  controllers: [ParametreController],
  providers: [ParametreService]
})
export class ParametreModule {}
