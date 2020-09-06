import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';




class Calendar extends Component {
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
  render() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Calendar</Text>
      </View>
    );
  }
  
}


export default Calendar