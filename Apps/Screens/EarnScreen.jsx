import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function EarnScreen({ navigation }) {
  const [trialExpired, setTrialExpired] = useState(false);

  useEffect(() => {
    const trialTimer = setTimeout(() => {
      setTrialExpired(true);
    }, 7 * 24 * 60 * 60 * 1000); // 7 days trial period
    return () => clearTimeout(trialTimer);
  }, []);

  const handleSubscriptionSelection = async (subscriptionType) => {
    if (subscriptionType === 'Trial' && !trialExpired) {
      navigation.navigate('addpost', { subscriptionType });
    } else {
      // Navigate to payment screen
      navigation.navigate('addpost', { subscriptionType });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Select Subscription Package</Text>
        {!trialExpired && (
          <View style={styles.subscriptionOption}>
            <TouchableOpacity style={styles.subscriptionButton} onPress={() => handleSubscriptionSelection('Trial')}>
              <Text style={styles.subscriptionText}>Start 7 Days Trial </Text>
            </TouchableOpacity>
            
          </View>
        )}
        <View style={styles.subscriptionOption}>
          <TouchableOpacity style={styles.subscriptionButton} onPress={() => handleSubscriptionSelection('Daily')}>
            <Text style={styles.subscriptionText}>Daily Subscription</Text>
          </TouchableOpacity>
          <Text style={styles.subscriptionPrice}>(Ksh 15)</Text>
        </View>
        <View style={styles.subscriptionOption}>
          <TouchableOpacity style={styles.subscriptionButton} onPress={() => handleSubscriptionSelection('Monthly')}>
            <Text style={styles.subscriptionText}>Monthly Subscription</Text>
          </TouchableOpacity>
          <Text style={styles.subscriptionPrice}>(Ksh 250)</Text>
        </View>
        <View style={styles.subscriptionOption}>
          <TouchableOpacity style={styles.subscriptionButton} onPress={() => handleSubscriptionSelection('Yearly')}>
            <Text style={styles.subscriptionText}>Yearly Subscription</Text>
          </TouchableOpacity>
          <Text style={styles.subscriptionPrice}>(Ksh 3500)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Dark background color
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  subscriptionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
  },
  subscriptionButton: {
    backgroundColor: 'blue',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  subscriptionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subscriptionPrice: {
    color: '#fff',
    fontSize: 16,
  },
});


