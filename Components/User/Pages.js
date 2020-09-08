import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'native-base'

const s = require('../../Style/style')
const styles = s.styles



class Pages extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: null,
      committee: null,
      admin: false,
      executive: false,
    }
  }

  componentDidMount() {
    var state = this.props.route.params.state
    if(state.committee && !state.executive) {
      this.goToPage(state.committee)
  }
    Object.keys(state).forEach(key => {
      this.setState({[key]: state[key]})
    });
      

    

  }
  getCommittees() {
    if(this.state.committee){
      return(
        <View style={styles.pageButtonHolder}>
          <Button  style={styles.pageButton} onPress={() => this.goToPage(this.state.committee)}><Text style={styles.text}>{this.state.committee}</Text></Button>
        </View>
      )
    }
  }
  getExec() {
    if(this.state.executive){
      return(
        <View style={styles.pageButtonHolder}>
          <Button  style={styles.pageButton} onPress={() => this.goToPage('Executive Committee')}><Text style={styles.text}>Executive Committee</Text></Button>
        </View>
      )
    }
  }
  goToPage(selected) {
    var navigation = this.props.navigation;
    navigation.navigate('Team Page', {state: this.state, selectedCommittee: selected})
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', marginTop:'20%'}}>
        {this.getCommittees()}
        {this.getExec()}
      </View>
    );
  }
  
}


export default Pages