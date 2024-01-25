import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {getUser} from '../../helpers/function/getUser';
import Auth from '@react-native-firebase/auth';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default () => {
  const [coords, setCoords] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });

  const [listFriends, setListFriends] = useState([]);

  const getMe = useCallback(async () => {
    const phoneNumber = Auth().currentUser.phoneNumber;
    const me = await getUser(phoneNumber);
    setListFriends(() => {
      return me ? Object.values(me.contact) : [];
    });
  }, []);

  useEffect(() => {
    Geolocation.getCurrentPosition(value => {
      setCoords(value.coords);
    });
    getMe();
  }, [getMe]);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        {listFriends.map((val, idx) => {
          return (
            <Marker
              key={idx}
              coordinate={{
                latitude: val?.location?.latitude,
                longitude: val?.location?.longitude,
              }}
              title={val.displayName}
            />
          );
        })}
      </MapView>
    </View>
  );
};
