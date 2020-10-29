import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import Fire from './Chat/Fire';


class Chat extends Component {
  componentDidMount() {
    Fire.shared.on(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }
  // 2.
  componentWillUnmount() {
    Fire.shared.off();
  }
  get user() {
    // Return our name and our UID for GiftedChat to parse
    return {
      name: "Name",
      _id: Fire.shared.uid,
    };
  }
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || 'Chat!',
  });
  state = {
    messages: [],
  };
 
  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={Fire.shared.send}
        user={this.user}
      />
    );
  }
}
export default Chat;



