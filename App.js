import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from './Navigations/TabNavigation';
import LoginScreen from './Apps/Screens/LoginScreen';

export default function App() {
  return (
    <ClerkProvider publishableKey='pk_test_cHJlY2lzZS1yb2RlbnQtODIuY2xlcmsuYWNjb3VudHMuZGV2JA'
      
    >
      <View style={styles.container}>
        <StatusBar style="auto" />
        
        <NavigationContainer>
          <SignedIn>
            <TabNavigation />
          </SignedIn>
          <SignedOut>
            <LoginScreen />
          </SignedOut>
        </NavigationContainer>
      </View>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});




