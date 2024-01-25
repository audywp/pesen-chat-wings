import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import React from 'react';

export default function Loading() {
  return (
    <View style={style.container}>
      <ActivityIndicator color={'blue'} size={40} />
      <Text style={style.text}>Please wait ...</Text>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    gap: 10,
  },
  text: {
    textAlign: 'center',
  },
});
