import {View, Text, Button, Alert} from 'react-native';
import React, {useState} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import Loading from '../../components/loading';

export default function Otp({route}) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const validateOtp = async () => {
    try {
      setLoading(true);
      if (route) {
        const isVallidOtp = await route.params.confirm.confirm(code);
        console.log(isVallidOtp);
      }
    } catch (error) {
      const isOtpNotValid = error.message.includes(
        'Please check and enter the correct verification code again',
      );

      if (isOtpNotValid) {
        Alert.alert('Otp Salah !!!');
      } else {
        Alert.alert('Server Down, atau koneksi terputus');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View>
      <Text>Otp</Text>
      <TextInput placeholder="OTP" onChangeText={text => setCode(text)} />

      <Button title="Validate OTP" onPress={validateOtp} />
    </View>
  );
}
