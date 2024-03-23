import React from 'react';
import { View,Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapScreen = ({ route }) => {
    const { selectedLocation } = route.params;
  
    if (!selectedLocation) {
      // Handle case when selectedLocation is undefined
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No location data available</Text>
        </View>
      );
    }
  
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
          />
        </MapView>
      </View>
    );
  };
  

export default MapScreen;