import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Image,
    PermissionsAndroid,
    Platform,
    useWindowDimensions,
    Alert,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Marker from '../Assets/Marker.png'

var timer;

const MainScreen = (props) => {
    const [currentLongitude, setCurrentLongitude] = useState(0.0000);
    const [currentLatitude, setCurrentLatitude] = useState(0.0000);
    const [locationStatus, setLocationStatus] = useState('');
    const navigation = useNavigation();
    const { width, height } = useWindowDimensions();


    const onLogout = () => {
        navigation.navigate('LoginScreen');
    }

    const LogoutAlert = () =>
        Alert.alert(
            "Logout Alert",
            "Are you sure you want to Logout?",
            [
                {
                    text: "Cancel",
                    // onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: onLogout }
            ]
        );


    useEffect(() => {
        setLocationStatus('You are Here');
        const requestLocationPermission = async () => {
            if (Platform.OS === 'ios') {
                getLocation();
                // subscribeLocationLocation();
            }
            else {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: 'Location Access Required',
                            message: 'This App needs to Access your location',
                        }
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        // console.log('permission given')
                        getLocation();
                        // subscribeLocationLocation();
                    } else {
                        // console.log('permission denied')
                        setLocationStatus('Permission Denied');
                    }
                } catch (err) {
                    // console.log('warning error')
                    alert('Error' + err)
                }
            }
        };
        requestLocationPermission();
    }, []);

    function send_coords(latitude, longitude) {
        // var api = "http://192.168.18.16/php_program/send_coords.php"
        var api = "https://rapidtracking.000webhostapp.com/send_coords.php"
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application.json'
        };

        var data = {
            latitude: latitude,
            longitude: longitude
        };

        fetch(api, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        }).catch((error) => {
            alert('Error' + error);
        })

    }

    const getLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                console.log(position.coords.latitude.toFixed(5), position.coords.longitude.toFixed(5));
                setCurrentLongitude(position.coords.longitude.toFixed(5));
                setCurrentLatitude(position.coords.latitude.toFixed(5));
                send_coords(currentLatitude, currentLongitude);
            },
            (error) => {
                setLocationStatus(error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };


    function share_location() {
        timer = setInterval(getLocation, 5000);
        setLocationStatus("Sharing Location...")
    }
    function stop_sharing_loc() {
        clearInterval(timer);
        setLocationStatus("Location Sharing Stopped!");
        send_coords(0, 0);
    }

    return (
        <ScrollView>
            <SafeAreaView style={{ flex: 1, height: height }}>
                <View style={styles.container}>
                    <View style={styles.container}>
                        <Image
                            source={Marker}
                            style={{ width: 150, height: 150 }}
                        />
                        <Text style={styles.boldText}>{locationStatus}</Text>
                        <Text style={styles.locationText}>
                            Longitude: {currentLongitude}
                        </Text>
                        <Text style={styles.locationText}>
                            Latitude: {currentLatitude}
                        </Text>
                        <View style={{ marginTop: 40 }}>
                            <TouchableOpacity onPress={share_location} style={[styles.button1, styles.elevation, { width: width * 0.8 }]}>
                                <Text style={styles.btntext}>Start Location Sharing</Text>
                            </TouchableOpacity>
                            {/* <Button color='#03fe86' title="Start Location Sharing" onPress={share_location} /> */}
                        </View>
                        <View style={{ marginTop: 15 }}>
                            <TouchableOpacity onPress={stop_sharing_loc} style={[styles.button2, styles.elevation, { width: width * 0.8 }]}>
                                <Text style={styles.btntext}>Stop Location Sharing</Text>
                            </TouchableOpacity>
                            {/* <Button color={'red'} title="Stop Location Sharing" onPress={stop_sharing_loc} /> */}
                        </View>
                        <View style={{ marginTop: 60 }}>
                            <TouchableOpacity onPress={LogoutAlert} style={[styles.button2, styles.elevation, { width: width * 0.8 }]}>
                                <Text style={styles.btntext}>Logout</Text>
                            </TouchableOpacity>
                            {/* <Button color={'red'} title="Stop Location Sharing" onPress={stop_sharing_loc} /> */}
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#01091c',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    boldText: {
        fontSize: 26,
        color: '#03fe86',
        marginVertical: 16,
        fontWeight: "bold",
        textShadowColor: 'rgba(1, 220, 129, 0.5)',
        textShadowOffset: { width: -1, height: 2 },
        textShadowRadius: 10,
    },
    button1: {
        padding: 12,
        borderRadius: 20,
        backgroundColor: 'rgb(1, 215, 129)',
    },
    button2: {
        padding: 12,
        borderRadius: 20,
        backgroundColor: 'red',
    },
    btntext: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'

    },
    elevation: {
        shadowColor: '#000000',
        elevation: 10,
    },
    locationText: {
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        marginTop: 16,
        fontSize: 20,
        fontWeight: 'bold',
        textShadowColor: 'rgba(255, 255, 255, 0.4)',
        textShadowOffset: { width: -1, height: 2 },
        textShadowRadius: 10,
    }
});

export default MainScreen;
