import React, {Component} from 'react';
import { StyleSheet, Text, View, Alert, TextInput, Picker } from 'react-native';
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

  	updateGroup = (group) => {
        this.setState({ group:group })
    }

	onPressRegister() {
		firebase.firebaseConnection.firestore().collection('PendingUsers').doc(this.state.email).set({
	        firstName: this.state.firstName,
	        lastName: this.state.lastName,
	        Email: this.state.email,
	        Committee: this.state.group
	    }).then((data) => {
	        console.log("added customer")
	        Alert.alert("Your request to register has been made successfully.");
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
	        <View style={styles.form}>
		        <Text>Enter your info to register.</Text>

	            <TextInput style = {styles.input}
	                autoCorrect={false}
	                onChangeText={firstName => this.setState({firstName})}
	                placeholder={'Enter your First Name'}
	                value={this.state.firstName}
	            />            
	            <TextInput style = {styles.input}
	                autoCorrect={false}
	                onChangeText={lastName => this.setState({lastName})}
	                placeholder={'Enter your Last Name'}
	                value={this.state.lastName}
	            />
	            <TextInput style = {styles.input}
	                autoCorrect={false}
	                onChangeText={email => this.setState({email})}
	                placeholder={'Enter your email'}
	                value={this.state.email}
	            />
	            <TextInput style = {styles.input}
	                autoCorrect={false}
	                onChangeText={password => this.setState({password})}
	                placeholder={'Enter your password'}
	                value={this.state.password}
	            />

	            <Picker
		            selectedValue={this.state.group}
		            style={styles.picker}
		            onValueChange={this.updateGroup}
		          >
		            <Picker.Item label="Pick a board to join" value="" />
		            <Picker.Item label='Budget, Finance, & Audit' value="budget" />
		            <Picker.Item label="Board Development" value="boardDevelopment" />
		            <Picker.Item label="Executive" value="exec" />
		            <Picker.Item label="Human Resources" value="humanResources" />
		            <Picker.Item label="Impact & Investment" value="impact" />
		            <Picker.Item label="Resource Development & Marketing" value="marketing" />
		            <Picker.Item label="Safety Asset Management" value="safety" />
		        </Picker>

	            {/* Debug <Text>Testing state works: {this.state.firstName + " " + this.state.group}</Text> */}

			    <View style={styles.buttonHolder}>
			        <Button  style={styles.button} onPress={() => this.onPressRegister()}>
			        	<Text style={styles.text}>Register</Text>
		        	</Button>
	            	<Button  style={styles.button2} onPress={() => this.onPressCancel()}>
	            		<Text style={styles.text}>Cancel</Text>
            		</Button>
	    		</View>
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
    form: {
	  flex: 1,
	  marginTop: '10%',
	},
    buttonHolder: {
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
    button2: {
      flexDirection: 'row', 
      padding: 20,
      width: '40%',
      height: '180%',
      backgroundColor: 'red',
      borderRadius: 35,
      alignItems: 'center',
      marginRight: 10,
      marginLeft: 10,
    },
    text: {
      color: 'white',
      fontWeight: '700',
      fontSize: 20,
      marginRight: 'auto',
      marginLeft: 'auto'
    },
    picker: {
      height: 50, 
      borderColor: '#7a42f4',
      borderWidth: 1,
      marginBottom: 15
    },
    input: {
       margin: 15,
       marginLeft: 2,
       height: 40,
       borderColor: 'black',
       borderWidth: 1,
       paddingLeft: 10
    },
});

export default Register 

