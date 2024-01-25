import {Alert, PermissionsAndroid} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Route from './src/routes/route';
import messaging from '@react-native-firebase/messaging';
import {getAccessToken} from './src/helpers/function/generateToken';
import {enableLatestRenderer} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Auth from '@react-native-firebase/auth';
import {getUser} from './src/helpers/function/getUser';
import {connection} from './src/helpers/config/db';

Geolocation.setRNConfiguration({
  skipPermissionRequests: true,
  authorizationLevel: 'always',
  enableBackgroundLocationUpdates: true,
  locationProvider: 'auto',
});

enableLatestRenderer();

export default function App() {
  const registerFCM = useCallback(async () => {
    await messaging().registerDeviceForRemoteMessages();
  }, []);

  useEffect(() => {
    registerFCM();

    PermissionsAndroid.request('android.permission.POST_NOTIFICATIONS');
    PermissionsAndroid.request('android.permission.ACCESS_FINE_LOCATION');
  }, [registerFCM]);

  return (
    <NavigationContainer>
      <Route />
    </NavigationContainer>
  );
}
