
import React, {Component} from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import {Button} from 'react-native';
import {TextInput} from 'react-native';



class Login extends Component {

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
        var correctUser = "User";
        var correctPass = "Pass";
        if (this.state.user == correctUser && this.state.password == correctPass) {
            var navigation = this.props.navigation;
            Alert.alert("Logging in!");
            //navigation.navigate('Home Page')
        } else {
            Alert.alert("Incorrect Password")
        }
        /*firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
         // ...
        });*/
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