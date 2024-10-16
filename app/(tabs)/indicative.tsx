import { addLocation, deleteLocations, getLocations, initializeDB, updateLocations, Location } from '@/database';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { Picker } from "@react-native-picker/picker"; 


const EnumerationAreaScreen = () => {
  const [enumerationArea, setEnumerationArea] = useState('');
  const [province, setProvince] = useState('Select Province');
  const [district, setDistrict] = useState('Select District');
  const [llg, setLLG] = useState('Select LLG');
  const [ward, setWard] = useState('Select Ward');
  const [censusUnit, setCensusUnit] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [editingLocationId, setEditingLocationId] = useState<number | null>(null);

 
  // Function to handle form submission 
  const fetchLocations = async () => { 
    const allLocations = await getLocations(); 
    setLocations (allLocations);
  }; 
 
  useEffect(() => { 
    const setupDatabase = async () => { 
      await initializeDB(); 
      fetchLocations(); 
    }; 
 
    setupDatabase(); 
  }, []); 
 

  const handdleSubmit = async () => {
    if (
      !enumerationArea || 
      province === "Select Province" ||
      district === "Select District" ||
      llg === "Select LLG" ||
      ward === "Select Ward" ||
      !censusUnit
    ) {
      Alert.alert("Error", "Please fill in all fields correctly.");
      return;
    }

    try {
      if (editingLocationId) {
        // Update existing location
        await updateLocations(
          editingLocationId, 
          enumerationArea, 
          province, 
          district, 
          llg, 
          ward, 
          censusUnit
        );
        console.log("Location updated successfully");
    } else {
      // Add new location
      const id = await addLocation(
        enumerationArea, 
        province, 
        district, 
        llg, 
        ward, 
        censusUnit
      );
      console.log("Location added successfully");
    }
      resetForm();
      fetchLocations(); // Refresh the list after adding/updating
    } catch (error) {
      console.error("Error adding location:", error);
    }
  };

  const handleDeleteClick = async (id: number) => {
    try {
      await deleteLocations(id);
      fetchLocations(); // Refresh the list after deleting
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };
 
  const handleUpdateClick = (location: Location) => { 
    setEnumerationArea(location.enumerationArea); 
    setProvince(location.province); 
    setDistrict(location.district); 
    setLLG(location.llg); 
    setWard(location.ward); 
    setCensusUnit(location.censusUnit); 
    setEditingLocationId(location.id);
  }; 
 
  const resetForm = () => { 
    // Clear the form after submission or update 
    setEnumerationArea(""); 
    setProvince("Select Province"); 
    setDistrict("Select District"); 
    setLLG("Select LLG"); 
    setWard("Select Ward"); 
    setCensusUnit(""); 
    setEditingLocationId(null); // Reset ID for creating new entries
  }; 

  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <Image source={require('@/assets/images/interface-head-logo.png')} style={styles.reactLogo} />
        </View>
      <Text style={styles.header}>INDICATIVE INFORMATION</Text>

      <Text style={styles.label}>Workload No./Enumeration Area:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter enumeration area"
        value={enumerationArea}
        onChangeText={setEnumerationArea}
      />

      <Text style={styles.label}>Province:</Text>
      <View style={styles.pickerContainer}>
      <Picker selectedValue={province} 
      onValueChange={(itemValue) => setProvince(itemValue)}
      >
        <Picker.Item label={"Select Province"}/>
        <Picker.Item label="ENB" value="enb"/>
        {/* Add provinces */}
      </Picker>
      </View>

      <Text style={styles.label}>District:</Text>
      <View style={styles.pickerContainer}>
      <Picker selectedValue={district} 
      onValueChange={(itemValue) => setDistrict(itemValue)}
      >
        <Picker.Item label={"Select District"}/>
        <Picker.Item label="Rabaul" value="rabaul"/>
        {/* Add districts */}
      </Picker>
      </View>

      <Text style={styles.label}>Local Level Government (LLG):</Text>
      <View style={styles.pickerContainer}>
      <Picker selectedValue={llg} 
      onValueChange={(itemValue) => setLLG(itemValue)}
      >
        <Picker.Item label={"Select LLG"}/>
        <Picker.Item label="Kombiu Rural" value="kombiurural"/>
        {/* Add LLGs */}
      </Picker>  
      </View>

      <Text style={styles.label}>Ward:</Text>
      <View style={styles.pickerContainer}>
      <Picker selectedValue={ward} 
      onValueChange={(itemValue) => setWard(itemValue)}
      >
        <Picker.Item label={"Select District"}/>
        <Picker.Item label="01. Baai" value="01baai"/>
        {/* Add wards */}
      </Picker> 
      </View>


      <Text style={styles.label}>Census Unit (CU):</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your census unit"
        value={censusUnit}
        onChangeText={setCensusUnit}
      />

      <Button title="Next" 
      color="#f194ff"
      onPress={() => {/* Handle submit */}} />
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center"
  },
  label: {
    marginVertical: 10,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f194ff",
    textAlign: "center",
    marginBottom: 30,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 5,
  },
  reactLogo: {
    height:120,
    width: 375,
    top: -10,
    left: 0,
    position: 'relative'
  }
});

export default EnumerationAreaScreen;