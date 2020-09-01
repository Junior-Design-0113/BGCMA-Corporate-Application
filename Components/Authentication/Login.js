import React, {Component} from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import {Button} from 'react-native';

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

	onPressRegister() {
	    var navigation = this.props.navigation;
	    navigation.navigate('Register')
    }  


  render() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Log In</Text>
        <Button color="blue" title="Register for App" onPress={() => this.onPressRegister()}> </Button> 
      </View>
    );
  }
  
}


export default Login