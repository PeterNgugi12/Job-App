import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreenStackNav from './HomeScreenStackNav'; // Import the stack navigator for the Home screen
import ExploreScreenNav from './ExploreScreenNav';
import AddPostScreen from '../Apps/Screens/AddPostScreen';
import EarnScreen from '../Apps/Screens/EarnScreen';
import ProfileScreenStackNav from './ProfileScreenStackNav';

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name='home-nav'
        component={HomeScreenStackNav} // Use the stack navigator for the Home screen
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color: color, fontSize: 12, marginBottom: 3 }}>Home</Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name='explore'
        component={ExploreScreenNav}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color: color, fontSize: 12, marginBottom: 3 }}>Explore</Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={24} color="black" />
          )
        }}
      />
      <Tab.Screen
        name='earn'
        component={EarnScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color: color, fontSize: 12, marginBottom: 3 }}>Earn</Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash-outline" size={24} color="black" />
          )
        }}
      />
      <Tab.Screen
        name='profile'
        component={ProfileScreenStackNav}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color: color, fontSize: 12, marginBottom: 3 }}>Profile</Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-box" size={24} color="black" />
          )
        }}
      />
    </Tab.Navigator>
  );
}


