import { View, Text, Image, TouchableHighlight } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function PostItem({item}) {
  const navigation=useNavigation()

  return (
    <TouchableHighlight
    style={{ flex: 1, margin: 4, borderRadius: 10, backgroundColor: 'white', elevation: 5,padding:5 }}
    underlayColor="#DDDDDD" // Background color when touched
    onPress={() =>navigation.push('job-detail',{
      job:item
    })} // Handle item press event
  >
    <View>
      <Image source={{ uri: item.profileImage }} style={{ width: 100, height: 100, borderRadius: 50 ,marginLeft:25,marginTop:10}} />
      <View style={{ padding: 10 }}>
        
        <Text style={{ fontSize: 15, fontWeight: 'bold', marginTop: 2, textAlign:"center"}}>Job:{item.title}</Text>
        <Text style={{padding:1,color:'white',backgroundColor:'black',borderRadius:50,alignItems:'center',textAlign:"center"}}>{item.category}</Text>
        <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'blue',textAlign:"center"}}>Hire Me ksh{item.price}</Text>
      </View>
    </View>
  </TouchableHighlight>
  )
}