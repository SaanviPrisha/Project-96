import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';

import db from '../Config';
import firebase from 'firebase';

export default class DressDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: this.props.navigation.getParam('Data'),
      docId: '',
      woreText: 'Wore',
      modalVisibility: false,
      price: 0,
    };
  }
  getDocId = async () => {
    var docId = '';
    await db
      .collection('Outfits')
      .where('image_id', '==', this.state.info.image_id)
      .get()
      .then((doc) => {
        doc.docs.map((data) => {
          docId = data.id;
        });
        this.setState({
          docId: docId,
        });
      });
  };
  woreOutfit = async () => {
    db.collection('Outfits').doc(this.state.docId).update({
      date: firebase.firestore.FieldValue.serverTimestamp(),
      wore_text: 'Wear Again!',
    });
    alert('Database was succesfully updated!');
  };
  rent = () => {
    db.collection('Outfits').doc(this.state.docId).update({
      forRent: true,
      price: this.state.price,
    });
  };
  sold = () => {
    db.collection('Outfits').doc(this.state.docId).delete();
  };
  showModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.modalVisibility}>
        <View>
          <TextInput
            placeholder={'Price of Clothing'}
            style={styles.textInput}
            onChangeText={(text) => {
              this.setState({
                price: text,
              });
            }}
          />
          <TouchableOpacity
            style={styles.save}
            onPress={() => {
              this.rent();
            }}>
            <Text>Rent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancel}
            onPress={() => {
              this.setState({
                modalVisibility: false,
              });
            }}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };
  componentDidMount() {
    this.getDocId();
  }
  render() {
    if (this.state.modalVisibility == true) {
      return <View style={styles.center}>{this.showModal()}</View>;
    } else {
      return (
        <View style={styles.container}>
          <Image
            source={{ uri: this.state.info.image_uri }}
            style={styles.image}
          />
          <Text style={styles.typeOfDress}>Type: {this.state.info.type}</Text>
          <TouchableOpacity
            style={styles.wearButton}
            onPress={() => {
              this.woreOutfit();
            }}>
            <Text style={styles.text}>{this.state.info.wore_text}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rentButton}
            disabled={this.state.info.forRent == true ? true : false}
            onPress={() => {
              this.setState({
                modalVisibility: true,
              });
            }}>
            <Text style={styles.text}>Rent It</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.soldButton}
            onPress={() => {
              this.sold();
            }}>
            <Text style={styles.text}>Don't Have It</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  image: {
    width: 400,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  typeOfDress: {
    marginTop: 50,
    fontSize: 20,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  text: {
    fontSize: 20,
    alignSelf: 'center',
  },
  wearButton: {
    marginTop: 20,
    backgroundColor: '#c1e0b4',
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    alignText: 'center',
    borderRadius: 5,
    marginLeft: -500
  },
  rentButton: {
    marginTop: -50,
    backgroundColor: '#c1e0b4',
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    alignText: 'center',
    borderRadius: 5,
    marginLeft: 0
  },
  soldButton: {
    marginTop: -50,
    backgroundColor: '#c1e0b4',
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    alignText: 'center',
    borderRadius: 5,
    marginLeft: 500
  },
  textInput: {
    borderWidth: 2,
    width: '100%',
    height: 50,
    borderRadius: 5,
    fontSize: 20,
    marginTop: 30,
    textAlign: 'center',
  },
  save: {
    marginTop: 10,
    marginLeft: -100,
    backgroundColor: '#c1e0b4',
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  cancel: {
    marginTop: -40,
    marginLeft: 100,
    backgroundColor: '#c1e0b4',
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});
