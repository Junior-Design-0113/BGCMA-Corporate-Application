import React, {Component} from 'react';
import { TextInput, FlatList, ActivityIndicator, StyleSheet, Text, View, Alert, Image } from 'react-native';
import { Container, Header, Item, Input, Icon, Button } from 'native-base'
import * as DocumentPicker from 'expo-document-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { SearchBar } from 'react-native-elements';

const fb = require("../../server/router");
const s = require('../../Style/style')
const styles = s.styles

class MeetingFiles extends Component {
  constructor(props) {
      super(props);
      this.state = {
        email: null,
        committee: null,
        admin: false,
        executive: false,
        selectedCommittee: null,
        files: [],
      }
      this.arrayholder = [];
    }
  
  async componentDidMount() {
    var state = this.props.route.params.state
    await Object.keys(state).forEach(key => {
      this.setState({[key]: state[key]})
    })
    this.getFiles()
  }
  
  getTeam() {
    if(this.state.selectedCommittee) {
      return(
        <Text>{this.state.selectedCommittee} Meeting Files</Text>
      )
    }
  }

  pickFile() {
    DocumentPicker.getDocumentAsync().then((res) => {
      if (res.type === 'success') {
        Alert.alert("Confirm File Upload?", res.name,
        [{text: "Cancel", onPress: () => console.log("Cancel")},
        {text: "Upload", onPress: () => this.uploadFile(res)}]) 
        // console.log(res.name)
      } else {
        Alert.alert('No file was selected')
      }
    })
  }

  uploadFile = async(res) => {
    var storageRef = fb.firebaseConnection.storage().ref()
    
    //If greater than 1MB (size is in bytes), cancel
    if (res.size > 1000000) {
      Alert.alert("File is too large to upload")
      return
    }
    const response = await fetch(res.uri);
    const blob = await response.blob();
    var ref = storageRef.child(this.state.selectedCommittee + "/" + res.name);
    // console.log(this.state.selectedCommittee + "/" + res.name)
    
    await ref.put(blob).then(() => {Alert.alert("File has been uploaded", res.name)});
    
    this.updateScreen();
  }

  getFiles() {
    var storageRef = fb.firebaseConnection.storage().ref();
    var listRef = storageRef.child(this.state.selectedCommittee + "/");
    //console.log(this.state.selectedCommittee + "/")

    listRef.listAll().then((res) => {
      const files = []
      var count = 0
      res.items.forEach((file) => {
        files.push({
          key: count++,
          name: file.name
        })
      })
      //console.log(files)
      this.arrayholder = files; 
      this.setState({files : files}, (() => this.listFiles()))
    })
  }

  listFiles() {
    const filesView = this.state.files.map(file => (
      <View key={file.key}>
        <Text style={styles.listFiles}>{file.name}</Text>
        <Button style={styles.deleteButton} onPress={() => this.deleteFile(file)}>
          <Text>Delete</Text>
        </Button>
      </View>
    ))
  
    return (
    <View>
      {filesView}
    </View>
    )
  }

  async deleteFile(file) {
    var storageRef = fb.firebaseConnection.storage().ref();
    var deleteRef = storageRef.child(this.state.selectedCommittee + '/' + file.name);

    await deleteRef.delete()
      Alert.alert(file.name + " has been deleted.");

    this.updateScreen();
  }

  updateScreen() {
    this.getFiles(); 
    // console.log('screen update');
  }

  searchFiles(text) {
    const newData = this.arrayholder.filter(function(item) {
      const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      dataSource: newData,
      text: text,
    });
  }

  
  ListViewItemSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: 'gray',
        }}
      />
    );
  };

  render() {
    //console.log(this.state.selectedCommittee)
      return (
        <View style={styles.container}>
          <View style={styles.form}>
          <SearchBar
            style={styles.searchBarText}
            onChangeText={text => this.searchFiles(text)}
            value={this.state.text}
            placeholder="Search Files"
            round
            lightTheme
            searchIcon={{ size:30 }}
          />
          <FlatList
            data={this.state.dataSource}
            ItemSeparatorComponent={this.ListViewItemSeparator}
            renderItem={({ item }) => (
              <Text style={styles.searchText}>{item.name}</Text>
            )}
            style={{ marginTop: 5 }}
            enableEmptySections={true}
            keyExtractor={item => item.name}  
          />
          {this.getTeam()}
            <View style={styles.pageButtonHolder}>
              <Button style={styles.pageButton} onPress={() => this.pickFile()}><Text style={styles.text}>+</Text></Button>
            </View>
            <ScrollView>{this.listFiles()}</ScrollView>
          </View>
        </View>
      )
  }
}



export default MeetingFiles