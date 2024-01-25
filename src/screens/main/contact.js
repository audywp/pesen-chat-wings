import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Button} from '@rneui/base';
import ModalAddContact from '../../components/modalAddContact';
import {getUser} from '../../helpers/function/getUser';
import Auth from '@react-native-firebase/auth';
import {connection} from '../../helpers/config/db';
import Loading from '../../components/loading';
import {useNavigation} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';

export default function Contact() {
  const {navigate} = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  const myPhoneNumber = Auth().currentUser.phoneNumber;

  const getCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      const value = await getUser(myPhoneNumber);
      if (value) {
        setCurrentUser(value);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [myPhoneNumber]);

  const updateMyLocation = useCallback(async () => {
    Geolocation.watchPosition(({coords}) => {
      connection.ref(`users/${myPhoneNumber}`).update({
        location: coords,
      });
    });
  }, [myPhoneNumber]);

  useEffect(() => {
    getCurrentUser();
    updateMyLocation();
  }, [getCurrentUser, updateMyLocation]);

  const closeModalAddContact = () => {
    setVisible(false);
  };

  const handleAddContact = async () => {
    try {
      setModalLoading(true);
      const friend = await getUser(phoneNumber);

      if (phoneNumber === myPhoneNumber) {
        Alert.alert('Tidak bisa menambahkan diri sendiri!');
      } else {
        if (friend) {
          await connection.ref(`users/${myPhoneNumber}`).update({
            contact: {
              ...currentUser.contact,
              [friend.phoneNumber]: {...friend, contact: null},
            },
          });

          await connection.ref(`users/${friend.phoneNumber}`).update({
            contact: {
              ...friend.contact,
              [myPhoneNumber]: {...currentUser, contact: null},
            },
          });
        } else {
          Alert.alert('Contact Tidak di temukan!');
        }
      }

      await getCurrentUser();

      closeModalAddContact();
    } catch (error) {
      console.log(error);
    } finally {
      setModalLoading(false);
    }
  };

  const listContact = currentUser.contact
    ? Object.values(currentUser.contact)
    : [];

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={style.mainContainer}>
      <FlatList
        data={listContact}
        renderItem={({item}) => {
          return (
            <TouchableWithoutFeedback
              onPress={() =>
                navigate('chat', {selectedFriend: item.phoneNumber})
              }>
              <View style={style.cardContainer}>
                <View>
                  <Image source={{uri: item.photoURL}} width={80} height={80} />
                </View>
                <View style={style.information}>
                  <Text>{item.displayName}</Text>
                  <Text>{item.phoneNumber}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          );
        }}
      />
      <View style={style.addContact}>
        <Button onPress={() => setVisible(true)} title={'Add Contact'} />
      </View>
      <ModalAddContact
        onChangeText={text => setPhoneNumber(text)}
        visible={visible}
        toggleOverlay={closeModalAddContact}
        handleAddContact={handleAddContact}
        modalLoading={modalLoading}
      />
    </View>
  );
}

const style = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    elevation: 4,
    marginBottom: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 16,
  },
  mainContainer: {
    paddingHorizontal: '4%',
    paddingVertical: 20,
    flex: 1,
  },
  information: {
    alignSelf: 'center',
  },
  addContact: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    alignSelf: 'center',
  },
});
