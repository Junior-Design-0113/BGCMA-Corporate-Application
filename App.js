import 'react-native-gesture-handler';
import React, {Component} from 'react';
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

const firebase = require("./server/router");

const Stack = createStackNavigator();


class App extends Component {


  componentWillMount() {
    firebase.initializeFirebase()
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login">
            {(props) => <Login  {...props} />}
          </Stack.Screen> 
          <Stack.Screen name="Register">
            {(props) => <Register  {...props}  />}
          </Stack.Screen>
          <Stack.Screen name="Home">
            {(props) => <Home  {...props}  />}
          </Stack.Screen> 
          <Stack.Screen name="Profile">
            {(props) => <Profile  {...props}  />}
          </Stack.Screen> 
          <Stack.Screen name="Calendar">
            {(props) => <Calendar  {...props}  />}
          </Stack.Screen> 
          <Stack.Screen name="Chat">
            {(props) => <Chat  {...props}  />}
          </Stack.Screen> 
          <Stack.Screen name="Pages" options={{title: 'Your Pages'}}>
            {(props) => <Pages  {...props}  />}
          </Stack.Screen> 
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
