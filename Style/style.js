import { StyleSheet } from 'react-native';

module.exports.styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      form: {
        flex: 3,
        marginTop: '10%',
      },
      buttonHolder: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30,
      },
      pageButtonHolder: {
        flex: 0,
        marginTop: "10%",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      title: {
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        fontSize: 35,
      },
      button: {
        flexDirection: 'row', 
        padding: 20,
        width: '40%',
        height: '180%',
        backgroundColor: '#0081c6',
        borderRadius: 35,
        alignItems: 'center',
        marginRight: 10,
        marginLeft: 10,
      },
      pageButton: {
        flexDirection: 'row', 
        padding: 20,
        width: '80%',
        height: '180%',
        backgroundColor: '#0081c6',
        borderRadius: 35,
        alignItems: 'center',
        marginRight: 10,
        marginLeft: 10,
      },
      button2: {
        flexDirection: 'row', 
        padding: 20,
        width: '40%',
        height: '180%',
        backgroundColor: '#9B26B6',
        borderRadius: 35,
        alignItems: 'center',
        marginRight: 10,
        marginLeft: 10,
      },
      text: {
        color: 'white',
        fontWeight: '700',
        fontSize: 20,
        marginRight: 'auto',
        marginLeft: 'auto'
      },
      pendingText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 12,
        marginRight: 'auto',
        marginLeft: 'auto'
      },
    });