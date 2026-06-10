import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications() {
  console.log(Device, 'DEVICE');
  //   if (!Device.isDevice) {
  //     throw new Error('Must use physical device');
  //   }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  console.log(existingStatus, 'STATUS');

  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();

    console.log(status, 'STATUS1');

    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    throw new Error('Notification permission denied');
  }

  const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
  console.log(projectId, 'PROJECT ID');

  const token = await Notifications.getExpoPushTokenAsync({
    projectId: 'ae4a8bbe-f7b0-48a3-88a1-75f1e6c7ea6c',
  });
  console.log('Expo Push Token:', token);

  return token.data;
}
