// notification.controller.ts
import { Controller, Post, Body ,NotFoundException,Get,Param} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotifDto } from './dto/createNotif.dto';
import { Notification } from 'src/schemas/notification.schema';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly Service: NotificationService) {}

  @Post()
  async create(@Body() createNotificationDto: CreateNotifDto): Promise<Notification> {
    return this.Service.create(createNotificationDto);
  }
  @Get('/client/:clientId')
  async getNotificationsByClientId(@Param('clientId') clientId: string): Promise<Notification[]> {
    const notifications = await this.Service.findNotificationsByClientId(clientId);
    if (!notifications || notifications.length === 0) {
      throw new NotFoundException(`No notifications found for client with ID ${clientId}`);
    }
    return notifications;
  }
}
