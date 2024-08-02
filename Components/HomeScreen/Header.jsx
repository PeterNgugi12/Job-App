import { View, Text, Image, TextInput } from 'react-native'
import React, { useState, useEffect }  from 'react'
import { useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons';
import SearchBar from './Search/SearchBar';

export default function Header() {

    const {user}=useUser()
 
  return (
    <View style={{marginTop:20}}>
        {/*user info section */}
    <View style={{flexDirection:'row',alignItems:'center'}}>
      <Image source={{uri:user?.imageUrl}} style={{width:50,height:50,borderRadius:25}}/>
      <View>
        <Text style={{color:"black",fontSize:18}}>Welcome</Text>
        <Text style={{fontSize:15,fontWeight:'bold',color:'black'}}>Hi, {user?.fullName}</Text>
      </View>
    </View>
    {/* search bar*/}
    </View>
  )
}

