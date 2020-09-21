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
        marginBottom: 30,
      },
      title: {
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        fontSize: 35,
      },
      committeeTitle: {
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        textAlign: 'center',
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
      pageText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 20,
        marginRight: 'auto',
        marginLeft: 'auto',
        textAlign: 'center',
      },
      pendingText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 12,
        marginRight: 'auto',
        marginLeft: 'auto'
      },
      listFiles: {
        fontSize: 18,
        marginLeft: 5,
        flexDirection: 'row',
        paddingTop: 20,
      },
      deleteButton: {
        flexDirection: 'row',
        left: 270,
        backgroundColor: 'red',
        top: -70,
      },
      downloadButton: {
        flexDirection: 'row',
        left: 190,
        backgroundColor: 'green',
        top: -25,
      },
      searchBarText: {
        fontSize: 20,
        marginTop:0
      },
      searchText: {
        fontSize: 20,
        marginTop: 5,
        marginBottom: 5,
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        // margin: 20,
        width: '80%',
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      openButton: {
        backgroundColor: "#2196F3",
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      modalInput: {
        width: '80%',
        margin: 15,
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        paddingLeft: 10
      },
      uploadCancelButton: {
        flexDirection: 'row', 
        padding: 10,
        width: '40%',
        height: '180%',
        backgroundColor: '#0081c6',
        borderRadius: 35,
        alignItems: 'center',
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 20, 
      }
    });