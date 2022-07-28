import { StyleSheet, SafeAreaView, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './src/screens/MainScreen'
import LoginScreen from './src/screens/LoginScreen';
import MapScreen from './src/screens/MapScreen';


const Stack = createNativeStackNavigator();



const App = () => {

  return (

    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="MainScreen" component={MainScreen} />
        {/* <Stack.Screen name="MapScreen" component={MapScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>

  )
}

export default App;










