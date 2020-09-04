import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Container, Button, Header, Content, Accordion } from 'native-base'
import 'firebase/firestore';

const fb = require("../../server/router")

class PendingUsers extends Component {
  // constructor(props) {
  //   super(props);
  //   this.ref = fb.firebaseConnection.firestore().collection('PendingUser');
  //   this.state={
  //   dataSource : []
  // }
  // }
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //   dataSource: null
  // }
  // }
  // componentDidMount(){
  //   this.unsubscribe = this.ref.onSnapshot(this.latestUsers);
  // }

  // // Depending on if we wanna check if the user is an admin once more
  // componentDidMount() {
  //   var email = this.props.route.params.user
  //   this.setState({email})
  //   const db = fb.firebaseConnection.firestore()
  //   const users = db.collection('Users').doc(email);
  //   users.get()
  //   .then(response => {
  //     var committee = response.data().Committee
  //     var admin = response.data().Admin
  //     var executive = response.data().Executive
  //     this.setState({committee})
  //     this.setState({admin})
  //     this.setState({executive})
  //   })
  //   .catch(error => {
  //       console.log(error);
  //   });
  // }
  
  
  
  //   latestUsers = (usersSnapShot) =>{
  //     const PendingUser = [];
  //     usersSnapShot.forEach((doc) => {
  //     const {admin, committee, executive, firstName, lastName} = doc.data();
  //       PendingUser.push({
  //         key: doc.id,
  //         admin,
  //         committee,
  //         executive,
  //         firstName,
  //         lastName
  //       });
  //     });
  //     this.setState({
  //       dataSource : PendingUser,
  //     });
  //   }
  
  
//   render() {
//     return (
//       // <Container>
//       <Content padder>
//         <Accordion dataArray={this.state}/>
//       </Content>
//     // </Container>
//     );
//   }
// }


// var dataArray = [];
// //   { title: "First Element", content: "First Name:\nLast Name\nCommittee:\nExecutive:\nSenior Leadership:\n" },
// //   { title: "Second Element", content: "Lorem ipsum dolor sit amet" },
// //   { title: "Third Element", content: "Lorem ipsum dolor sit amet" }
// // ];
 
  // render() {
  //   return (
  //     // <Container>
  //     <Content padder>
  //       {/* <Accordion dataArray={this.state.dataSource}/> */}
  //     </Content>
  //   // </Container>
  //   );
  // }
  
// }

  render() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Pending Users</Text>
      </View>
    );
  }
}


export default PendingUsers