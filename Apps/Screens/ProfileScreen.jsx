import React from 'react';
import { View, Text, Image, TouchableOpacity,StyleSheet, ScrollView} from 'react-native';
import { useUser,useAuth } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user } = useUser();
  const navigation=useNavigation()
  const {isLoaded,signOut}=useAuth()
  
  const onWorkPress = (item) => {
    if (item === 'Logout') {
      signOut();
      return;
    }
    item?.path ? navigation.navigate(item.path) : null;
  };

  return (
    <ScrollView style={{ padding: 5 }}>
      <View style={{ marginTop: 35, marginLeft:20 }}>
        <Image source={{ uri: user?.imageUrl }} style={{ width: 50, height: 50, borderRadius: 25, justifyContent:'flex-start' }} />
        <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 2 }}>{user?.fullName}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('view-profile')}   style={styles.viewProfile}>
           <Text style={styles.viewProfileText}>View Profile</Text>
          </TouchableOpacity>
      </View>
      <View style={{marginTop:20,borderBottomWidth: 1,borderBottomColor: 'grey',paddingBottom:10}}>
          <Text style={{fontSize:22,marginLeft:20,fontWeight:'bold',}}>Account Setting</Text>
          <TouchableOpacity onPress={() => navigation.navigate('skill')} style={{marginTop:15,marginLeft:20,flexDirection:'row',justifyContent:'space-between'}} >
            <Text style={{fontSize:16,fontWeight:'500'}}>Skills Information</Text>
            <AntDesign name="right" size={20} color="black" />
          </TouchableOpacity>
      </View>
      <View style={{marginTop:20,borderBottomWidth: 1,borderBottomColor: 'grey',paddingBottom:10}}>
          <Text style={{fontSize:22,marginLeft:20,fontWeight:'bold',}}>Explore</Text>
          <TouchableOpacity onPress={() => navigation.navigate('explore')} style={{marginTop:15,marginLeft:20,flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={{fontSize:16,fontWeight:'500'}}>Explore</Text>
            <AntDesign name="right" size={20} color="black" />
          </TouchableOpacity>
      </View>
      <View style={{marginTop:20,borderBottomWidth: 1,borderBottomColor: 'grey',paddingBottom:10}}>
          <Text style={{fontSize:22,marginLeft:20,fontWeight:'bold',}}>Support</Text>
          <TouchableOpacity onPress={() => navigation.navigate('customer')} style={{marginTop:15,marginLeft:20,flexDirection:'row',justifyContent:'space-between',borderBottomWidth: 1,borderBottomColor: 'grey',paddingBottom:10}}>
            <Text style={{fontSize:16,fontWeight:'500',}}>Customer Care support</Text>
            <AntDesign name="right" size={20} color="black" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => navigation.navigate('faq')} style={{marginTop:15,marginLeft:20,flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={{fontSize:16,fontWeight:'500'}}>FAQ</Text>
            <AntDesign name="right" size={20} color="black" />
          </TouchableOpacity>
      </View>
      <View style={{marginTop:20,borderBottomWidth: 1,borderBottomColor: 'grey',paddingBottom:10}}>
          <Text style={{fontSize:22,marginLeft:20,fontWeight:'bold',}}>Legal</Text>
          <TouchableOpacity onPress={() => navigation.navigate('terms')} style={{marginTop:15,marginLeft:20,flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={{fontSize:16,fontWeight:'500'}}>Terms of Services</Text>
            <AntDesign name="right" size={20} color="black" />
          </TouchableOpacity>
      </View>
      <View style={{alignItems:'center',marginTop:20}}>
        <TouchableOpacity onPress={() => onWorkPress('Logout')}>
               <Text style={{fontSize:15,backgroundColor:'#0a85ed',color:'white',borderRadius:10,width:100,textAlign:'center',padding:10}}>Sign Out</Text>
        </TouchableOpacity>
        
      </View>
      
      <View style={{height:100}}/>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  viewProfile: {
    borderBottomColor: 'black', // Border color
    marginLeft:10
  },
  viewProfileText: {
    fontSize: 18,
    marginTop: 2,
    textDecorationLine: 'underline', // Add underline
  },
});

