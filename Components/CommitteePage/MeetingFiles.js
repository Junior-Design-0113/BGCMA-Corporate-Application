import React, {Component} from 'react';
import { TextInput, FlatList, TouchableHighlight, Text, View, Alert, Image, Modal } from 'react-native';
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
        modalVisible: false,
        fileName: '',
        res: null,
        fileSelected: false,
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
  
  // getTeam() {
  //   if(this.state.selectedCommittee) {
  //     return(
  //       <Text>{this.state.selectedCommittee} Meeting Files</Text>
  //     )
  //   }
  // }

  pickFile() {
    DocumentPicker.getDocumentAsync().then((res) => {
      if (res.type === 'success') {
        this.setState({res})
        this.setState({fileSelected: true})
        // Alert.alert("Confirm File Upload?", res.name,
        // [{text: "Cancel", onPress: () => console.log("Cancel")},
        // {text: "Upload", onPress: () => this.uploadFile(res)}]) 
        // console.log(res.name)
      } else {
        Alert.alert('No file was selected')
      }
    })
  }

  uploadFile = async(res) => {
    var storageRef = fb.firebaseConnection.storage().ref()
    
    //If greater than 1MB (size is in bytes), cancel
    if(res == null) {
      Alert.alert("Please Select A File")
      return
    }
    if (res.size > 1000000) {
      Alert.alert("File Is Too Large To Upload")
      return
    }
    if (this.state.fileName == '') {
      Alert.alert("Please Input A File Name")
      return
    }
    var fileName = this.state.fileName.replace(/\s/g , "-");
    const response = await fetch(res.uri);
    const blob = await response.blob();
    var ref = storageRef.child(this.state.selectedCommittee + "/" + fileName);
    
    await ref.put(blob).then(() => {Alert.alert("File has been uploaded", fileName)});
    
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

  setModalVisible(val) {
    this.setState({modalVisible: val});
  }

  render() {
    const {modalVisible, res} = this.state
      return (
        <View style={styles.container}>
          <View style={{...styles.form, width: '100%', marginTop: 0}}>
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
            style={{ marginTop: 0 }}
            enableEmptySections={true}
            keyExtractor={item => item.name}  
          />
          {/* {this.getTeam()} */}
            <View style={{...styles.pageButtonHolder}}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <TextInput style = {styles.modalInput}
                      autoCorrect={false}
                      onChangeText={fileName => this.setState({fileName})}
                      placeholder={'File Name'}
                      value={this.state.fileName}
                    />  
                    <TouchableHighlight
                      style={{ ...styles.openButton, backgroundColor: this.state.fileSelected ? '#2196F3': "#a1a1a1", marginBottom: 10 }}
                      onPress={() => {
                        this.pickFile();
                      }}
                    >
                      <Text style={{...styles.text, color: this.state.fileSelected ? 'white': "#4a4a4a"}}>
                        {this.state.fileSelected ? 'File Selected': 'Select a File'}
                      </Text>
                    </TouchableHighlight>
                    <View style={styles.buttonHolder}>
                      <Button  style={{...styles.uploadCancelButton, backgroundColor: "green"}} onPress={() => {this.uploadFile(res)}}>
                        <Text style={styles.text}>Upload</Text>
                      </Button>
                      <Button  style={{...styles.uploadCancelButton, backgroundColor: "red"}} onPress={() => {this.setModalVisible(!modalVisible)}}>
                        <Text style={styles.text}>Cancel</Text>
                      </Button>
                    </View>
                  </View>
                </View>
              </Modal>
              <TouchableHighlight
                style={styles.openButton}
                onPress={() => {
                  this.setModalVisible(true);
                }}
              >
                <Text style={styles.text}>Upload A File</Text>
              </TouchableHighlight>
              {/* <Button style={styles.pageButton} onPress={() => this.pickFile()}><Text style={styles.text}>Upload a File</Text></Button> */}
            </View>
            <ScrollView>{this.listFiles()}</ScrollView>
          </View>
        </View>
      )
  }
}



export default MeetingFiles