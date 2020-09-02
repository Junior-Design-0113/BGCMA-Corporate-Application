import React, {Component} from 'react';
import { StyleSheet, Text, View, Alert, TextInput } from 'react-native';
import {Button} from 'native-base';

const firebase = require("../../server/router");

class Register extends Component {

	state = {
	    firstName: '',
	    lastName: '',
	    email: '',
	    password: '',
	    group: '',
	  }

	onPressRegister() {
		firebase.firebaseConnection.firestore().collection('PendingUsers').doc(this.state.email).set({
	        firstName: this.state.firstName,
	        lastName: this.state.lastName,
	        Email: this.state.email,
	        Committee: this.state.group
	    }).then((data) => {
	        console.log("added customer")
	        Alert.alert("Your request to register has been made successfully");
			var navigation = this.props.navigation;
			navigation.navigate('Login')	        
	    }).catch((error) => {
	        console.log(error)
	        Alert.alert(error.message)
	    })
	}

	onPressCancel() {
	    var navigation = this.props.navigation;
	    navigation.navigate('Login')
	}	  

 	render() {
    return (
        <View style={styles.container}>
	        <Text>Enter your info to register.</Text>

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

            {/* Debug <Text>Testing state works: {this.state.firstName + " " + this.state.group}</Text> */}

		    <View style={styles.form1}>
		        <Button  style={styles.button} onPress={() => this.onPressRegister()}><Text style={styles.text}>Register</Text></Button>
            	<Button  style={styles.button} onPress={() => this.onPressCancel()}><Text style={styles.text}>Cancel</Text></Button>
		        <Text>  </Text>
    		</View>
    	</View>
    );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center',
    },
    form1: {
      flex: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      flexDirection: 'row', 
      padding: 20,
      width: '40%',
      height: '180%',
      backgroundColor: 'dodgerblue',
      borderRadius: 35,
      alignItems: 'center',
      marginRight: 10,
      marginLeft: 10,
    },
      dropDownContainer: {
      height: 50, 
      width: 300,
    },
});

export default Register 

