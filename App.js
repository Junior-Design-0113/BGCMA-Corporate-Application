import 'react-native-gesture-handler';
import React, {Component} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, StyleSheet, Text, View } from 'react-native';
import Login from './Components/Authentication/Login'
import Profile from './Components/User/Profile';
import Calendar from './Components/User/Calendar';
import Pages from './Components/User/Pages';
import Home from './Components/User/Home';
import PendingUsers from './Components/Admin/PendingUsers';
import Register from './Components/Authentication/Register'
import CommitteeHome from './Components/CommitteePage/CommitteeHome'
import MeetingFiles from './Components/CommitteePage/MeetingFiles'
import Announcements from './Components/CommitteePage/Announcements'
import Members from './Components/User/Members'
import AnnouncementPage from './Components/CommitteePage/AnnouncementPage'
import ChatPage from './Components/User/ChatPage'

const firebase = require("./server/router");


const Stack = createStackNavigator();


class App extends Component {


  componentDidMount() {
    firebase.initializeFirebase()
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login}/>
          <Stack.Screen name="Register" component={Register}/>
          <Stack.Screen name="Home" component={Home}/>
          <Stack.Screen name="Profile" component={Profile}/>
          <Stack.Screen name="Calendar" component={Calendar}/>
          <Stack.Screen name="Members" component={Members}/>
          <Stack.Screen name="Pages" component={Pages} options={{title: 'Your Pages'}}/>
          <Stack.Screen name="Pending Users" component={PendingUsers}/>
          <Stack.Screen name="Team Page" component={CommitteeHome} options={{title: ''}}/>
          <Stack.Screen name="Meeting Files" component={MeetingFiles}/>
          <Stack.Screen name="Announcements" component={Announcements}/>
          <Stack.Screen name="AnnouncementPage" component={AnnouncementPage}/>
          <Stack.Screen name="ChatPage" component={ChatPage}/>
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
