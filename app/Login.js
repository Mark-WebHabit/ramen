import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Modal } from 'react-native';
import { auth } from '../firebase';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth/cordova';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);  // State to manage modal visibility

  const loginUser = async () => {
    // Validate user input
    if (!email || !password) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user's email is verified
      if (!user.emailVerified) {
        Alert.alert('Email not verified', 'Please verify your email before logging in.');
        return;
      }

      Alert.alert('Success', 'User logged in successfully.');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Failed to log in. Please check your email and password.');
      console.log('Error logging in:', error.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Validation Error', 'Please enter your email address.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset email sent.');
      setModalVisible(false); // Close the modal after email is sent
    } catch (error) {
      Alert.alert('Error', 'Failed to send password reset email. Please try again.');
      console.log('Error resetting password:', error.message);
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

      {/* Login form card container */}
      <View style={styles.cardContainer}>
        <Text style={styles.title}>Login to Your Account</Text>

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

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={loginUser}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Forgot Password Link */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Signup Link */}
        <Text style={styles.linkText}>
          Don't have an account?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
            Sign Up here
          </Text>
        </Text>
      </View>

      {/* Forgot Password Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reset Your Password</Text>
            <TextInput
              style={styles.modalInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="Enter your email"
            />
            <TouchableOpacity style={styles.modalButton} onPress={handlePasswordReset}>
              <Text style={styles.modalButtonText}>Send Reset Email</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20, // Space between the logo and the form
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#FCF5ED', // Background color for the form card
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    justifyContent: 'flex-start', // Change to 'flex-start' to move content upwards
    width: '100%', // Stretch the card to the sides
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15, // Reduced margin for better spacing
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
    marginBottom: 10, // Reduced margin for better spacing
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  loginButton: {
    backgroundColor: '#C8102E', // Button background color
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 15, // Reduced margin for better spacing
  },
  loginButtonText: {
    color: '#FCF5ED', // Button text color
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#000', // Color for "Forgot Password?" text
    textAlign: 'center',
    marginVertical: 10, // Vertical margin for spacing
    fontSize: 16,
    fontWeight: 'bold', // Added bold weight
  },
  linkText: {
    color: '#000', // Text color for "Don't have an account?"
    textAlign: 'center',
    marginTop: 15, // Reduced margin for better spacing
    fontSize: 16,
  },
  link: {
    color: '#C8102E', // Color for "Sign Up here" link
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FCF5ED',
    padding: 30,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  modalButton: {
    backgroundColor: '#C8102E',
    paddingVertical: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#FCF5ED',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    color: '#000',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
