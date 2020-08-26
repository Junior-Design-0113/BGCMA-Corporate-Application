import React, {Component} from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import {Button} from 'react-native';
import {TextInput} from 'react-native';
import * as firebase from 'firebase';


class Register extends Component {

	state = {
	    firstName: '',
	    lastName: '',
	    email: '',
	    password: '',
	    /*committe: ?? not sure*/
	  }


	onPressRegister() {
		{/*//Need to set up firebase here, don't want to copy too much code*/}
	    {/*firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
	      .then(() => {
	        this.ref.add({
	          FirstName: this.state.firstName,
	          LastName: this.state.lastName,
	          UserType: 'Member',
	          email: this.state.email
	        }).then((data) => {
	          console.log("added customer")

	          Alert.alert("Registered Successfully");
	          var navigation = this.props.navigation;
	          navigation.navigate('Login')
	        }).catch((error) => {
	          console.log(error)
	        })

	      }, (error) => {
	        Alert.alert(error.message)
	      })*/}
        Alert.alert("Registered Successfully");
	    var navigation = this.props.navigation;
	    navigation.navigate('Login')
    }  


 	render() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
	        <Text>Enter your info to register.</Text>

	        {/*<Text>Enter your First Name</Text>*/}
            <TextInput
                autoCorrect={false}
                onChangeText={firstName => this.setState({firstName})}
                placeholder={'Enter your First Name'}
                value={this.state.firstName}
            />            
            <TextInput
                autoCorrect={false}
                onChangeText={lastName => this.setState({lastName})}
                placeholder={'Enter your Last Name'}
                value={this.state.lastName}
            />
            <TextInput
                autoCorrect={false}
                onChangeText={email => this.setState({email})}
                placeholder={'Enter your email'}
                value={this.state.email}
            />
            <TextInput
                autoCorrect={false}
                onChangeText={password => this.setState({password})}
                placeholder={'Enter your password'}
                value={this.state.password}
            />


	        <Button color="blue" title="Register" onPress={() => this.onPressRegister()}> </Button> 
    	</View>
    );
  }
}

export default Register