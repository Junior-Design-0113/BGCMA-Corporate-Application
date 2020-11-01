import React, {Component} from 'react';
import { StyleSheet, Text, View, } from 'react-native';

const firebase = require("../../server/router");
const s = require('../../Style/style')
const styles = s.styles

class Profile extends Component {

	constructor(props) {
		super(props);
		this.state = {
			email: null,
			committee: null,
			admin: false,
			executive: false,
			selectedCommittee: null,
		    firstName: '',
	   		lastName: '',
	   		//userInfo: '',
		}
	}

	async componentDidMount() {
		var state = this.props.route.params.state
		await Object.keys(state).forEach(key => {
		    this.setState({[key]: state[key]})
		});

		//Update the right fields in state to show user's info in render()
		this.getUserInfo(this.state.email);
	}

	//Can modify this function for the chat components to find accounts based on different emails
	async getUserInfo(email) {
		//Could make the check more elaborate and make sure the email is in Users although if there's no customer input then 
		// we could probably assume the email we use will be valid.
		if (email) {
			//Pull the user's file from firebase
		    const db = firebase.firebaseConnection.firestore()
		    const user = db.collection('Users').doc(email);

		    //Access the user's properties and assign it to fields in the state
		    user.get().then((doc) => {
			    if (doc.exists) {
			    	//Access the data of this element of the collection with doc.data().x
			    	this.setState({firstName:doc.data().firstName});
			    	this.setState({lastName:doc.data().lastName});   	
			    	//this.setState({userInfo:doc.data().userInfo});  
			    } else {
			        // doc.data() will be undefined in this case
			        console.log("No such document!");
			    }
			}).catch(function(error) {
			    console.log("Error getting document:", error);
			});
			//console.log('\nupdated info\n');	
		}		
	}

    render() {
	    return (
	    	<View style={styles.container}>
		    	<View style={styles.form}>
			        <Text style={styles.profileTitle}>{this.state.firstName}</Text>
			        <Text style={styles.profileTitle}>{this.state.lastName}</Text>
			        <Text style={styles.profileText}>{}</Text>

			        <Text style={styles.profileText}>{"Committee: "}</Text>
			        <Text style={styles.profileSubtext}>{this.state.committee}</Text>
			        <Text style={styles.profileText}>{"Info: "}</Text>
			        <Text style={styles.profileSubtext}>{"No Info" /*this.state.userInfo*/}</Text>		 
		        </View>

		         
	        </View>
	        
	    );
    }
}

export default Profile