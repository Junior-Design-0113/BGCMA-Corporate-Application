import { CheckBox } from 'native-base';
import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import Fire from './Fire';

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      targetUser: null, 
      //chatID: null, 
    }
  }

  componentDidMount() {
    var id = this.props.route.params.chatid
    this.setState({chatID:id})
    Fire.shared.chatID(id)
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

export default ChatRoom;