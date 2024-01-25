import {View, Text} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../../screens/auth/login';
import Register from '../../screens/auth/register';
import Otp from '../../screens/auth/otp';

const Stack = createStackNavigator();

export default function AuthRoute() {
  return (
    <Stack.Navigator
      initialRouteName="login"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="register" component={Register} />
      <Stack.Screen name="otp" component={Otp} />
    </Stack.Navigator>
  );
}
