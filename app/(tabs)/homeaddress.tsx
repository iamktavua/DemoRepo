import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import {
    addHomeaddress,
    getHomeaddress,
    updateHomeaddress,
    deleteHomeaddress,
    initializeDB,
    Homeaddress,
} from '@/database';
import { TextInput } from 'react-native-gesture-handler';

const homeaddress = () => {
    // States for input
    const [locality, setLocality] = useState('');
    const [section, setSection] = useState('');
    const [lot, setLot] = useState('');
    const [structureRecordNo, setStructureRecordNo] = useState('');
    const [pdNo, setPdNo] = useState('');
    const [houseNo, setHouseNo] = useState('');
    const [homeaddress, setHomeaddress] = useState<Homeaddress[]>([]);
    const [selectedHomeaddress, setSelectedHomeaddress] = useState<Homeaddress | null>(null);
    const [editingHomeaddressId, setEditingHomeaddressId] = useState<number | null>(null);

    // Function to handle form submission
    const fetchHomeaddress = async () => {
        const allHomeaddress = await getHomeaddress();
        setHomeaddress(allHomeaddress);
    };

    useEffect(() => {
        const setupDatabase = async () => {
            await initializeDB();
            fetchHomeaddress();
        };

        setupDatabase();
    }, []);

    const handdleSubmit = async () => {
        if (
            !locality || 
            !section || 
            !lot || 
            !structureRecordNo || 
            !pdNo || 
            !houseNo
        ) {
            Alert.alert('Error', 'Please fill in all fields correctly');
            return;
        }

        try {
            if (editingHomeaddressId) {
                // Update existing homeaddress
                await updateHomeaddress(
                    editingHomeaddressId,
                    locality,
                    section,
                    lot,
                    structureRecordNo,
                    pdNo,
                    houseNo
                );
                console.log('Homeaddress updated successfully');
            } else {
                // Add new homeaddress
                const id = await addHomeaddress(
                    locality,
                    section,
                    lot,
                    structureRecordNo,
                    pdNo,
                    houseNo
                );
                console.log('Homeaddress created successfully with ID:', id);
            }
            resetForm();
            fetchHomeaddress(); // Refresh the list after saving
        } catch (error) {
            console.error('Error saving homeaddress:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteHomeaddress(id);
            console.log('Homeaddress deleted successfully');
            fetchHomeaddress(); // Refresh the list after deleting
        } catch (error) {
            console.error('Error deleting homeaddress:', error);
        }
    };

    const handleUpdateClick = (homeaddress: Homeaddress) => {
        // Populate the form with the selected homeaddress's data
        setLocality(homeaddress.locality);
        setSection(homeaddress.section);
        setLot(homeaddress.lot);
        setStructureRecordNo(homeaddress.structure_record_no);
        setPdNo(homeaddress.pd_no);
        setHouseNo(homeaddress.house_no);
        setEditingHomeaddressId(homeaddress.id);
    };

    const resetForm = () => {
        // Clear the form after submission or update
        setLocality("");
        setSection("");
        setLot("");
        setStructureRecordNo("");
        setPdNo("");
        setHouseNo("");
        setEditingHomeaddressId(null); // Reset the ID for creating new entries
    };

    return (
        <View>
            <Text style={styles.header}>Home Address</Text>

            <Text style={styles.label}>Locality</Text>
            <TextInput
            style={styles.input}
            placeholder='Enter current locality'
            value={locality}
            onChangeText={setLocality}
            />
        </View>
    )
    
};

const styles = StyleSheet.create({
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
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    label: {
        marginVertical: 10,
        fontWeight: "bold",
    },
});

export default homeaddress;


