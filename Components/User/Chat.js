import React, {Component} from 'react';
import { TextInput, FlatList, TouchableHighlight, Text, View, Alert, Image, Modal } from 'react-native';
import { Container, Header, Item, Input, Icon, Button } from 'native-base'
import { ListItem } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { SearchBar } from 'react-native-elements';

const fb = require("../../server/router");
const s = require('../../Style/style')
const styles = s.styles

class Chat extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
          email: null,
          committee: null,
          admin: false,
          executive: false,
          selectedCommittee: null,
          chats: [],
          url: null,
          modalVisible: false,
          chatName: '',
          res: null,
          fileSelected: false,
          chatArr: [],
          isLoading: true,
        }
        this.arrayholder = [];
    }

    componentDidMount() {
        var state = this.props.route.params.state
        Object.keys(state).forEach(key => {
          this.setState({[key]: state[key]})
        });
        this.setState({check:"check"},function() {this.load()})
      }

    async load() {
        const db = fb.firebaseConnection.firestore()
        const dataRef = db.collection('Chat')
        const query = await dataRef.where('email1', '==', this.state.email);
        this.unsubscribe = query.onSnapshot(this.getChats);
        const query2 = await dataRef.where('email2', '==', this.state.email);
        this.unsubscribe = query2.onSnapshot(this.getChats);
    }   
    gotochat(chatid){
      var navigation = this.props.navigation;
      navigation.navigate('Chat Room', {chatid: chatid})
    }

    componentWillUnmount(){
        this.unsubscribe();
    }   

    onPressAdd() {
        var navigation = this.props.navigation;
        navigation.navigate('Members', {state: this.state})
      }

    getChats = (querySnapshot) => {
        const chatArr = this.state.chatArr;
        const chatArr2 = [];
        querySnapshot.forEach((res) => {
          const {email1, email2} = res.data();
          chatArr.push({
            key: res.id,
            res,
            email1,
            email2
          });
        });
        this.setState({
          chatArr: chatArr.concat(chatArr2),
          isLoading: false,
       });
    }

    async listChats() {
        const chatsView = this.state.chats.map(chat => (
          <View key={chat.email1} style={{flexDirection: 'row', paddingVertical: 10, borderBottomColor: 'gray', borderBottomWidth: 1,  justifyContent: 'space-between'}}>
            <Text style={styles.listFiles} numberOfLines= {3} ellipsizeMode = 'middle'>{chat.email2}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            </View>
          </View>
        ))}

    render() {
        return (
        <View style={styles.container}>
            <View style={{...styles.form, width: '100%', marginTop: 0}}>
            <View style={{flexDirection: 'row'}}>
                <View style={{width: '80%'}}>
                {/* <SearchBar
                    containerStyle={{backgroundColor: 'default'}}
                    style={styles.searchBarText}
                    onChangeText={text => this.searchFiles(text)}
                    value={this.state.text}
                    placeholder="Search Chats"
                    round
                    lightTheme
                    searchIcon={{ size:30 }}
                /> */}
                </View>
                
                <TouchableHighlight
                style={{...styles.uploadButton, height: 50}}
                onPress={() => {
                    this.onPressAdd();
                    //this.listChats();
                }}>
                <Text style={{...styles.delButtonText, fontSize: 30}}>+</Text>
                </TouchableHighlight>
            </View>
            { <ScrollView>
          {
            this.state.chatArr.map((item, i) => {
              if (item.email1 === this.state.email && !(item.email2 === this.state.email)) {
                return (
                    <ListItem
                      key={i}
                      bottomDivider
                      title= {item.email2}
                      button
                      onPress={()=>this.gotochat(item.key)}
                    />
                  
                );
              } else if (item.email2 === this.state.email && !(item.email1 === this.state.email)){
                return (
                    <ListItem
                      key={i}
                      bottomDivider
                      title= {item.email1}
                      button
                      onPress={()=>this.gotochat(item.key)}
                    //   onPress={() => {
                    //     this.setModalVisible(true, this.state.firestoreRef.doc(item.title), item.title, item.message);
                    //   }
                    //   }
                    />
                  
                );
                }
            })
          }
          </ScrollView> }
            
            </View>

            {/* <Image 
            style={{maxHeight: '30%', marginTop: 10}} 
            source={this.state.url} /> */}
        </View>
        )
    }
}

export default Chat