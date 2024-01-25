import {View, Text, Button, TouchableOpacity, Alert} from 'react-native';
import React, {useState} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {getUser} from '../../helpers/function/getUser';
import Loading from '../../components/loading';

export default function Login() {
  const {navigate} = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const doLogin = async () => {
    try {
      setLoading(true);
      const user = await getUser(phoneNumber);
      console.log(user);

      if (user === null) {
        Alert.alert('User Tidak ditemukan, silahkan mendaftar');
      } else {
        const confirmations = await auth().signInWithPhoneNumber(phoneNumber);
        navigate('otp', {confirm: confirmations});
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
        placeholder="Phone Number"
        keyboardType="phone-pad"
        onChangeText={text => setPhoneNumber(text)}
      />

      <Button onPress={doLogin} title="Login" />
      <TouchableOpacity onPress={() => navigate('register')}>
        <Text>Register</Text>
      </TouchableOpacity>
    </View>
  );
}
