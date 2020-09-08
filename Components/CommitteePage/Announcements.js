import React, {Component} from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Alert, Image } from 'react-native';

const s = require('../../Style/style')
const styles = s.styles


class Announcements extends Component {
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
  }
  getTeam() {
    if(this.state.selectedCommittee) {
      return(
        <Text>Announcements for: {this.state.selectedCommittee}</Text>
      )
    }
  }

  render() {
      return (
        <View style={styles.container}>
          <View style={styles.form}>
          {this.getTeam()}
          </View>
        </View>
      )
  }
}



export default Announcements