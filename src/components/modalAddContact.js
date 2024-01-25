import {
  Text,
  StyleSheet,
  View,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {Button, Overlay} from '@rneui/base';

export default function ModalAddContact({
  visible,
  toggleOverlay,
  onChangeText,
  handleAddContact,
  modalLoading,
}) {
  return (
    <Overlay
      overlayStyle={{backgroundColor: 'white'}}
      isVisible={visible}
      onBackdropPress={toggleOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.textPrimary}>Find Your Friends!</Text>
        <TextInput
          onChangeText={onChangeText}
          style={styles.findFriendInput}
          placeholder="Input Phone Number"
        />
        {modalLoading ? (
          <ActivityIndicator color={'blue'} size={40} />
        ) : (
          <Button title="Add Friend" onPress={handleAddContact} />
        )}
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 10,
  },
  modalContainer: {
    width: '80%',
    paddingVertical: '10%',
  },
  textPrimary: {
    marginVertical: 20,
    textAlign: 'center',
    fontSize: 20,
  },
  textSecondary: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 17,
  },
  findFriendInput: {
    padding: 8,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    marginBottom: 20,
  },
});
