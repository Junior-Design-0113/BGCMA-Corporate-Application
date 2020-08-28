import 'react-native-gesture-handler';
import React, {Component} from 'react';
import * as firebase from "firebase";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, StyleSheet, Text, View } from 'react-native';
import Login from './Components/Authentication/Login'
import Profile from './Components/User/Profile';
import Calendar from './Components/User/Calendar';
import Chat from './Components/User/Chat';
import Pages from './Components/User/Pages';
import Home from './Components/User/Home';
import Register from './Components/Authentication/Register'

const Stack = createStackNavigator();


class App extends Component {


  componentWillMount() {
    const firebaseConfig = {
      apiKey: "AIzaSyBxdS6aapWbOthR72uEFe_sJmn4vaQeN08",
      authDomain: "bgcma-corporate-portal.firebaseapp.com",
      databaseURL: "https://bgcma-corporate-portal.firebaseio.com",
      projectId: "bgcma-corporate-portal",
      storageBucket: "bgcma-corporate-portal.appspot.com",
      messagingSenderId: "195535537984",
      appId: "1:195535537984:web:5138ec640e9be03ead5ca5",
      measurementId: "G-5J9ZZWT81S"
    }
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    
    //Test to see if it pops up under authentication
    // firebase.auth().createUserWithEmailAndPassword("tchoi52@gmail.c", "marktrout123");
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />        
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Calendar" component={Calendar} />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="Pages" component={Pages} options={{title: 'Your Pages'}} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App; 
