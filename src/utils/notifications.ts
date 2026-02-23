import * as Notifications from 'expo-notifications';
import i18n from '@/src/i18n';
import type { Cat } from '@/src/supabase/types';

// Show notifications even when app is in foreground (useful for dev testing)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Android notification channel
if (process.env.EXPO_OS === 'android') {
  Notifications.setNotificationChannelAsync('play-reminders', {
    name: i18n.t('notifications.playReminders'),
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
  });
}

const REMINDER_MESSAGES = [
  (name: string) => i18n.t('notifications.reminder1', { name }),
  (name: string) => i18n.t('notifications.reminder2', { name }),
  (name: string) => i18n.t('notifications.reminder3', { name }),
  (name: string) => i18n.t('notifications.reminder4', { name }),
];

export async function getNotificationPermissionStatus(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReminders(cats: Cat[]) {
  // Cancel all existing before rescheduling
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (cats.length === 0) return;

  const now = new Date();

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const triggerDate = new Date(now);
    triggerDate.setDate(triggerDate.getDate() + dayOffset);
    triggerDate.setHours(19, 30, 0, 0); // 7:30 PM

    // Skip if this time is already past
    if (triggerDate <= now) continue;

    for (const cat of cats) {
      const messageFn =
        REMINDER_MESSAGES[(dayOffset + cats.indexOf(cat)) % REMINDER_MESSAGES.length];

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `\u{1F431} ${i18n.t('notifications.playtimeReminder')}`,
          body: messageFn(cat.name),
          sound: 'default',
          ...(process.env.EXPO_OS === 'android' && {
            channelId: 'play-reminders',
          }),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
        },
      });
    }
  }
}

export async function cancelAllReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function sendTestNotification() {
  const messages = [
    i18n.t('notifications.test1'),
    i18n.t('notifications.test2'),
    i18n.t('notifications.test3'),
    i18n.t('notifications.test4'),
  ];
  const body = messages[Math.floor(Math.random() * messages.length)];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `\u{1F431} ${i18n.t('notifications.playtimeReminder')}`,
      body,
      sound: 'default',
      ...(process.env.EXPO_OS === 'android' && {
        channelId: 'play-reminders',
      }),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 3,
    },
  });
}
