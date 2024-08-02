import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Apps/Screens/HomeScreen'
import JobList from '../Apps/Screens/JobList';
import JobDetails from '../Apps/Screens/JobDetails';
import MapScreen from '../Apps/Screens/MapScreen';
import AddPostScreen from '../Apps/Screens/AddPostScreen';

import { Ionicons } from '@expo/vector-icons';
import EarnScreen from '../Apps/Screens/EarnScreen';

const Stack = createStackNavigator();
export default function HomeScreenStackNav() {
  return (
    <Stack.Navigator>
    <Stack.Screen name="home" component={HomeScreen} options={{
        headerShown:false
    }}/>
    <Stack.Screen name="job-list" component={JobList}  options={({ route })=>({title: route.params.category,
    headerStyle:{
        backgroundColor:'white'
    },
    headerTintColor:'black'
    })}/>
    <Stack.Screen name="job-detail" component={JobDetails} options={{
         headerStyle:{
            backgroundColor:'white'
        },
        headerTintColor:'black',
        headerTitle:'Job Description'
    }}
     />
    
    <Stack.Screen name="MapScreen" component={MapScreen} options={{
         headerStyle:{
            backgroundColor:'white'
        },
        headerTintColor:'black',
        headerTitle:'Location'
    }}
     />
   
   <Stack.Screen 
    name="addpost" 
    component={AddPostScreen} 
    options={({ navigation }) => ({
        headerStyle: {
            backgroundColor: 'white'
        },
        headerTintColor: 'black', 
        headerTitle: 'Post',
        headerLeft: () => (
            <TouchableOpacity>
                <Ionicons name="arrow-back" size={24} color="black" style={{ marginLeft: 15 }} />
            </TouchableOpacity>
        ),
    })}
/>
    
  </Stack.Navigator>
  )
}