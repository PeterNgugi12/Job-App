import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchByLocation({ onSearch }) {
    const [searchText, setSearchText] = useState('');

    const handleSearch = (text) => {
        setSearchText(text);
        if (text.length >= 3) {
            onSearch(text);
        }
    };

    return (
        <View>
            {/* search bar*/}
            <View style={{ padding: 10, paddingHorizontal: 5, backgroundColor: '#0a85ed', borderRadius: 50, marginTop: 5, flexDirection: 'row', alignItems: 'center', }}>
                <Ionicons name="search" size={24} color="white" style={{ marginLeft: 5 }} />
                <TextInput placeholder='Search by Title & Location' placeholderTextColor='white' style={{ color: 'white', marginLeft: 5 }} onChangeText={handleSearch} value={searchText} />
            </View>
        </View>
    )
}
