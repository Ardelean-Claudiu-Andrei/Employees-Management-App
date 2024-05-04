import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions, // Import Dimensions from react-native
} from "react-native";
import { ref, onValue } from "firebase/database";
import { db, auth } from "../firebase.js";

const EmployeesManager = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
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

  useEffect(() => {
    const employeesRef = ref(db, "users");
    const unsubscribe = onValue(employeesRef, (snapshot) => {
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

  const [employeeTasks, setEmployeeTasks] = useState([]);

  const openModal = (employee) => {
    setSelectedEmployee(employee);
    setModalVisible(true);

    // Fetch tasks for the selected employee
    const tasksRef = ref(db, "assignments");
    const tasksForEmployee = [];
    onValue(tasksRef, (snapshot) => {
      const tasksData = snapshot.val();
      if (tasksData) {
        Object.entries(tasksData).forEach(([taskId, task]) => {
          if (task.assignedTo === employee.email) {
            tasksForEmployee.push({ id: taskId, ...task });
          }
        });
        setEmployeeTasks(tasksForEmployee);
      }
    });
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.username}>{userEmail}</Text>
      </View>
      <Text style={styles.heading}>Employees</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {employees.map((employee, index) => (
          <TouchableOpacity key={index} onPress={() => openModal(employee)}>
            <View style={styles.employeeItem}>
              <Text style={styles.employeeText}>
                {index + 1}. {employee.email}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.topBar}>
            <Image source={require("../assets/logo.png")} style={styles.logo} />
            <Text style={styles.username}>{userEmail}</Text>
          </View>
          {selectedEmployee && selectedEmployee.email ? (
            <>
              <Text style={styles.modalTitle}>
                Employee Email:{"\n"}
                {"\n"}
                {selectedEmployee.email}
                {"\n"}
                {"\n"}
              </Text>
              <Text style={styles.modalTitle}>Assigments:</Text>
              {employeeTasks.map((task, index) => (
                <TouchableOpacity key={index} style={styles.employeeItem}>
                  <Text style={styles.taskText}>
                    {task.name} - {task.deadline}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          ) : null}
          <TouchableOpacity style={styles.backButton} onPress={closeModal}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const { width } = Dimensions.get("window"); // Get the window width

const styles = StyleSheet.create({
  taskText: {
    fontSize: 30,
    marginBottom: 10,
    color: "#333333",
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
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  scrollContainer: {
    paddingTop: 80,
    paddingBottom: 100,
  },
  employeeItem: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    width: width * 0.9, // Set the width to 90% of the screen width
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  employeeText: {
    fontSize: 16,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlignVertical: "top",
    color: "#333333",
  },

  modalButton: {
    backgroundColor: "#fff100",
    width: "90%",
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
});

export default EmployeesManager;
