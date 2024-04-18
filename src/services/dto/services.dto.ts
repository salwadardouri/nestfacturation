export class ServicesDto {
  reference: string;
  libelle: string;
  quantite: number;
  prix_unitaire: number;
  clientId: string;
  serviceId: string; // Ajout de l'identifiant de la TVA
  tvaPourcent: string;
}
