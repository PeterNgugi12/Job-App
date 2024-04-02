import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ProfileScreen from '../Apps/Screens/ProfileScreen'
import SkillScreen from '../Apps/Screens/SkillScreen'
import JobDetails from '../Apps/Screens/JobDetails'
import CustomerCareScreen from '../Apps/Screens/CustomerCareScreen'
import ReportClientScreen from '../Apps/Screens/ReportClientScreen'
import ReportWorkerScreen from '../Apps/Screens/ReportWorkerScreen'
import FaqScreen from '../Apps/Screens/FaqScreen'
import TermsScreen from '../Apps/Screens/TermsScreen'
import ViewProfileScreen from '../Apps/Screens/ViewProfileScreen'

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
      <Stack.Screen name='customer' component={CustomerCareScreen}  options={{
         headerStyle:{
            backgroundColor:'white'
        },
        headerTintColor:'black',
        headerTitle:'Customer Care'
    }}/>
      <Stack.Screen name='report-client' component={ReportClientScreen}  options={{
         headerStyle:{
            backgroundColor:'white'
        },
        headerTintColor:'black',
        headerTitle:'Report Client'
    }}/>
      <Stack.Screen name='report-worker' component={ReportWorkerScreen}  options={{
         headerStyle:{
            backgroundColor:'white'
        },
        headerTintColor:'black',
        headerTitle:'Report Worker'
    }}/>
      <Stack.Screen name='faq' component={FaqScreen}  options={{
         headerStyle:{
            backgroundColor:'white'
        },
        headerTintColor:'black',
        headerTitle:'FAQ'
    }}/>
      <Stack.Screen name='terms' component={TermsScreen}  options={{
         headerStyle:{
            backgroundColor:'white'
        },
        headerTintColor:'black',
        headerTitle:'Terms'
    }}/>
      <Stack.Screen name='view-profile' component={ViewProfileScreen}  options={{
         headerStyle:{
            backgroundColor:'white'
        },
        headerTintColor:'black',
        headerTitle:'Profile'
    }}/>
  </Stack.Navigator>
  )
}