import { View, Text, Image, TextInput } from 'react-native'
import React, { useState, useEffect }  from 'react'
import { useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons';
import SearchBar from './Search/SearchBar';

export default function Header() {

    const {user}=useUser()
 
  return (
    <View>
        {/*user info section */}
    <View style={{flexDirection:'row',alignItems:'center'}}>
      <Image source={{uri:user?.imageUrl}} style={{width:30,height:30,borderRadius:15}}/>
      <View>
        <Text style={{color:"black",fontSize:18}}>Welcome</Text>
        <Text style={{fontSize:15,fontWeight:'bold',color:'black'}}>{user?.fullName}</Text>
      </View>
    </View>
    {/* search bar*/}
    <SearchBar />
    </View>
  )
}

