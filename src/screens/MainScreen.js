import { useNavigation, useRoute } from '@react-navigation/native';
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
import { LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

var timer;

const MainScreen = () => {
    const [currentLongitude, setCurrentLongitude] = useState(0.0000);
    const [currentLatitude, setCurrentLatitude] = useState(0.0000);
    const [locationStatus, setLocationStatus] = useState('');
    const navigation = useNavigation();
    const { width, height } = useWindowDimensions();
    const route = useRoute();
    const driver_id = route.params.driver;
    const clearDetails = route.params.clearDetails;
    const setLogin = route.params.setLogin;

    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
    ]);


    const onLogout = () => {
        clearInterval(timer);
        setLocationStatus("Location Sharing Stopped!");
        send_coords(0, 0);
        navigation.navigate('LoginScreen');
        clearDetails();
        AsyncStorage.setItem('LoggedIn', 'true')
        setLogin('')

    }

    const LogoutAlert = () =>
        Alert.alert(
            "Logout Alert",
            "Are you sure you want to Logout?",
            [
                {
                    text: "Cancel",
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
                        getLocation();
                    } else {
                        setLocationStatus('Permission Denied');
                    }
                } catch (err) {
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
            driver_id: driver_id,
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
                console.log(position.coords.latitude.toFixed(5), position.coords.longitude.toFixed(5), driver_id);
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
        timer = setInterval(getLocation, 3000);
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
                        </View>
                        <View style={{ marginTop: 15 }}>
                            <TouchableOpacity onPress={stop_sharing_loc} style={[styles.button2, styles.elevation, { width: width * 0.8 }]}>
                                <Text style={styles.btntext}>Stop Location Sharing</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 60 }}>
                            <TouchableOpacity onPress={LogoutAlert} style={[styles.button2, styles.elevation, { width: width * 0.8 }]}>
                                <Text style={styles.btntext}>Logout</Text>
                            </TouchableOpacity>
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
