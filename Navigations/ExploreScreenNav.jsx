import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ExploreScreen from '../Apps/Screens/ExploreScreen'
import JobDetails from '../Apps/Screens/JobDetails'


const Stack=createStackNavigator()
export default function ExploreScreenNav() {
  return (
    <Stack.Navigator>
        <Stack.Screen name='explore-tab' component={ExploreScreen}  options={{
        headerShown:false
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