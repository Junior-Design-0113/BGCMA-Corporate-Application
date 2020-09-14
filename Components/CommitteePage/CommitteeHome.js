import React, {Component} from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Alert, Image } from 'react-native';
import { Button, Row } from 'native-base'

const s = require('../../Style/style')
const styles = s.styles


class CommitteeHome extends Component {
  constructor(props) {
      super(props);
      this.state = {
        email: null,
        committee: null,
        admin: false,
        executive: false,
        selectedCommittee: null,
      }
    }
  
  componentDidMount() {
    var state = this.props.route.params.state
    Object.keys(state).forEach(key => {
      this.setState({[key]: state[key]})
    });
    this.setState({selectedCommittee: this.props.route.params.selectedCommittee})
  }
  getTeamTitle() {
    var title = this.props.route.params.selectedCommittee
    if(title) {
      return(
        <Text style={styles.committeeTitle}>{title}</Text>
      )
    }
  }


  meetingFiles() {
      var navigation = this.props.navigation;
      navigation.navigate('Meeting Files', {state: this.state})
  }
  committeePage() {
      var navigation = this.props.navigation;
      navigation.navigate('Announcements', {state: this.state})
  }
  calendar() {
      var navigation = this.props.navigation;
      navigation.navigate('Calendar', {state: this.state})
  }
  members() {
      var navigation = this.props.navigation;
      navigation.navigate('Members', {state: this.state})
  }
  render() {
      // console.log("Committe Home: " + this.state.selectedCommittee)
      return (
        <View style={styles.container}>

          <View style={styles.form}>
          {this.getTeamTitle()}
          <View style={styles.pageButtonHolder}>
            <Button  style={styles.pageButton} onPress={() => this.meetingFiles()}><Text style={styles.text}>Meeting Files</Text></Button>
          </View>
          <View style={styles.pageButtonHolder}>
            <Button  style={styles.pageButton} onPress={() => this.committeePage()}><Text style={styles.text}>Committee Page</Text></Button>
          </View>
          <View style={styles.pageButtonHolder}>
            <Button  style={styles.pageButton} onPress={() => this.calendar()}><Text style={styles.text}>Calendar</Text></Button>
          </View>
          <View style={styles.pageButtonHolder}>
            <Button  style={styles.pageButton} onPress={() => this.members()}><Text style={styles.text}>Members</Text></Button>
          </View>

          {/* I think the top format is better
          <View style={styles.buttonHolder}>
              <Button  style={styles.button} onPress={() => this.meetingFiles()}><Text style={styles.text}>Meeting Files</Text></Button>
              <Button  style={styles.button} onPress={() => this.committeePage()}><Text style={styles.text}>Committee Page</Text></Button>
          </View>
          <View style={styles.buttonHolder}>
              <Button  style={styles.button} onPress={() => this.calendar()}><Text style={styles.text}>View Calendar</Text></Button>
              <Button  style={styles.button} onPress={() => this.members()}><Text style={styles.text}>View Members</Text></Button>
          </View> */}
          </View>
        </View>
      )
  }
}



export default CommitteeHome