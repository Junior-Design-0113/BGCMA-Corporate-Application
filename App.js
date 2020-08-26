import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, {Component} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View } from 'react-native';
import Login from './Components/Authentication/Login'
import Register from './Components/Authentication/Register'

// function Login() {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Log In</Text>
//     </View>
//   );
// }

const Stack = createStackNavigator();

// function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="Login" component={Login} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

class App extends Component {


  componentWillMount() {
    //function here
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>          
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
 },
});

export default App; 
