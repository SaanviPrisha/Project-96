import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import db from '../Config';
import firebase from 'firebase';

export default class WelecomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Renting Reformed</Text>
        <Text style={styles.quote}> Buy Less, Wear More, Rent It</Text>
        <Image source={require('../assets/Logo.png')} style={styles.image} />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.props.navigation.navigate('Authentication');
          }}>
          <Text style={styles.buttonText}>Get Started!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Courier New',
    fontSize: 80,
    marginTop: 20,
  },
  quote: {
    marginTop: 10,
    fontFamily: 'Courier New',
    fontSize: 30,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 40,
    marginTop: 20,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#ebb0f5',
    width: 300,
    height: 50,
    borderRadius: 5,
    alignItems: 'center',
    alignText: 'center',
  },
  buttonText: {
    fontFamily: 'Courier New',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
});
