import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { auth } from "../firebase"; // Import auth from firebase

const WelcomeEmployee = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState("");
  const [emailPrefix, setEmailPrefix] = useState(""); // State to store email prefix

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { email } = user;
        setUserEmail(email);

        // Extract email prefix before "@" symbol
        const prefix = email.split("@")[0];
        setEmailPrefix(prefix);
      }
    });

    return unsubscribe; // Unsubscribe when component unmounts
  }, []);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.username}>{userEmail}</Text>{" "}
        {/* Display user email */}
      </View>
      <Text style={styles.welcome}>Bun venitm Employee!</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Employees")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Check-in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("AssignmentsEmployee")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>View Assigments</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
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
  welcome: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FFF100",
    width: "90%",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 25,
  },
  buttonText: {
    color: "black",
    fontWeight: "700",
    fontSize: 16,
  },
  logoutButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default WelcomeEmployee;
