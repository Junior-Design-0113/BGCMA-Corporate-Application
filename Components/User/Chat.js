import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';

const firebase = require("../../server/router");
const s = require('../../Style/style')
const styles = s.styles


class Chat extends Component {

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

  getNames() {
    var names = [];
    const db = firebase.firebaseConnection.firestore();
    db.collection('Users').get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {


            console.log(doc.data().firstName + " " + doc.data().lastName);
            // var names = doc.data().firstName;
            // <View>names.toString()</View>
            names.push(<Text key={doc.id}>{doc.data().firstName + " " + doc.data().lastName}</Text>);
			            
            console.log(names.length);

            
        });
    });

    

  }


  render() {
    return (
      <View style={styles.container}>
        <View> {this.getNames()} </View>
      </View>
    );
  }
  
}


export default Chat