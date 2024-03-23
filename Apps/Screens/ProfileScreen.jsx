import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useUser,useAuth } from '@clerk/clerk-expo';
import dairy from './../../assets/images/dairy.png';
import search from './../../assets/images/search.jpg';
import logout from './../../assets/images/logout.png';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const { user } = useUser();
  const navigation=useNavigation()
  const {isLoaded,signOut}=useAuth()
  const workList = [
    {
      id: 1,
      name: 'My Skills',
      icon: dairy,
      path:'skill'
    },
    {
      id: 2,
      name: 'Explore',
      icon: search,
      path:'explore'
    },
    {
      id: 3,
      name: 'Logout',
      icon: logout
    },
  ];
  const onWorkPress=(item)=>{
    if(item.name=='Logout')
    {
      signOut()
      return;
    }
   item?.path?navigation.navigate(item.path):null; 
  }

  return (
    <View style={{ padding: 5 }}>
      <View style={{ alignItems: 'center', marginTop: 25 }}>
        <Image source={{ uri: user?.imageUrl }} style={{ width: 100, height: 100, borderRadius: 50, justifyContent: 'center' }} />
        <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 2 }}>{user?.fullName}</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 18, marginTop: 2 }}>{user?.primaryEmailAddress?.emailAddress}</Text>
      </View>
      {workList.map((item) => (
        <TouchableOpacity onPress={()=>onWorkPress(item)} key={item.id} style={{ alignItems: 'center', marginTop: 10 }}>
          <Image source={item.icon} style={{ width: 50, height: 50 }} />
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 5 }}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
