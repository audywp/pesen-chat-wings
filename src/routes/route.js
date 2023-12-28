import {View, Text} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function route() {
  return (
    <View>
      <Text>route</Text>
    </View>
  );
}
