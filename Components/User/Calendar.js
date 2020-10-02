import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Calendar as RNCalendar} from 'react-native-calendars';

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
        
        <RNCalendar
          // The big list of changeable properties is here: https://github.com/wix/react-native-calendars
          // It defaults to the current date. The calendar changes in size according to how many weeks there are, 
          //    the length of the month name, and more. Not sure how to fix that. Turning off day names will make 
          //    the calendar compress and make numbers unreadable.

          // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
          monthFormat={'yyyy MMM'}
          // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
          firstDay={1}
          // Handler which gets executed when visible month changes in calendar. Default = undefined
          //onMonthChange={(month) => {console.log('month changed', month)}}
          // If hideArrows=false and hideExtraDays=false (which they are by default) do not switch month when tapping on 
          // greyed out day from another month that is visible in calendar page. Default = false
          disableMonthChange={true}

          // Good for adding announcements
          // Handler which gets executed on day press. Default = undefined.
          //onDayPress={(day) => {console.log('selected day', day)}}
          // Handler which gets executed on day long press. Default = undefined
          //onDayLongPress={(day) => {console.log('selected day', day)}}
      />
      </View>
    );
  }
  
}

export default Calendar