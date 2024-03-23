import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ProfileScreen from '../Apps/Screens/ProfileScreen'
import SkillScreen from '../Apps/Screens/SkillScreen'
import JobDetails from '../Apps/Screens/JobDetails'

const Stack=createStackNavigator()

export default function ProfileScreenStackNav() {
  return (
  <Stack.Navigator>
    <Stack.Screen name='profile-tab' component={ProfileScreen} options={{
        headerShown:false
    }}/>
    <Stack.Screen name='skill' component={SkillScreen}  options={{
         headerStyle:{
            backgroundColor:'white'
        },
        headerTintColor:'black',
        headerTitle:'My Skills'
    }}/>
      <Stack.Screen name='job-detail' component={JobDetails}  options={{
         headerStyle:{
            backgroundColor:'white'
        },
        headerTintColor:'black',
        headerTitle:'Job Description'
    }}/>
  </Stack.Navigator>
  )
}