import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser";
import { useOAuth } from "@clerk/clerk-expo";
import { Ionicons } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  useWarmUpBrowser();
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = async () => {
    try {
      if (termsAgreed) {
        const { createdSessionId, setActive } = await startOAuthFlow();

        if (createdSessionId) {
          setActive({ session: createdSessionId });
        } else {
          // Use signIn or signUp for next steps such as MFA
        }
      } else {
        setModalVisible(true);
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image source={require('./../../assets/images/ekazi logo.jpg')} style={styles.image} />
        <Text style={{color:'#0a85ed',fontSize:30,fontWeight:'bold'}}>E-KAZI APP!</Text>
      </View>

      <View style={styles.bottomSection}>
        
        <Text style={styles.subtitle}>Hire, Seek Job Opportunities and make real Money.</Text>
        
        <TouchableOpacity onPress={() => setTermsAgreed(!termsAgreed)} style={styles.agreementContainer}>
          <Ionicons name={termsAgreed ? 'checkbox-outline' : 'square-outline'} size={24} color={termsAgreed ? 'white' : '#ccc'} />
          <Text style={styles.agreementText}>I agree to the <Text style={styles.linkText} onPress={() => WebBrowser.openBrowserAsync('https://termly.io/resources/templates/app-terms-and-conditions/')}>Terms and Conditions</Text></Text>
        </TouchableOpacity>
         
        <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: termsAgreed ? 'white' : 'white' }]}>
          <Text style={[styles.buttonText, { color: termsAgreed ? '#0a85ed' : '#000' }]}>Get Started</Text>  
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>You must agree to the Terms and Conditions before continuing.</Text>
            <Button title="Close" onPress={() => setModalVisible(!modalVisible)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#0a85ed',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  agreementText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 10,
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  button: {
    padding: 12,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight:'bold'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});



