// notification.service.ts
import { Injectable , NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotifDto } from './dto/createNotif.dto';
import { Notification, NotificationDocument } from 'src/schemas/notification.schema';
import { Client, ClientDocument} from 'src/schemas/clients.schema';
@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
  ) {}

  async create(createNotificationDto: CreateNotifDto): Promise<Notification> {
    const { client: clientId, ...notificationData } = createNotificationDto;

    // Vérifier si le client existe
    const existingClient = await this.clientModel.findById(clientId);
    if (!existingClient) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    // Créer la notification
    const notification = new this.notificationModel({
      ...notificationData,
      client: existingClient._id, // Assurez-vous de stocker l'ID du client existant
    });

    await notification.save();

    // Mettre à jour les notifications du client
    await this.clientModel.findByIdAndUpdate(existingClient._id, {
      $push: { notifications: notification._id },
    });

    return notification;
  }
  async findNotificationsByClientId(clientId: string): Promise<Notification[]> {
    return this.notificationModel.find({ client: clientId }).exec();
  }
}
