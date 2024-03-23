import { View, Text, Image, TextInput } from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons';

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
    <View style={{ padding: 10, paddingHorizontal: 5, backgroundColor: 'gray', borderRadius: 50, marginTop: 5,flexDirection:'row',alignItems:'center',}}>
    <Ionicons name="search" size={24} color="white"style={{marginLeft:5}} />
      <TextInput placeholder='Search' placeholderTextColor='white' style={{ color: 'white',marginLeft:5 }} onChangeText={(value)=>console.log(value)}/>
    </View>
    </View>
  )
}

