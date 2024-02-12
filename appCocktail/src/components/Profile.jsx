import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  handleLogin = () => {
  
    Alert.alert('Login button pressed!', `Username: ${this.state.username}, Password: ${this.state.password}`);
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.h1}>Profile</Text>
          <Text style={styles.p}>
            Please press the button to log in!
          </Text>
        </View>

        <View style={styles.main}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={(username) => this.setState({username})}
            value={this.state.username}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
          />
          <Button
            title="Login"
            onPress={this.handleLogin}
          />
        </View>
      </View>
    );
  }
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 0.3,
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  h1: {
    fontSize: 32,
    marginBottom: 16,
  },
  p: {
    paddingHorizontal: 24,
  },
  main: {
    flex: 0.4,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});
