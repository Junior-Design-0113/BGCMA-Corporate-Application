import React, {Component} from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import {Button} from 'react-native';




class Login extends Component {

	onPressRegister() {
        Alert.alert("Going to registration page");
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