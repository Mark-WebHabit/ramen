import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,

} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {SERVER_URI} from '@env';
import axios from 'axios';

export default function CardInputPage({navigation, route}) {

    const {paymentIntent} = route.params
    const [paymentId, setPaymentId] = useState("");

  const [cardType, setCardType] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvc, setCVC] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');

  useEffect(() => {
    if(!paymentId || !paymentIntent)
    {
return;
    }

        async function pay(){
            return await axios.post(`${SERVER_URI}/payment/attach-payment-method`, {
            "payment_intent_id": paymentIntent,
             "payment_method_id": paymentId
        })
        }
        const response = pay();
        Alert.alert('Success', 'Payment Success!');
        navigation.navigate("Menu")
        
        
    
  }, [paymentId, paymentIntent])

  const validateInput = () => {
    const cardNumberRegex = /^\d{16}$/; // Only 16 digits
    const cvcRegex = /^\d{3}$/; // Only 3 digits
    const monthRegex = /^(0[1-9]|1[0-2])$/; // 01-12
    const yearRegex = /^\d{4}$/; // 4-digit year

    if (!cardType) {
      Alert.alert('Validation Error', 'Please select a card type.');
      return false;
    }
    if (!cardNumberRegex.test(cardNumber)) {
      Alert.alert('Validation Error', 'Card number must be 16 digits.');
      return false;
    }
    if (!cvcRegex.test(cvc)) {
      Alert.alert('Validation Error', 'CVC must be 3 digits.');
      return false;
    }
    if (!monthRegex.test(expiryMonth)) {
      Alert.alert('Validation Error', 'Expiration month must be between 01 and 12.');
      return false;
    }
    if (!yearRegex.test(expiryYear)) {
      Alert.alert('Validation Error', 'Expiration year must be 4 digits.');
      return false;
    }
    return true;
  };

  const handleSubmit = async() => {
    if (validateInput()) {

        try {
            const response = await axios.post(`${SERVER_URI}/payment/create-payment-method`, {
            "card_number": cardNumber,
            "exp_month": parseInt(expiryMonth),
            "exp_year": parseInt(expiryYear),
            "cvc": cvc
        })
        console.log('Response:', response.data);
        setPaymentId(response.data.data.id);


        
        
        } catch (error) {
            alert("Invalid Card Info");
             console.error('Error:', error.response?.data || error.message);
        }

    }
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
      <Text style={styles.title}>Enter Card Details</Text>

      {/* Card Type */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Card Type</Text>
        <Picker
          selectedValue={cardType}
          style={styles.picker}
          onValueChange={(itemValue) => setCardType(itemValue)}
        >
          <Picker.Item label="Select Card Type" value="" />
          <Picker.Item label="Visa" value="visa" />
          <Picker.Item label="MasterCard" value="mastercard" />
          <Picker.Item label="American Express" value="amex" />
        </Picker>
      </View>

      {/* Card Number */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="1234 5678 9012 3456"
          keyboardType="numeric"
          maxLength={16}
          value={cardNumber}
          onChangeText={setCardNumber}
        />
      </View>

      {/* CVC */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>CVC</Text>
        <TextInput
          style={styles.input}
          placeholder="123"
          keyboardType="numeric"
          maxLength={3}
          value={cvc}
          onChangeText={setCVC}
        />
      </View>

      {/* Expiry Month */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Expiration Month (MM)</Text>
        <TextInput
          style={styles.input}
          placeholder="01"
          keyboardType="numeric"
          maxLength={2}
          value={expiryMonth}
          onChangeText={setExpiryMonth}
        />
      </View>

      {/* Expiry Year */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Expiration Year (YYYY)</Text>
        <TextInput
          style={styles.input}
          placeholder="2025"
          keyboardType="numeric"
          maxLength={4}
          value={expiryYear}
          onChangeText={setExpiryYear}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  picker: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton:{
    marginTop: 30,
    backgroundColor: 'gray',
    width: 60,
  },
  back:{
    textAlign: 'center',
    fontSize: 20,
    color: 'white'
  }
});
