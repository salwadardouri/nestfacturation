
import { Type } from 'class-transformer';
import { IsArray, IsMongoId,IsDate,IsNotEmpty,IsOptional,IsNumber,IsString } from 'class-validator';
import { ServiceFactDto } from 'src/services/dto/ServiceFact.dto';

export class UpdateFactureDto {

  total_TTC: number;


  Date_Echeance: Date;



  Date_Fact: Date;

  Etat_delais: string;
  Status_delais: string;
  comptant_Reception:number;
  nombre_jours_retard:number;

  Date_Jour_Actuel :Date;

  montant_Paye:number;


  montant_Restant:number;
}