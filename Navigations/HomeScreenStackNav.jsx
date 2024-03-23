import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Apps/Screens/HomeScreen'
import JobList from '../Apps/Screens/JobList';
import JobDetails from '../Apps/Screens/JobDetails';
import MapScreen from '../Apps/Screens/MapScreen';
import AddPostScreen from '../Apps/Screens/AddPostScreen';
import EditPostScreen from '../Apps/Screens/EditPostScreen';

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
    <Stack.Screen name="addpost" component={AddPostScreen} options={{
         headerStyle:{
            backgroundColor:'white'
        },
        headerTintColor:'black', 
        headerTitle:'Post'
    }}
     />
    <Stack.Screen name="EditPost" component={EditPostScreen} options={{
         headerStyle:{
            backgroundColor:'white'
        },
        headerTintColor:'black', 
        headerTitle:'Post'
    }}
     />
  </Stack.Navigator>
  )
}