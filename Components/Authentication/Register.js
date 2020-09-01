import React, {Component} from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import {Button, Picker} from 'react-native';
import {TextInput} from 'react-native';
import * as firebase from 'firebase';
import RNPickerSelect from 'react-native-picker-select';
{/*import {Picker} from '@react-native-community/picker';*/}

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
        Alert.alert("Your request has been made");
	    var navigation = this.props.navigation;
	    navigation.navigate('Login')
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


        {/*Originally worked for me on web but not for iphone users*/}
        <Picker
            selectedValue={this.state.group}
            style={styles.dropDownContainer}
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
        

        {/*Invariant violation. RNCAndroidDialogPicker was not found. */}
			  {/* <RNPickerSelect
		            onValueChange={(value) => this.setState({group: value})}
		            items={[
		                { label: 'Budget, Finance, & Audit', value: 'budget' },
		                { label: 'Board Development', value: 'boardDevelopment' },
		                { label: 'Executive', value: 'exec' },
		                { label: 'Human Resources', value: 'humanResources' },
		                { label: 'Impact & Investment', value: 'impact' },
		                { label: 'Resource Development & Marketing', value: 'marketing' },
		                { label: 'Safety Asset Management', value: 'safety' },
		            ]}
                useNativeAndroidPickerStyle={false} //android only
		        />
          */}

			  {/* Debug <Text>Testing state works: {this.state.firstName + " " + this.state.group}</Text> */}
		    <Text> </Text>

		    <View style={styles.form1}>
		        <Button style={styles.button} color="blue" title="Register" onPress={() => this.onPressRegister()}> </Button> 
		        <Text>  </Text>
		        <Button style={styles.button} color="red" title="Cancel" onPress={() => this.onPressCancel()}> </Button> 
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
    form2: {
      flex: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: '20%',
    },
    title: {
      marginLeft: 'auto',
      marginRight: 'auto',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      fontWeight: '800',
      fontSize: 30,
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
    text: {
      color: 'white',
      fontWeight: '700',
      fontSize: 20,
      marginRight: 'auto',
      marginLeft: 'auto'
    },
    text2: {
      color: 'black',
      fontWeight: '700',
      fontSize: 35,
      marginRight: 'auto',
      marginLeft: 'auto',
      marginTop: 20,
      marginBottom: 50,
    },
      dropDownContainer: {
      height: 50, 
      width: 300,
    },
  });

export default Register