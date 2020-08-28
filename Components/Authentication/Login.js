
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
      </View>
    );
  }

}


export default Login