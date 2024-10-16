import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('census');

export interface Person {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    date: string; // Consider using a Date type depending on your date format
    gender: string;
}

export interface Location {
    id: number;
    enumerationArea: string;
    province: string;
    district: string;
    llg: string;
    ward: string;
    censusUnit: string;
}

export interface HomeAddress {
    id: number;
    locality: string;
    section: number;
    lot: number;
    structure_record_no: number;
    pd_no: number;
    house_no: number;
}

export const initializeDB = async () => {
    await db.execAsync(`
        PRAGMA journal_mode = WAL;

        CREATE TABLE IF NOT EXISTS person (
        id INTEGER PRIMARY KEY NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        date TEXT NOT NULL,
        gender TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS location (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        enumeration_area TEXT NOT NULL,
        province TEXT NOT NULL,
        district TEXT NOT NULL,
        llg TEXT NOT NULL,
        ward TEXT NOT NULL,
        census_unit TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS home_address (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        locality TEXT NOT NULL,
        section INTEGER NOT NULL,
        lot INTEGER NOT NULL,
        structure_record_no INTEGER NOT NULL,
        pd_no INTEGER NOT NULL,
        house_no INTEGER NOT NULL
        );
    `);
};

// Person
export const addPerson = async (firstName: string, lastName: string, phone: string, email: string, date: string, gender: string) => {
    try {
        const result = await db.runAsync('INSERT INTO person (firstName, lastName,phone, email, date, gender) VALUES (?, ?, ?, ?, ?, ?)', firstName, lastName,phone, email, date, gender);
        return result.lastInsertRowId;
    } catch (error) {
        console.error("Error adding person:", error);
    }
};
    
export const updatePerson = async (id: number, firstName: string, lastName: string, phone: string, email: string, date: string, gender: string) => {
        try {
            await db.runAsync('UPDATE person SET firstName = ?, lastName = ?, phone =?, email = ?, date = ?, gender = ? WHERE id = ?', firstName, lastName, phone,email, date, gender, id);
        } catch (error) {
            console.error("Error updating person:", error);
        }
    };

export const deletePerson = async (id: number) => {
    try {
        await db.runAsync('DELETE FROM person WHERE id = ?', id);
    } catch (error) {
        console.error("Error deleting person:", error);
    }
};

export const getPersons = async () => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM person') as Person[];
        return allRows;
    } catch (error) {
        console.error("Error getting persons:", error);
        return [];
    }
};


// Indicative information 
export const addLocation = async (enumerationArea: string, province: string, district: string, llg: string, ward: string, censusUnit: string) => {
    try {
        const result = await db.runAsync('INSERT INTO location (enumerationArea, province, district, llg, ward, censusUnit) VALUES (?, ?, ?, ?, ?, ?)', enumerationArea, province, district, llg, ward, censusUnit);
        return result.lastInsertRowId;
    } catch (error) {
        console.error("Error adding location:", error);
    }
};

export const updateLocations = async (id: number, enumerationArea: string, province: string, district: string, llg: string, ward: string, censusUnit: string) => {
    try {
        await db.runAsync('UPDATE location SET enumerationArea = ?, province = ?, district = ?, llg = ?, ward = ?, censusUnit = ?, WHERE id = ?', enumerationArea, province, district, llg, ward, censusUnit, id);
    } catch (error) {
        console.error("Error updating location:", error);
    }
};

export const deleteLocations = async (id: number) => {
    try {
        await db.runAsync('DELETE FROM location WHERE id = ?', id);
    } catch (error) {
        console.error("Error deleting location:", error);
    }
};

export const getLocations = async () => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM location') as Location[];
        return allRows;
    } catch (error) {
        console.error("Error getting locations:", error);
        return [];
    }
};


// Home Address Information
export const addHomeAddress = async (locality: string, section: number, lot: number, structureRecordNo: number, pdNo: number, houseNo: number) => {
    try {
        const result = await db.runAsync('INSERT INTO home_address (locality, section, lot, structure_record_no, pd_no, house_no) VALUES (?, ?, ?, ?, ?, ?)', locality, section, lot, structureRecordNo, pdNo, houseNo);
        return result.lastInsertRowId;
    } catch (error) {
        console.error("Error adding home address:", error);
    }
};

export const updateHomeAddress = async (id: number, locality: string, section: number, lot: number, structureRecordNo: number, pdNo: number, houseNo: number) => {
    try {
        await db.runAsync('UPDATE home_address SET locality = ?, section = ?, lot = ?, structure_record_no = ?, pd_no = ?, house_no = ? WHERE id = ?', locality, section, lot, structureRecordNo, pdNo, houseNo, id);
    } catch (error) {
        console.error("Error updating home address:", error);
    }
};

export const deleteHomeAddress = async (id: number) => {
    try {
        await db.runAsync('DELETE FROM home_address WHERE id = ?', id);
    } catch (error) {
        console.error("Error deleting home address:", error);
    }
};

export const getHomeAddress = async () => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM home_address') as HomeAddress[];
        return allRows;
    } catch (error) {
        console.error("Error getting home address:", error);
        return [];
    }
}