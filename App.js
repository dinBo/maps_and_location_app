import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Platform, Text, View, StyleSheet, Alert } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';

import * as Location from 'expo-location';

export default function App() {
  const [region, setRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markers, setMarkers] = useState([
    {
      id: 1,
      coordinate: {
        latitude: 44.8164652,
        longitude: 20.4552038,
      },
      title: "Park vojvode Vuka",
      description: "Cute park near the city center",
    },
    {
      id: 2,
      coordinate: {
        latitude: 44.81325584238805,
        longitude: 20.434576734377796,
      },
      title: "Hyatt Regency Belgrade",
      description: "One of the most prestigious hotels in Belgrade",
    },
  ]);
  const [userLocation, setuserLocation] = useState(null);

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const reg = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setRegion(reg);
    })();
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     // setRegion(reg => ({
  //     //   latitude: reg.latitude + 0.0001,
  //     //   longitude: reg.longitude + 0.0001,
  //     //   latitudeDelta: 0.005,
  //     //   longitudeDelta: 0.005,
  //     // }))
  //     setMarkers(reg => ({
  //       latitude: reg.latitude + 0.0001,
  //       longitude: reg.longitude + 0.0001,
  //       latitudeDelta: 0.005,
  //       longitudeDelta: 0.005,
  //     }))
  //   }, 2000);
  // }, []);

  useEffect(() => {
    if (!userLocation || !markers) {
      return;
    }

    // const latitudeDistance = Math.abs(userLocation.latitude - markers.latitude);
    // const longitudeDistance = Math.abs(userLocation.longitude - markers.longitude);
    // if (latitudeDistance <= 0.001 && longitudeDistance <= 0.001) {
    //   Alert.alert("You're here!!")
    // }

    markers.map(marker => {
      const latitudeDistance = Math.abs(userLocation.latitude - marker.coordinate.latitude);
      const longitudeDistance = Math.abs(userLocation.longitude - marker.coordinate.longitude);
      if (latitudeDistance <= 0.001 && longitudeDistance <= 0.001) {
        Alert.alert(`You're at the ${marker.title}`);
      }
    })
  }, [userLocation])

  const handleUserLocationChanged = ({ nativeEvent }) => {
    const coordinate = nativeEvent.coordinate
    // console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^");
    // console.log(nativeEvent);
    // console.log(coordinate.latitude);
    // console.log(coordinate.longitude);
    // console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^");
    setuserLocation({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
  }

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (region) {
    text = JSON.stringify(region);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.region}>{text}</Text>
      <MapView
        showsUserLocation={true}
        // followsUserLocation={true}
        // onUserLocationChange={locationChangedResult => handleUserLocationChanged(locationChangedResult)}
        onUserLocationChange={handleUserLocationChanged}
        style={styles.map}
        region={region}
      >
        {
          markers.map(marker => (
            <Marker
                key={marker.key}
                coordinate={marker.coordinate}
                title={marker.title}
                description={marker.description}
             />
          ))
        }
      {/* <Marker
          coordinate={markers}
          title={"Park vojvode Vuka"}
          description={"Cute park near the city center"}
       /> */}
       {/* <MapViewDirections
          origin={{
            latitude: region?.latitude,
            longitude: region?.longitude,
          }}
          destination={markers}
          apikey="YOUR_GOOGLE_MAPS_API_KEY_HERE"
          strokeWidth={4}
          strokeColor="red"
        /> */}
       </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  region: {
    width: '100%',
    height: '20%',
  },
  map: {
    width: '100%',
    height: '80%',
  },
});
