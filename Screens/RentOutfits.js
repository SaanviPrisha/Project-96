import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import { Icon, Card } from 'react-native-elements';

import MyHeader from '../components/MyHeader';
import db from '../Config';
import firebase from 'firebase';

export default class RentOutfits extends React.Component {
  constructor() {
    super();
    this.state = {
      outfits: [],
      fromInput: '',
      otherOutfits: [],
      size: '',
      userDetails: [],
      userId: firebase.auth().currentUser.email
    };
  }
  getAllOutfits = () => {
    var clothes = []
    db.collection('Outfits')
      .where('country',"==",this.state.userDetails.country).onSnapshot((snapshot) => {
        var clothes = snapshot.docs.map((doc) => doc.data());
        this.setState({
          outfits: clothes,
        });
      });
      this.state.outfits.map((item) => {
        if(forRent == true) {
          clothes = item
        }
        this.setState({
          outfits: clothes
        })})
  };
  getOutfits = () => {
    var outfit = [];
    this.state.outfits.map((item) => {
      if (item.type == this.state.fromInput) {
        outfit.push(item);
      }
    });
    this.setState({
      outfits: outfit,
    });
  };
  getUserDetails = () => {
    db.collection("Users").where("email_id","==",this.state.userId).get().then((doc) => {
      doc.docs.map((data) => {
        this.setState({
          userDetails: data.data()
        });
      });
    });
  }
  renderItem = ({ item, i }) => {
    return (
      <View style={styles.flatlist}>
        <Card title={item.type} containerStyle={styles.cardStyle}>
          <Image source={{ uri: item.image_uri }} style={styles.image}></Image>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              this.props.navigation.navigate('Details', { Data: item });
            }}>
            <Text style={styles.text}>Details</Text>
          </TouchableOpacity>
        </Card>
      </View>
    );
  };
  size = () => {
    var outfit = [];
    this.state.outfits.map((item) => {
      if (item.size == this.state.size) {
        outfit.push(item);
      }
    });
    this.setState({
      outfits: outfit,
    });
  }
  componentDidMount() {
    this.getUserDetails()
    this.getAllOutfits();
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <MyHeader title={'Rent Outfits'} />
          <View>
            <TextInput
              placeholder="Enter the Type of Outfit"
              onChangeText={(text) => {
                this.setState({
                  fromInput: text,
                });
              }}
              style={styles.searchBar}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => {
                this.getOutfits();
              }}>
              <Icon name="search" type="fontawesome5" />
            </TouchableOpacity>
            <TextInput
              placeholder="Enter the Size of Outfit"
              onChangeText={(text) => {
                this.setState({
                  size: text,
                });
              }}
              style={styles.searchBar}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => {
                this.size();
              }}>
              <Icon name="search" type="fontawesome5" />
            </TouchableOpacity>
            {this.state.outfits.length == 0 ? (
              <Text>Loading...</Text>
            ) : (
              <View style={styles.flatlist}>
                <FlatList
                  data={this.state.outfits}
                  renderItem={this.renderItem}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 15,
    alignSelf: 'center',
  },
  cardStyle: {
    width: 300,
    height: 350,
    borderRadius: 20,
  },
  searchBar: {
    borderWidth: 2,
    width: 500,
    height: 50,
    borderRadius: 30,
    borderWidth: 5,
    borderColor: 'black',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 30,
    marginLeft: 350,
    marginBottom: 40,
  },
  searchButton: {
    width: 50,
    height: 30,
    backgroundColor: '#c1e0b4',
    borderRadius: 20,
    alignItems: 'center',
    marginTop: -80,
    marginLeft: 900,
  },
  saveButton: {
    backgroundColor: '#c1e0b4',
    width: 100,
    height: 50,
    alignText: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  flatlist: {
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
});
