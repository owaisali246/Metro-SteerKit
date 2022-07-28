import React, { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet, TextInput, useWindowDimensions, Alert, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import Marker from '../Assets/Marker.png'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'


const LoginScreen = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [DriverId, setDriverId] = useState(0);
    const navigation = useNavigation();
    const { width, height } = useWindowDimensions();
    const [DriverDetails, setDriverDetails] = useState([])
    const [Loggedin, setLoggedin] = useState('')

    useEffect(() => {
        // fetch('http://192.168.18.16/php_program/get_driver_details.php')
        fetch('https://rapidtracking.000webhostapp.com/get_driver_details.php')
            .then(Response => Response.json())
            .then(json => setDriverDetails(json))
        getLoggedIn();
        getDriverId();
        getUsername();

    }, [])

    const Ids = DriverDetails.map((driver) => parseInt(driver.driver_id));
    const Usernames = DriverDetails.map((driver) => driver.username);
    const Passwords = DriverDetails.map((driver) => driver.password);

    function clearDetails() {
        setDriverId(0);
        setUsername('');
        setPassword('');
    }

    const getLoggedIn = async () => {
        try {
            const data = await AsyncStorage.getItem('LoggedIn')
            setLoggedin(data);
        } catch (error) { }
    }
    const getDriverId = async () => {
        try {
            const data = await AsyncStorage.getItem('DriverId')
            setDriverId(parseInt(data));
        } catch (error) { }
    }
    const getUsername = async () => {
        try {
            const data = await AsyncStorage.getItem('Username')
            setUsername(data);
        } catch (error) { }
    }


    const onLogin = () => {

        if (DriverId === '' || !Ids.includes(parseInt(DriverId))) {
            Alert.alert("Invalid Driver Id", "You have entered an invalid Driver Id!",
                [{ text: "OK" }]);
        }
        else if (username === '' || !Usernames.includes(username)) {
            Alert.alert("Invalid Username", "You have entered an invalid username!",
                [{ text: "OK" }]);
        }
        else if (password === '' || !Passwords.includes(password)) {
            Alert.alert("Invalid Password", "You have entered an invalid Password!",
                [{ text: "OK" }]);
        }
        else if (DriverDetails[DriverId - 1].username === username && DriverDetails[DriverId - 1].password === password) {
            AsyncStorage.setItem('LoggedIn', 'true')
            AsyncStorage.setItem('DriverId', DriverId)
            AsyncStorage.setItem('Username', username)
            navigation.navigate('MainScreen', {
                driver: DriverId,
                clearDetails: clearDetails,
            });
        }
        else {
            Alert.alert("Invalid Detail", "You have entered an invalid detail!",
                [{ text: "OK" }]);
        }
    }

    const setLogin = (value) => {
        setLoggedin(value)
    }

    const nextPage = () => {
        navigation.navigate('MainScreen', {
            driver: DriverId,
            clearDetails: clearDetails,
            setLogin: setLogin,
        });
    }


    return (
        <ScrollView>
            <SafeAreaView>
                <View style={[styles.container, { width: width, height: height }]}>
                    <View>
                        <Image style={styles.logo} source={Marker}></Image>
                    </View>
                    {Loggedin != 'true' ?
                        <>
                            <View style={{ marginTop: height * 0.12 }}>
                                <TextInput value={DriverId} onChangeText={setDriverId} style={[styles.InputBox, { width: width * 0.8 }]} placeholder='Enter Driver Id' />
                            </View>
                            <View style={{ marginTop: height * 0.01 }}>
                                <TextInput value={username} onChangeText={setUsername} style={[styles.InputBox, { width: width * 0.8 }]} placeholder='Enter Username' />
                            </View>
                            <View style={{ marginTop: height * 0.01 }}>
                                <TextInput value={password} onChangeText={setPassword} secureTextEntry={true} style={[styles.InputBox, { width: width * 0.8 }]} placeholder='Enter Password' />
                            </View>
                            <View style={{ marginTop: height * 0.05 }}>
                                <TouchableOpacity onPress={onLogin} style={[styles.button2, { width: width * 0.8 }]} >
                                    <Text style={styles.btntext}>Login</Text>
                                </TouchableOpacity>
                            </View></> :
                        <>
                            <View style={{ marginTop: height * 0.05, marginBottom: 0.04 * height }}>
                                <Text style={[styles.boldText, { marginBottom: 0.06 * height, color: '#03fe86' }]}>You are already Logged in!</Text>
                                <Text style={styles.boldText}>Driver ID =  {DriverId}</Text>
                                <Text style={styles.boldText}>Username = {username}</Text>
                            </View>
                            <View style={{ marginTop: height * 0.05 }}>
                                <TouchableOpacity onPress={nextPage} style={[styles.button2, { width: width * 0.8 }]} >
                                    <Text style={styles.btntext}>Go to Tracking Page</Text>
                                </TouchableOpacity>
                            </View>
                        </>}
                </View>
            </SafeAreaView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#01091c',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    logo: {
        width: 150,
        height: 150,
    },

    InputBox: {
        backgroundColor: 'white',
        maxWidth: 400,
        color: 'black',
        fontSize: 18,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 7,
        textAlign: 'left',
    },

    btntext: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    button2: {
        paddingHorizontal: 20,
        maxWidth: 400,
        paddingVertical: 12,
        borderRadius: 20,
        backgroundColor: 'rgb(1, 215, 129)',
    },
    boldText: {
        textAlign: 'center',
        fontSize: 26,
        color: 'white',
        marginVertical: 2,
        fontWeight: "bold",
        textShadowColor: 'rgba(1, 220, 129, 0.5)',
        textShadowOffset: { width: -1, height: 2 },
        textShadowRadius: 10,
    },

})

export default LoginScreen