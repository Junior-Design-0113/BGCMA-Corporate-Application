
import React, {Component} from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import {Button} from 'react-native';
import {TextInput} from 'react-native';
import * as firebase from "firebase";


class Login extends Component {

  componentWillMount() {
    firebaseConfig = {
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

}
    state={
        user:"",
        password:""
      }
	onPressRegister() {
        Alert.alert("Going to registration page");
	    var navigation = this.props.navigation;
	    navigation.navigate('Register')
    }
    onPressLogin() {
        /*var correctUser = "User";
        var correctPass = "Pass";
        if (this.state.user == correctUser && this.state.password == correctPass) {
            var navigation = this.props.navigation;
            Alert.alert("Logging in!");
            //navigation.navigate('Home Page')
        } else {
            Alert.alert("Incorrect Password")
        }*/
        var authenticated = false
        firebase.auth().signInWithEmailAndPassword(this.state.user, this.state.password)
        .then(() => {
          console.log("log in works")
          this.setState({authenticated: true}, function() {
          authenticated = true
        })
      // changeAuth(true)
      // authenticated = true
    }).catch((error) =>{
      console.log(error)
      Alert.alert(error.message)
      changeAuth(false)
      // authenticated = false
    })

    }

  render() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Log In</Text>
        <TextInput
        placeholder =  "Username"
        onChangeText={(text) => this.setState({user:text})}
        value = {this.state.text} />
        <TextInput
        secureTextEntry
        placeholder = "Password"
        onChangeText={(text) => this.setState({password:text})}
        value = {this.state.text} />
        <Button color="blue" title="Register for App" onPress={() => this.onPressRegister()}> </Button>
        <Button color = "green" title="Log In" onPress={() => this.onPressLogin()}> </Button>

      </View>
    );
  }

}


export default Login