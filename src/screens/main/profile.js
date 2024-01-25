import {View, Text} from 'react-native';
import React from 'react';
import Auth from '@react-native-firebase/auth';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default function Profile() {
  const doLogout = async () => {
    await Auth().signOut();
  };
  return (
    <View>
      <Text>Profile</Text>

      <TouchableOpacity onPress={doLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
