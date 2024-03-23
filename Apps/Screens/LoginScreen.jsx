import { View, Text,Image, TouchableOpacity} from 'react-native'
import React from 'react'
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser";
import { useOAuth } from "@clerk/clerk-expo";


WebBrowser.maybeCompleteAuthSession();
export default function LoginScreen() {

    useWarmUpBrowser();
 
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();
 
      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);


  return (
    <View>
      <Image source={require('./../../assets/images/login.jpg')}className='w-full h-[400px] object-cover'/>

      <View className='p-8 bg-white mt-[-20] rounded-t-3xl'>
        <Text className='text-[30px] font-bold'>Kenya Hustle Yangu!</Text>
        <Text className='text-[18px] text-slate-500 mt-6'>Hire, Seek Job Opportunities and make real Money.</Text>
        <TouchableOpacity onPress={onPress} className='p-4 bg-green-400 rounded-full mt-20'>
            <Text className='text-white text-center text-[18px]'>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}