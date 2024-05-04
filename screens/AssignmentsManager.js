import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { ref, onValue } from "firebase/database";
import { db, auth } from "../firebase";

const AssignmentManager = ({ navigation }) => {
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

  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const unsubscribe = onValue(ref(db, "assignments"), (snapshot) => {
      const assignmentsData = snapshot.val();
      if (assignmentsData) {
        const assignmentList = Object.values(assignmentsData);
        setAssignments(assignmentList);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.username}>{userEmail}</Text>
      </View>
      <Text style={styles.heading}>Assignments</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {Object.entries(assignments).map(([key, assignment], index) => (
          <TouchableOpacity
            key={key}
            style={styles.assignmentItem}
            onPress={() => {}}
          >
            <Text style={styles.assignmentText}>
              {index + 1}. {assignment.name}
            </Text>
            <Text style={styles.assignmentDetails}>
              Deadline: {assignment.deadline}
            </Text>
            <Text style={styles.assignmentDetails}>
              Assigned to: {assignment.assignedTo}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
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
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  assignmentItem: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  assignmentInfo: {
    // Corrected style name
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  assignmentText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  assignmentDetails: {
    fontSize: 14,
    marginBottom: 3,
  },
});

export default AssignmentManager;
