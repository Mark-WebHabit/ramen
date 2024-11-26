import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { getDatabase, ref, query, orderByChild, equalTo, get } from "firebase/database";
import { auth } from "../firebase";

const Profile = ({ navigation }) => {
  const [username, setUsername] = useState("")


  useEffect(() => {
    const fetchUserByEmail = async (uid) => {
  try {
    const db = getDatabase(); // Initialize your Firebase Realtime Database
    const usersRef = ref(db, "usernames"); // Reference to the "users" node

    // Query the database for a user with the given username
    const userQuery = query(usersRef, orderByChild("uid"), equalTo(uid));

    // Execute the query
    const snapshot = await get(userQuery);

    if (snapshot.exists()) {
      // Snapshot contains matching data
      const data = snapshot.val();
      setUsername(Object.keys(data)[0])
    } else {
      console.log("No user found with the given username.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error; // Re-throw the error for further handling
  }
};
fetchUserByEmail(auth.currentUser.uid)
  }, [auth.currentUser])

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      {/* Profile Picture */}
      <View style={styles.profilePictureContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }} // Replace with actual profile picture URI
          style={styles.profilePicture}
        />
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{username}</Text>
        <Text style={styles.userEmail}>{auth.currentUser.email}</Text>
      </View>

      {/* Bottom Navigation with Icons */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={30} color="black" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Menu')}>
          <Ionicons name="restaurant-outline" size={30} color="black" />
          <Text style={styles.navText}>Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-outline" size={30} color="black" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4E1D2', // Beige background
  },
  header: {
    backgroundColor: '#C8102E', // Red background for the header
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FCF5ED', // White text
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#3E2723', // Brown border color
    borderWidth: 2,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3E2723', // Brown text
  },
  userEmail: {
    fontSize: 16,
    color: '#3E2723', // Brown text
  },
 bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#F4E1D2',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#3E2723', // Brown text
  },
});

export default Profile;
