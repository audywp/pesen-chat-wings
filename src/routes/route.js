import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AuthRoute from './auth';
import MainRoute from './main';
import Auth from '@react-native-firebase/auth';
import ChatRoom from '../screens/ChatRoom';
const Stack = createStackNavigator();

export default function Route() {
  const [routeName, setRouteName] = useState('auth');

  useEffect(() => {
    const listenAuth = Auth().onAuthStateChanged(user => {
      console.log(user, 'checkuser');
      if (user) {
        setRouteName('main');
      } else {
        setRouteName('auth');
      }
    });

    return () => listenAuth();
  }, [routeName]);

  return (
    <Stack.Navigator
      initialRouteName={'auth'}
      screenOptions={{headerShown: false}}>
      {routeName === 'main' ? (
        <Stack.Screen name="main" component={MainRoute} />
      ) : (
        <Stack.Screen name="auth" component={AuthRoute} />
      )}
      <Stack.Screen name="chat" component={ChatRoom} />
    </Stack.Navigator>
  );
}
