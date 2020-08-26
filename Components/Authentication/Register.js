import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
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


	        <Button color="blue" title="Register"> </Button> 
	        {/*////onPress={() => this.onPressRegister()}><Text style={styles.text}>Register</Text></Button>*/}
      
    	</View>
    );
  }
  

}


export default Register