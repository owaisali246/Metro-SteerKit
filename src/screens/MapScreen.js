import { View, Text, StyleSheet } from 'react-native'
import React, { useRef } from 'react'
import MapView, { Marker } from 'react-native-maps';


const MapScreen = () => {

    // const mapRef = useRef();

    return (
        <View style={styles.container}>
            <MapView style={StyleSheet.absoluteFillObject}
                // ref={mapRef}
                initialRegion={{
                    latitude: 24.949,
                    longitude: 67.484,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: 400,
        height: 400,

    },
});

export default MapScreen