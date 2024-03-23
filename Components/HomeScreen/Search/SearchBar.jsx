import { View, TextInput, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { collection, getFirestore, getDocs, orderBy, where } from 'firebase/firestore';
import { app } from '../../../firebaseConfig';

export default function SearchBar() {
    const db = getFirestore(app);
    const [search, setSearch] = useState([]);

    const getSearch = async (text) => {
        setSearch([]);
        const querySnapshot = await getDocs(
            collection(db, 'UserPost'),
            where('title', '==', text), // Add where clause for search
            orderBy('createdAt', 'desc')
        );
        querySnapshot.forEach((doc) => {
          setSearch((search) => [...search, doc.data()]);
        });
    };

    return (
        <View style={styles.container}>
            <Ionicons name="search" size={24} color="white" style={styles.icon} />
            <TextInput
                placeholder='Search'
                placeholderTextColor='white'
                style={styles.input}
                value={search}
                onChangeText={(text) => getSearch(text)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingHorizontal: 5,
        backgroundColor: 'gray',
        borderRadius: 50,
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginLeft: 5,
    },
    input: {
        color: 'white',
        marginLeft: 5,
        flex: 1,
    },
});




