import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  RepeatFrequency,
  TriggerType,
  TimestampTrigger,
} from '@notifee/react-native';

const CHANNEL_ID = 'daily-reminder';

export async function requestNotificationPermissions(): Promise<boolean> {
  const settings = await notifee.requestPermission();

  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Daily Reminder',
    importance: AndroidImportance.DEFAULT,
    vibration: true,
  });

  return (
    settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
    settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
  );
}

function nextTimestamp(hour: number, minute: number): number {
  const now = new Date();
  const next = new Date();
  next.setHours(hour, minute, 0, 0);
  if (next.getTime() <= now.getTime()) {
    next.setDate(next.getDate() + 1);
  }
  return next.getTime();
}

export async function scheduleDailyReminder(
  timeString: string,
  message: string,
): Promise<void> {
  await notifee.cancelAllNotifications();

  const [hourStr, minStr] = timeString.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minStr, 10);
  if (isNaN(hour) || isNaN(minute)) return;

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: nextTimestamp(hour, minute),
    repeatFrequency: RepeatFrequency.DAILY,
  };

  await notifee.createTriggerNotification(
    {
      title: 'Özüm üçün',
      body: message,
      android: {
        channelId: CHANNEL_ID,
        pressAction: {id: 'default'},
        smallIcon: 'ic_launcher',
      },
    },
    trigger,
  );
}

export async function cancelAllReminders(): Promise<void> {
  await notifee.cancelAllNotifications();
}
