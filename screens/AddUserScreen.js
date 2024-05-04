import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ref, set } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";

const AddUserScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [userAdded, setUserAdded] = useState(false); // State to track user addition

  const [userEmail, setUserEmail] = useState("");
  const [emailPrefix, setEmailPrefix] = useState(""); // State to store email prefix

  useEffect(() => {
    // Fetch user data on component mount
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email); // Set user email in state

      // Extract email prefix before "@" symbol
      const prefix = currentUser.email.split("@")[0];
      setEmailPrefix(prefix);
    }
  }, []);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const croppedEmail = user.email.substring(0, user.email.indexOf("@"));
        setUserEmail(croppedEmail);
      }
    });

    return unsubscribe;
  }, []);

  function AddUser() {
    // Create user with email and password
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User successfully created
        const user = userCredential.user;
        // Store additional user data in the database
        const userData = {
          email: email,
          password: password,
          role: role,
          status: role === "Employee" ? "Out" : "", // Set default status based on role
        };
        set(ref(db, `users/${email.replace(".", "_")}`), userData)
          .then(() => {
            alert("User added successfully");
          })
          .catch((error) => {
            alert("Error adding user data: " + error.message);
          });
      })
      .catch((error) => {
        alert("Error creating user: " + error.message);
      });
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.username}>{userEmail}</Text>
      </View>
      <Text style={styles.heading}>Add User</Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Picker
        selectedValue={role}
        style={styles.picker}
        onValueChange={(itemValue) => setRole(itemValue)}
      >
        <Picker.Item label="Select Role" value="" />
        <Picker.Item label="Manager" value="Manager" />
        <Picker.Item label="Employee" value="Employee" />
      </Picker>

      <TouchableOpacity onPress={AddUser} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add User</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          if (!userAdded) navigation.navigate("WelcomeManager"); // Navigate only if user is not added
        }}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: "#3CB371",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#DDDDDD",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  backButtonText: {
    fontWeight: "700",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddUserScreen;
