import React, {Component} from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';


const firebase = require("../../server/router");


class Login extends Component {

  constructor(props) {
		super(props);
    this.state = {
    };
  }
  componentDidMount() {
    username = "test@gmail.com"
    password = "password"
    
    firebase.firebaseConnection.auth().signInWithEmailAndPassword(username, password)
    .then(() => {
      console.log("check")
      //log in stuff (nagivation stuff)
    }).catch((error) =>{
      console.log(error)
      Alert.alert(error.message)
    })

  }

  render() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Log In</Text>
      </View>
    );
  }
  
}


export default Login