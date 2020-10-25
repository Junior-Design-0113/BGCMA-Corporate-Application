import React, {Component} from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Alert, Image } from 'react-native';
import { Button, Row } from 'native-base'

const firebase = require("../../server/router");
const s = require('../../Style/style')
const styles = s.styles


class Members extends Component {
  	constructor(props) {
		super(props);
		this.state = {
			email: null,
			committee: null,
			admin: false,
			executive: false,
			selectedCommittee: null,
			namesList: null,
			namesArr: null,
		}
	}
  
    componentDidMount() {
	    var state = this.props.route.params.state
	    Object.keys(state).forEach(key => {
	        this.setState({[key]: state[key]})
	    });
    }

	getTeam() {
		if(this.state.selectedCommittee) {
			return(
			<Text>{this.state.selectedCommittee} Members</Text>
			)
		}
	}

	//A separate method to add names onto a variable with the rest.
	addThing() {
		this.namesList = <>{this.namesList}<Text style={styles.profileText}>{"Bambple"}</Text></>;
	}

	getAllUserInfo() {
		//Want to return a group of JSX elements that will be <Text> fields with the different names
		var returnJSX = <Text>Sample</Text>;

		//This is one way to append more JSX phrases to an existing one
		returnJSX = <>{returnJSX}<Text>{'Names'}</Text></>;

		//Trying to add the names to an array
		var names = [];

		//Trying to add names to a variable in state
		this.namesList = <Text>SampleFrample</Text>;
		//this.namesList = <>{this.namesList}<Text style={styles.profileText}>{"Bambple"}</Text></>;

		//Get all names from that user's committee
		if(this.state.selectedCommittee) {
			//Pull the user's file from firebase
		    const db = firebase.firebaseConnection.firestore();
		    //Get all matching the committee
		    db.collection('Users').where("Committee", "==", this.state.selectedCommittee).get()
		    	.then(function(querySnapshot) {
			        querySnapshot.forEach(function(doc) {
			        	// Withing the function things get updated but it isn't saved outside the function

			            // doc.data() is never undefined for query doc snapshots
			            console.log(doc.data().firstName);

			            //Adding to array doesn't work
			            names.push(<Text style={styles.profileText} key={doc.id}>{doc.data().firstName + " " + doc.data().lastName}</Text>);
			            
			            //Logging to console works
			            console.log(names.length);

			            //Appending to existing phrase doesn't work
			            returnJSX = <>{returnJSX}<Text style={styles.profileText}>{doc.data().firstName + " " + doc.data().lastName}</Text></>;

			            //Trying to call a separate method to add more names, but isn't working. Pass the names along 
			            // if it becomes workable. Throws an unhandled promise error in expo
			            if(typeof(this.addThing) !== 'undefined') {
				            this.addThing();
			            }

			            //Trying to add names to a variable in state; Give a yellow warning in expo
			            //this.namesList = <>{this.namesList}<Text style={styles.profileText}>{doc.data().firstName + " " + doc.data().lastName}</Text></>;

			            //Made an array in state but it doesn't work either.
			            //this.namesArr.push(<Text style={styles.profileText} key={doc.id}>{doc.data().firstName + " " + doc.data().lastName}</Text>);
			        });
		    });
	    }

	    returnJSX = <>{returnJSX}<Text>{'array length: ' + names.length}</Text></>;

	    return(returnJSX);
	}

  render() {
      return (
        <View style={styles.container}>
          <View style={styles.form}>
          {this.getTeam()}
          {this.getAllUserInfo()}
          {this.namesList}
          </View>
        </View>
      )
  }
}



export default Members