import React, { useEffect, useState } from "react"; 
import { 
  View, 
  TextInput, 
  Text, 
  Button, 
  StyleSheet, 
  Platform,
  Alert,
  TouchableOpacity,
  ScrollView, 
} from "react-native"; 
import { Picker } from "@react-native-picker/picker"; 
import DateTimePicker from "@react-native-community/datetimepicker";
import { 
  addPerson, 
  getPersons, 
  updatePerson, 
  deletePerson, 
  initializeDB, 
  Person, 
} from "@/database"; // Import initializeDB

import 'react-native-gesture-handler';
 
const dataentry = () => {
  // States for inputs 
  const [firstName, setFirstName] = useState(""); 
  const [lastName, setLastName] = useState(""); 
  const [phone, setPhone] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [gender, setGender] = useState("Select Gender"); // Default dropdown value 
  const [date, setDate] = useState(new Date()); 
  const [showDatePicker, setShowDatePicker] = useState(false); // Handle visibility of Date Picker
  const [persons, setPersons] = useState<Person[]>([]); 
  const [selectedPerson, setSelectedPerson] = useState<number | null>(null); 
  const [editingPersonId, setEditingPersonId] = useState<number | null>(null); // Track if updating a person
  

  const onChangeDate = ( 
    event: { nativeEvent: { timestamp: number } }, 
    selectedDate?: Date 
  ) => { 
    const currentDate = selectedDate || date; 
    setShowDatePicker(Platform.OS === "ios"); 
    setDate(currentDate); 
  };
 
  // Function to handle form submission 
  const fetchPersons = async () => { 
    const allPersons = await getPersons();  
    setPersons(allPersons); 
  }; 
 
  useEffect(() => { 
    const setupDatabase = async () => { 
      await initializeDB(); 
      fetchPersons(); 
    }; 
 
    setupDatabase(); 
  }, []); 
 
  const handleSubmit = async () => { 
    if (
      !firstName || 
      !lastName || 
      !phone || 
      !email || 
      gender === "Select Gender" 
    ) { 
      Alert.alert("Error", "Please fill in all fields correctly."); 
      return; 
    } 
 
    try { 
      if (editingPersonId) { 
        // Update existing person 
        await updatePerson( 
          editingPersonId, 
          firstName, 
          lastName, 
          phone, 
          email, 
          date.toISOString(), 
          gender 
        ); 
        console.log("Person updated successfully"); 
      } else { 
        // Add new person 
        const id = await addPerson( 
          firstName, 
          lastName, 
          phone, 
          email, 
          date.toISOString(), 
          gender 
        ); 
        console.log("Person created successfully with ID:", id); 
    } 
      resetForm(); 
      fetchPersons(); // Refresh the list 
    } catch (error) { 
      console.error("Error submitting person:", error); 
    } 
  }; 
 
  const handleDelete = async (id: number) => { 
    try { 
      await deletePerson(id); 
      console.log("Person deleted successfully"); 
      fetchPersons(); // Refresh the list after deleting 
    } catch (error) { 
      console.error("Error deleting person:", error); 
    } 
  }; 
 
  const handleUpdateClick = (person: Person) => { 
    // Populate the form with the selected person's data 
    setFirstName(person.firstName); 
    setLastName(person.lastName); 
    setPhone(person.phone); 
    setEmail(person.email); 
    setGender(person.gender); 
    setDate(new Date(person.date)); // Assuming dateOfBirth is a string 
    setEditingPersonId(person.id); // Set the ID for updating 
  }; 
 
  const resetForm = () => { 
    // Clear the form after submission or update 
    setFirstName(""); 
    setLastName(""); 
    setPhone(""); 
    setEmail(""); 
    setGender("Select Gender"); 
    setDate(new Date()); 
    setEditingPersonId(null); // Reset ID for creating new entries 
  }; 
 
  return (
    //using gesturehandlerrootview instead of scrollview
    <ScrollView>
    <View style={styles.container}> 
      <Text style={styles.header}>Data Entry Form</Text>

      {/*Number Input*/}
      <Text>Number of Occupants</Text>
      <TextInput
      style={styles.input}
      placeholder="Enter Number of Occupants"
      />
 
      {/* Text Input 1 */} 
      <TextInput 
        style={styles.input} 
        placeholder="Enter text 1" 
        value={firstName} 
        onChangeText={setFirstName} 
        placeholderTextColor="#888" // Modern touch: lighter placeholder color 
      /> 
 
      {/* Text Input 2 */} 
      <TextInput 
        style={styles.input} 
        placeholder="Enter text 2" 
        value={lastName} 
        onChangeText={setLastName} 
        placeholderTextColor="#888" 
      /> 
 
      {/* Number Input */} 
      <TextInput 
        style={styles.input} 
        placeholder="Enter a number" 
        value={phone} 
        onChangeText={setPhone} 
        keyboardType="numeric" 
        placeholderTextColor="#888" 
      /> 
 
      {/* Email Input */} 
      <TextInput 
        style={styles.input} 
        placeholder="Enter email" 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address" 
        autoCapitalize="none" // Emails are typically lowercase 
        placeholderTextColor="#888" 
      /> 
 
      {/* Dropdown Picker */} 
      <Picker 
        selectedValue={gender} 
        onValueChange={(itemValue) => setGender(itemValue)} 
        style={styles.picker} 
      > 
        <Picker.Item label={"Select Gender"} /> 
        <Picker.Item label="Male" value="male" /> 
        <Picker.Item label="Female" value="female" /> 
        <Picker.Item label="Other" value="other" /> 
      </Picker> 
 
      {/* Date Picker */} 
      <View> 
        <Button 
          title="Select Date of Birth" 
          onPress={() => setShowDatePicker(true)} 
        ></Button> 
        {showDatePicker && ( 
          <DateTimePicker 
            value={date} 
            mode="date" 
            display="default" 
            onChange={onChangeDate} 
          /> 
        )} 
        <Text style={styles.dateText}> 
          Date of Birth: {date.toDateString()} 
        </Text> 
      </View> 
 
      <Button 
          title={selectedPerson ? "Update" : "Submit"} 
          onPress={handleSubmit} 
        /> 
 
        {/* Table to display records */} 
        <View style={styles.tableContainer}> 
          <View style={styles.tableHeader}> 
            <Text style={styles.tableHeaderText}>First Name</Text> 
            <Text style={styles.tableHeaderText}>Last Name</Text> 
            <Text style={styles.tableHeaderText}>Phone</Text> 
            <Text style={styles.tableHeaderText}>Email</Text> 
            <Text style={styles.tableHeaderText}>Gender</Text> 
            <Text style={styles.tableHeaderText}>Date of Birth</Text> 
            <Text style={styles.tableHeaderText}>Actions</Text> 
          </View> 
          {persons.map((person) => ( 
            <View key={person.id} style={styles.tableRow}> 
              <Text style={styles.tableRowText}>{person.firstName}</Text> 
              <Text style={styles.tableRowText}>{person.lastName}</Text> 
              <Text style={styles.tableRowText}>{person.phone}</Text> 
              <Text style={styles.tableRowText}>{person.email}</Text> 
              <Text style={styles.tableRowText}>{person.gender}</Text> 
              <Text style={styles.tableRowText}> 
                {new Date(person.date).toDateString()} 
              </Text> 
              <View style={styles.actionButtons}> 
                <TouchableOpacity 
                  style={styles.updateButton} 
                  onPress={() => handleUpdateClick(person)} 
                > 
                  <Text style={styles.buttonText}>Update</Text> 
                </TouchableOpacity> 
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => handleDelete(person.id)} 
                > 
                  <Text style={styles.buttonText}>Delete</Text> 
                </TouchableOpacity> 
              </View> 
            </View> 
          ))} 
        </View>
    </View>
    </ScrollView>
  ); 
}; 
 
// Styling for a modern look 
const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f194ff",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  picker: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  dateText: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    color: "#666",
  },
  personContainer: {
    marginBottom: 20,
  },
  tableContainer: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableRowText: {
    flex: 1,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
  },
  updateButton: {
    backgroundColor: "#4CAF50",
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: { backgroundColor: "#F44336", padding: 5, borderRadius: 5 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

export default dataentry; 