import React, {Component} from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import {Button, Picker} from 'react-native';
import {TextInput} from 'react-native';
import * as firebase from 'firebase';


class Register extends Component {

	state = {
	    firstName: '',
	    lastName: '',
	    email: '',
	    password: '',
	    group: 'board',
	  }

	updateGroup = (group) => {
        this.setState({ group:group })
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

    onPressCancel() {
        Alert.alert("Your info wasn't saved");
	    var navigation = this.props.navigation;
	    navigation.navigate('Login')
    }  


 	render() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
            <Picker
		        selectedValue={this.state.group}
		        style={{ height: 50, width: 150 }}
		        onValueChange={this.updateGroup}
		      >
		        <Picker.Item label="Board" value="board" />
		        <Picker.Item label="Committee" value="committee" />
		    </Picker>

			{/* Debug  
		    <Text>Testing state works: {this.state.firstName + " " + this.state.group}</Text>
		    */}


	        <Button color="blue" title="Register" onPress={() => this.onPressRegister()}> </Button> 
	        <Button color="red" title="Cancel" onPress={() => this.onPressCancel()}> </Button> 
    	</View>
    );
    }
}

export default Register