import { View, Text,TextInput } from 'react-native'
import React,{useState}from 'react'
import { Ionicons } from '@expo/vector-icons';
import { collection, getFirestore, getDocs, orderBy, query, where, startAt, endAt } from 'firebase/firestore';
import { app } from '../../../firebaseConfig';

export default function SearchBar() {
    const db = getFirestore(app);
    const [jobItemList, setJobItemList] = useState([]);

    const searchJobItems = async (query) => {
        setJobItemList([]); // Clear previous job items
        const q = query.toLowerCase(); // Convert query to lowercase for case-insensitive search
        const qRef = collection(db, 'UserPost');
        const searchQuery = query(qRef, 'title', '>=', q).where('title', '<=', q + '\uf8ff');
        const querySnapshot = await getDocs(searchQuery);
        const searchData = [];
        querySnapshot.forEach((doc) => {
          searchData.push(doc.data());
        });
        setJobItemList(searchData);
      };
  return (
    <View>
      {/* search bar*/}
    <View style={{ padding: 10, paddingHorizontal: 5, backgroundColor: 'gray', borderRadius: 50, marginTop: 5,flexDirection:'row',alignItems:'center',}}>
    <Ionicons name="search" size={24} color="white"style={{marginLeft:5}} />
      <TextInput placeholder='Search' placeholderTextColor='white' style={{ color: 'white',marginLeft:5 }} onChangeText={searchJobItems}/>
    </View>
    </View>
  )
}