import React, {Component} from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Alert, Image, Dimensions } from 'react-native';
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
      admin: false,
      executive: false
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
      var admin = response.data().Admin
      var executive = response.data().Executive
      this.setState({committee})
      this.setState({admin})
      this.setState({executive})
    })
    .catch(error => {
        console.log(error);
    });
  }

  getPendingUsers() {
    if (this.state.admin) {
      return (
        <View style={styles.buttonHolder}>
          <Button  style={styles.button2} onPress={() => this.pendingUsers()}><Text style={styles.pendingText}>Pending Users</Text></Button>
        </View>
      )
    }
  }
  pendingUsers() {
    var navigation = this.props.navigation;
    navigation.navigate('Pending Users')
  }

  // Depending on if we wanna check if the user is an admin once more
  // pendingUsers() {
  //   var navigation = this.props.navigation;
  //   navigation.navigate('Pending Users', {user: this.state.user})
  // }

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
      navigation.navigate('Members', {state: this.state})
  }
  pages() {
      var navigation = this.props.navigation;

      //Navigate user to Committee Page or to Navigation Page
      if (!this.state.executive) {
        navigation.navigate('Team Page', {state: this.state, selectedCommittee: this.state.committee})
      } else {
        navigation.navigate('Pages', {state: this.state})
      }
  }
  render() {
    // console.log("Home Page: " + this.state.committee)
      return (
        <View style={styles.container}>
          <Image 
            style={{maxHeight: Dimensions.get('window').height * .25 , marginTop: 10}} 
            source={require('./../../assets/BGCMA.png')} 
            resizeMode = 'contain'/>

          <View style={styles.form}>
          <Text style={styles.title}>Welcome Home</Text>

          <View style={styles.buttonHolder}>
              <Button  style={styles.button} onPress={() => this.profile()}><Text style={styles.text}>Profile</Text></Button>
              <Button  style={styles.button} onPress={() => this.calendar()}><Text style={styles.text}>Calendar</Text></Button>
          </View>
          <View style={styles.buttonHolder}>
              <Button  style={styles.button} onPress={() => this.chat()}><Text style={styles.text}>Chat</Text></Button>
              <Button  style={styles.button} onPress={() => this.pages()}><Text style={styles.text}>Pages</Text></Button>
          </View>
          {this.getPendingUsers()}
          </View>
        </View>
      )
  }
}


const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    form: {
      flex: 3,
      marginTop: '10%',
    },
    buttonHolder: {
      flex: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 30,
    },
    title: {
      marginLeft: 'auto',
      marginRight: 'auto',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      fontSize: 35,
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
      backgroundColor: '#9B26B6',
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
    pendingText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 12,
      marginRight: 'auto',
      marginLeft: 'auto'
    },
    // image: {
    //   marginTop: 0, 
    //   width: 360,
    //   height: 206,
    // }
  });


export default Home