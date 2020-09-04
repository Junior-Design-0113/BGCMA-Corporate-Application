import React, {Component} from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Alert, Image } from 'react-native';
import { Button, Row } from 'native-base'
// import * as firebase from "firebase";
import 'firebase/firestore';



const fb = require("../../server/router")

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      committee: null,
    }
  }

  componentDidMount() {
    var email = this.props.route.params.user
    this.setState({email})
    const db = fb.firebaseConnection.firestore()
    const users = db.collection('Users').doc(email);
    users.get()
    .then(response => {
      var committee = response.data().Committee
      this.setState({committee})
    })
    .catch(error => {
        console.log(error);
    });
  }

  getPendingUsers() {
    if (this.state.committee && this.state.committee === "admin") {
      return (
        <View style={styles.form2}>
          <Button  style={styles.button} onPress={() => this.pendingUsers()}><Text style={styles.pendingText}>Pending Users</Text></Button>
        </View>
      )
    }
  }
    pendingUsers() {
      var navigation = this.props.navigation;
      navigation.navigate('Pending Users')
    }

    profile() {
        var navigation = this.props.navigation;
        navigation.navigate('Profile', {state: this.state})
    }
    calendar() {
        var navigation = this.props.navigation;
        navigation.navigate('Calendar', {state: this.state})
    }
    chat() {
        var navigation = this.props.navigation;
        navigation.navigate('Chat', {state: this.state})
    }
    pages() {
        var navigation = this.props.navigation;
        navigation.navigate('Pages', {state: this.state})
    }
    render() {
        return (
          <View style={styles.container}>
            <Image style={styles.image} source={require('./BGCA.png')} />

            <Text style={styles.text2}>Welcome Home</Text>

            <View style={styles.form1}>
                <Button  style={styles.button} onPress={() => this.profile()}><Text style={styles.text}>Profile</Text></Button>
                <Button  style={styles.button} onPress={() => this.calendar()}><Text style={styles.text}>Calendar</Text></Button>
            </View>
            <View style={styles.form2}>
                <Button  style={styles.button} onPress={() => this.chat()}><Text style={styles.text}>Chat</Text></Button>
                <Button  style={styles.button} onPress={() => this.pages()}><Text style={styles.text}>Pages</Text></Button>
            </View>
            {this.getPendingUsers()}
          </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 0,
      padding: 20,
      marginTop: 20,
      marginLeft: 'auto',
      marginRight: 'auto',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      width: '90%',
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
    pendingText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 12,
      marginRight: 'auto',
      marginLeft: 'auto'
    },
    image: {
      marginTop: 0, 
      width: 360,
      height: 206,
    }
  });


export default Home