import React, {Component} from 'react';
import { StyleSheet, Text, View, Alert, TextInput } from 'react-native';
import {Button} from 'native-base';
import ActionSheet from 'react-native-actionsheet';
import * as Crypto from 'expo-crypto';

const firebase = require("../../server/router");

	const committeeList = [
	  'Budget, Finance, & Audit',
	  'Board Development',
	  'Human Resources',
	  'Impact',
	  'Investment',
	  'Resource Development & Marketing',
	  'Safety Asset Management',
	  ''
	];

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
		//Empty field handling
		if(!this.state.firstName || !this.state.lastName) {
			Alert.alert("Please enter a First and Last name");
			return;
		}
		if(!this.state.email){
			Alert.alert("Please enter an email");
			return;
		}
		if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)){
			Alert.alert("Please enter a valid email address");
			return;
		}
		if(!this.state.password){
			Alert.alert("Please enter a password");
			return;
		}
		if(!this.state.group){
			Alert.alert("Please select a board");
			return;
		}

		this.state.email = this.state.email.toLowerCase()
		
		const db = firebase.firebaseConnection.firestore()
		const pendingUsers = db.collection('PendingUsers').doc(this.state.email);
		const users = db.collection('Users').doc(this.state.email);
		const self = this

		//Checks if present in Users
		users.get().then((found) => {
			if (found.exists) {
				Alert.alert("This email is already associated with an account")
			} else {
				//Checks if present in pendingUsers
				pendingUsers.get().then((found) => {
					if (found.exists) {
						Alert.alert("This email is pending approval")
					} else {
						//.this is dynamic so a variable has to be used 
						// self.hashPassword(self)
						self.addToPendingUser(self)
					}
				})
			}
		})	
	}

	async addToPendingUser(self) {
		self.state.password = await Crypto.digestStringAsync(
		  Crypto.CryptoDigestAlgorithm.SHA256,
		  self.state.password)
		
		await firebase.firebaseConnection.firestore().collection('PendingUsers').doc(self.state.email).set({
			Admin: false,
			Committee: self.state.group,
			Executive: false,
			firstName: self.state.firstName,
			lastName: self.state.lastName,
			password: self.state.password
		}).catch((error) => {
	        console.log(error)
	        Alert.alert(error.message)
		})

		Alert.alert("Your request to register was successful.");
		var navigation = this.props.navigation;
		navigation.navigate('Login')
	}

	onPressCancel() {
	    var navigation = this.props.navigation;
	    navigation.navigate('Login')
	}	 

	showActionSheet = () => {
		this.ActionSheet.show();
	};

 	render() { 
    return (
        <View style={styles.container}>
	        <View style={styles.form}>
		        
				<Text style={{fontSize: 24, textAlign: 'center'}}>Enter your info to register.</Text>

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
					keyboardType = "email-address"
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
	            <TextInput style = {styles.input}
	                autoCorrect={false}
	                onFocus={group => this.showActionSheet()}
	                onKeyPress={group => this.showActionSheet()}
	                placeholder={'Pick a board to join'}
	                value={this.state.group}
	            />

	            <ActionSheet
					ref={o => (this.ActionSheet = o)}
					//Title of the Bottom Sheet
					title={'Pick a board to join'}
					//Options Array to show in bottom sheet
					options={committeeList}
					//Define cancel button index in the option array. Need this so pressing back works
					cancelButtonIndex={8}
					onPress={index => {
						//Clicking on the option will give you the index of the option clicked
						this.updateGroup(committeeList[index]);
					}}
				/>

	            {/* <Picker
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
		        </Picker> */}

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
	  paddingTop: 15,
    //   paddingBottom: 45,
    },
    button: {
      flexDirection: 'row', 
      padding: 20,
      width: '40%',
      height: '180%',
      backgroundColor: '#0081c6',
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
      backgroundColor: '#FF8200',
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
    // picker: {
    //   height: 50, 
    //   borderColor: '#7a42f4',
    //   borderWidth: 1,
    //   marginBottom: 15
    // },
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

