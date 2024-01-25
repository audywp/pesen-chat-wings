import {View, Text} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Contact from '../../screens/main/contact';
import Profile from '../../screens/main/profile';
import Feed from '../../screens/main/feed';
import Location from '../../screens/main/location';

const BottomTab = createBottomTabNavigator();

export default function MainRoute() {
  return (
    <BottomTab.Navigator initialRouteName="contact">
      <BottomTab.Screen name="contact" component={Contact} />
      <BottomTab.Screen name="profile" component={Profile} />
      <BottomTab.Screen name="feed" component={Feed} />
      <BottomTab.Screen name="location" component={Location} />
    </BottomTab.Navigator>
  );
}
