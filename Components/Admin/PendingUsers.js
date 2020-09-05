import React, {Component} from 'react';
import { StyleSheet, Text, View, Alert, Switch, ScrollView, SafeAreaView } from 'react-native';
import { Container, Button, Header, Content, Accordion } from 'native-base'
import Constants from 'expo-constants';
import 'firebase/firestore';

const fb = require("../../server/router")

class PendingUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingUsers: [],
    }
    const db = fb.firebaseConnection.firestore()
    this.ref = db.collection('PendingUsers')
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot((querySnapshot) => {
      const pendingUsers = [];
      querySnapshot.forEach((doc) => {
        var id = doc.id
        var pendingUser = doc.data()
        pendingUsers.push( {
          id: id,
          Admin: pendingUser.Admin,
          Committee: pendingUser.Committee,
          Executive: pendingUser.Executive,
          firstName: pendingUser.firstName,
          lastName: pendingUser.lastName
        })
      })
      this.setState({pendingUsers: pendingUsers}, function() {
        this.populatePendingUsers()
      })
    })

  }
  
  approve(pendingUser) {
      fb.firebaseConnection.firestore().collection('Users').doc(pendingUser.id).set({
      Admin: pendingUser.Admin,
      Committee: pendingUser.Committee,
      Executive: pendingUser.Executive,
      firstName: pendingUser.firstName,
      lastName: pendingUser.lastName
    }).then((data) => {
      this.delete(pendingUser)
      console.log("approved user")
      Alert.alert("User has succesfully been approved");
      // var navigation = this.props.navigation;
      // navigation.navigate('Home')	
    }).catch((error) => {
        console.log(error)
        Alert.alert(error.message)
    })
  }

  delete(pendingUser) {
    fb.firebaseConnection.firestore().collection('PendingUsers').doc(pendingUser.id).delete()
      console.log("deleted user")
      Alert.alert("User has succesfully been deleted");
  }
  
  populatePendingUsers() {
    const pendingUsers = this.state.pendingUsers.map(pendingUser => (
      <View key={pendingUser.id}>
        <Text style={styles.title}>{pendingUser.id}</Text>
        <Text style={styles.text}>{"Name: " + pendingUser.firstName + " " + pendingUser.lastName}</Text>
        <Text style={styles.text}>{"Committee: " + pendingUser.Committee}</Text>
        <Text style={styles.text}>{"Admin: " + pendingUser.Admin.toString()}</Text>
        <Text style={styles.text}>{"Executive: " + pendingUser.Executive.toString()}</Text>

        <View style={styles.buttonHolder}>
			        <Button  style={styles.button} onPress={() => this.delete(pendingUser)}>
			        	<Text style={styles.buttonText}>Delete</Text>
		        	</Button>
	            	<Button  style={styles.button2} onPress={() => this.approve(pendingUser)}>
	            		<Text style={styles.buttonText}>Approve</Text>
            		</Button>
	    		</View>
      </View>
    ));

    return(
      <View>
        {pendingUsers}
      </View>
    )
  }
  
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
            {this.populatePendingUsers()}
        </ScrollView>
    </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
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
    paddingTop: 10,
    paddingBottom: 15,
  },
  button: {
    flexDirection: 'row', 
    padding: 20,
    width: '40%',
    height: '100%',
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
    height: '100%',
    backgroundColor: '#84BD00',
    borderRadius: 35,
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 20,
    marginRight: 'auto',
    marginLeft: 'auto'
  },
  title: {
    fontSize: 24,
    textAlign: 'left',
    alignSelf: 'stretch',
    fontWeight: '700',
    marginLeft: 30
  },
  text: {
    fontSize: 16,
    textAlign: 'left',
    alignSelf: 'stretch',
    marginLeft: 30
  },
});


export default PendingUsers