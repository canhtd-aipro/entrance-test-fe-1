import { NotificationEntity } from '../types/entities/notification.entity';

export const getNotificationData = (notification: NotificationEntity) => {
  const variables = notification.data satisfies { [key: string]: number | string | null | undefined };

  return { variables };
};
