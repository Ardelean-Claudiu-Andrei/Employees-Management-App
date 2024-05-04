import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const AssignmentsEmployee = ({ navigation }) => {
  // Dummy assignment data for demonstration
  const assignments = [
    { task: "Task 1", deadline: "2024-04-30" },
    { task: "Task 2", deadline: "2024-05-05" },
    { task: "Task 3", deadline: "2024-05-10" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.username}>Username</Text>
      </View>
      <Text style={styles.heading}>Assignments</Text>
      {/* Tabel cu 3 coloane */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>No.</Text>
          <Text style={styles.headerText}>Task</Text>
          <Text style={styles.headerText}>Deadline</Text>
        </View>
        {/* Render each row with an incremented counter */}
        {assignments.map((assignment, index) => (
          <View style={styles.row} key={index}>
            <Text>{index + 1}</Text>
            <Text>{assignment.task}</Text>
            <Text>{assignment.deadline}</Text>
          </View>
        ))}
      </View>
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
  table: {
    borderWidth: 1,
    borderColor: "black",
    width: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#DDDDDD",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  headerText: {
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
});

export default AssignmentsEmployee;
