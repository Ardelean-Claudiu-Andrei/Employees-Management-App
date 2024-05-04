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
import { ref, set, onValue } from "firebase/database";
import { auth, db } from "../firebase";

const AddAssignmentScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const unsubscribe = onValue(ref(db, "users"), (snapshot) => {
      const userData = snapshot.val();
      if (userData) {
        const employeeList = Object.values(userData).filter(
          (user) => user.role === "Employee"
        );
        setEmployees(employeeList);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddAssignment = () => {
    const assignmentData = {
      name: name,
      deadline: deadline,
      assignedTo: selectedEmployee,
    };

    // Add assignment to the database
    set(
      ref(db, `assignments/${selectedEmployee.replace(".", "_")}`),
      assignmentData
    )
      .then(() => {
        alert("Assignment added successfully");
        navigation.navigate("WelcomeManager");
      })
      .catch((error) => {
        alert("Error adding assignment: " + error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Assignment</Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />
      <TextInput
        style={styles.input}
        value={deadline}
        onChangeText={setDeadline}
        placeholder="Deadline"
      />

      <Picker
        selectedValue={selectedEmployee}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedEmployee(itemValue)}
      >
        <Picker.Item label="Select Employee" value="" />
        {employees.map((employee, index) => (
          <Picker.Item
            key={index}
            label={employee.email}
            value={employee.email}
          />
        ))}
      </Picker>

      <TouchableOpacity onPress={handleAddAssignment} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Assignment</Text>
      </TouchableOpacity>

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
  picker: {
    width: "100%",
    backgroundColor: "#F0F0F0",
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
});

export default AddAssignmentScreen;
