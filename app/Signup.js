import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { ref, set, get, child } from 'firebase/database';
import { db, auth } from '../firebase';

export default function Signup({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const registerUser = async () => {
    // Validate user input
    if (!username || !email || !password) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    try {
      // Check if the username is already taken
      const usernameRef = ref(db, `usernames/${username}`);
      const usernameSnapshot = await get(usernameRef);
      if (usernameSnapshot.exists()) {
        Alert.alert('Error', 'Username is already taken.');
        return;
      }

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save the username in the database
      await set(ref(db, `usernames/${username}`), { uid: user.uid });

      // Send email verification
      await sendEmailVerification(user);

      Alert.alert('Success', 'User registered successfully. Please check your email for verification.');
      navigation.navigate('Login');
    } catch (error) {
      console.log(error.message);
      
      if(error.message == "Firebase: Error (auth/email-already-in-use).")
        {
          Alert.alert('Error', 'Email already in use.');
        }else if(error.message == "Firebase: Error (auth/invalid-email)."){
           Alert.alert('Error', 'Invalid email format.');
        }else{
        Alert.alert('Error', 'Failed to register user. Please try again later.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Top background color section */}
      <View style={styles.topSection}>
        {/* Logo at the top */}
        <Image
          source={require('./assets/LogoPNG.png')} // Replace with your actual logo file path
          style={styles.logo}
        />
      </View>

      {/* Signup form card container */}
      <View style={styles.cardContainer}>
        <Text style={styles.title}>Create a New Account</Text>

        {/* Username Field */}
        <Text style={styles.label}>Username <Text style={styles.asterisk}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
        />

        {/* Email Field */}
        <Text style={styles.label}>Email Address <Text style={styles.asterisk}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Enter your email"
        />

        {/* Password Field */}
        <Text style={styles.label}>Password <Text style={styles.asterisk}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter your password"
        />

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.signUpButton} onPress={registerUser}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <Text style={styles.linkText}>
          Already have an account?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            Login here
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4E1D2', // Background color for the top section
  },
  topSection: {
    backgroundColor: '#F4E1D2',
    justifyContent: 'center',
    alignItems: 'center',
    height: '30%', // Adjust the height of the top section
  },
  logo: {
    width: 350,
    height: 350,
    marginBottom: 30, // Space between the logo and the form
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#FCF5ED', // Background color for the form card
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    justifyContent: 'center',
    width: '100%', // Stretch the card to the sides
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000', // Label text color
  },
  asterisk: {
    color: '#C8102E', // Color of the asterisk (*)
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  signUpButton: {
    backgroundColor: '#C8102E', // Button background color
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  signUpButtonText: {
    color: '#FCF5ED', // Button text color
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#000', // Text color for "Already have an account?"
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  link: {
    color: '#C8102E', // Color for "Login here" link
    fontWeight: 'bold',
  },
});
