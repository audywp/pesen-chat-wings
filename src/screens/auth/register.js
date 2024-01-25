import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import {connection} from '../../helpers/config/db';
import {getUser} from '../../helpers/function/getUser';
import Loading from '../../components/loading';
import {useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import Geolocation from '@react-native-community/geolocation';

export default function Register() {
  const {navigate} = useNavigation();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const handleUser = (field, value) => {
    setUser({...user, [field]: value});
  };

  const pickImage = async type => {
    let asset = null;

    if (type === 'camera') {
      asset = await launchCamera({
        cameraType: 'front',
      });
    } else {
      asset = await launchImageLibrary({
        mediaType: 'photo',
      });
    }

    handleUser('photoURL', asset.assets[0].uri);
  };

  const backToLogin = () => {
    navigate('login');
  };

  const updateMyLocation = useCallback(async () => {
    Geolocation.getCurrentPosition(({coords}) => {
      connection.ref(`users/${user.phoneNumber}`).update({
        location: coords,
      });
    });
  }, [user.phoneNumber]);

  const handleRegister = async () => {
    try {
      setLoading(true);
      const FCMToken = await messaging().getToken();
      const checkUser = await getUser(user.phoneNumber);

      if (checkUser === null) {
        await storage()
          .ref(`${user.phoneNumber}_avatar`)
          .putFile(user.photoURL);
        const urlDownload = await storage()
          .ref(`${user.phoneNumber}_avatar`)
          .getDownloadURL();
        await connection
          .ref(`/users/${user.phoneNumber}`)
          .set({...user, FCMToken, photoURL: urlDownload});

        await updateMyLocation();

        Alert.alert(`${user.phoneNumber}, Berhasil di daftarkan`);
        backToLogin();
      } else {
        Alert.alert('user exist');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View>
      <TextInput
        onChangeText={text => handleUser('displayName', text)}
        placeholder="Full Name"
      />
      <TextInput
        onChangeText={text => handleUser('phoneNumber', text)}
        placeholder="Phone Number"
      />
      <Text>Choose Avatar</Text>
      <View>
        <TouchableOpacity onPress={() => pickImage('files')}>
          <Text>Choose Files</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => pickImage('camera')}>
          <Text>Open Camera</Text>
        </TouchableOpacity>
      </View>
      <Image
        source={{uri: user.photoURL}}
        width={200}
        height={200}
        resizeMode="contain"
      />

      <Button disabled={loading} onPress={handleRegister} title="Register" />
      <TouchableOpacity onPress={backToLogin}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
