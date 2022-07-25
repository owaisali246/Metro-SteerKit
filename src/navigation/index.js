import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from '../screens/MainScreen'
import LoginScreen from '../screens/LoginScreen';



const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="MainScreen" component={MainScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation