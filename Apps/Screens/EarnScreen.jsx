import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider';
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from '../../firebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';

const DURATIONS = {
    DAILY: 'Daily',
    WEEKLY: 'Weekly',
    MONTHLY: 'Monthly',
    YEARLY: 'Yearly'
};

const EarnScreen = () => {
    const db = getFirestore(app);
    const { user } = useUser();
    const navigation = useNavigation();

    const [paymentAmount, setPaymentAmount] = useState(20);
    const [selectedDuration, setSelectedDuration] = useState(DURATIONS.DAILY);
    const [phoneNumber, setPhoneNumber] = useState('254');
    const [loading, setLoading] = useState(false);
    const [postActive, setPostActive] = useState(true);
    const [paymentId, setPaymentId] = useState(null);

    const deactivatePosts = () => setPostActive(false);
    const reactivatePosts = () => setPostActive(true);

    const handleSliderChange = (value) => {
        if (value <= 0.25) {
            setSelectedDuration(DURATIONS.DAILY);
            setPaymentAmount(1);
        } else if (value <= 0.5) {
            setSelectedDuration(DURATIONS.WEEKLY);
            setPaymentAmount(100);
        } else if (value <= 0.75) {
            setSelectedDuration(DURATIONS.MONTHLY);
            setPaymentAmount(200);
        } else {
            setSelectedDuration(DURATIONS.YEARLY);
            setPaymentAmount(2000);
        }
    };

    const handlePaymentSubmission = async () => {
        if (!user || !user.id) {
            alert('User not logged in. Please log in to proceed.');
            return;
        }
    
        if (!phoneNumber || !phoneNumber.trim()) {
            alert('Please enter a valid phone number.');
            return;
        }
    
        setLoading(true);
    
        try {
            const response = await fetch(`https://api.ekazi.co.ke/mpesa/simulate?phoneNumber=${encodeURIComponent(phoneNumber)}&amount=${encodeURIComponent(paymentAmount)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error:', errorText);
                alert('An error occurred while initiating the payment. Please try again.');
                setLoading(false);
                return;
            }
    
            const result = await response.json();
    
            if (result.ResponseCode === '0') {
                alert('STK push initiated successfully! Please complete the payment on your phone.');
    
                setPaymentId(result.transactionId);

                // Poll payment status until it's confirmed
                const checkPaymentStatus = async () => {
                    try {
                        const statusResponse = await fetch(`https://api.ekazi.co.ke/mpesa/status?transactionId=${result.transactionId}`);
                        const statusResult = await statusResponse.json();
    
                        if (statusResult.success) {
                            alert('Payment verified successfully!');
                            
                            // Save payment details and navigate to addpost screen
                            const currentDate = new Date();
                            let expiryDate = new Date(currentDate);
    
                            switch (selectedDuration) {
                                case DURATIONS.DAILY:
                                    expiryDate.setDate(currentDate.getDate() + 1);
                                    break;
                                case DURATIONS.WEEKLY:
                                    expiryDate.setDate(currentDate.getDate() + 7);
                                    break;
                                case DURATIONS.MONTHLY:
                                    expiryDate.setMonth(currentDate.getMonth() + 1);
                                    break;
                                case DURATIONS.YEARLY:
                                    expiryDate.setFullYear(currentDate.getFullYear() + 1);
                                    break;
                            }
    
                            await setDoc(doc(db, 'UserPayments', user.id), {
                                amount: paymentAmount.toString(), // Store amount as a string
                                phoneNumber,
                                status: 'initiated',
                                paymentDate: currentDate,
                                expiryDate,
                            });
    
                            reactivatePosts();
                            navigation.navigate('addpost');
                        } else {
                            alert('Payment verification failed: ' + statusResult.message);
                        }
                    } catch (error) {
                        console.error('Error checking payment status:', error);
                        alert('An error occurred while verifying the payment status.');
                    } finally {
                        setLoading(false);
                    }
                };
    
                setTimeout(checkPaymentStatus, 5000); // Check payment status after a delay
    
            } else {
                alert('Payment initiation failed: ' + result.ResponseDescription);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error initiating payment:', error);
            alert('An error occurred while initiating the payment.');
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkPaymentStatus = async () => {
            if (!user || !user.id) return;

            try {
                const docRef = doc(db, 'UserPayments', user.id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const paymentData = docSnap.data();
                    const expiryDate = new Date(paymentData.expiryDate.seconds * 1000);
                    if (expiryDate > new Date()) {
                        reactivatePosts();
                        navigation.navigate('addpost');
                    } else {
                        deactivatePosts();
                    }
                } else {
                    deactivatePosts();
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
            }
        };

        checkPaymentStatus();

        return () => {
            // cleanup logic here if necessary
        };
    }, [user, db, navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>Make Payment</Text>
            <Text style={styles.descriptionText}>Upgrade to post and earn.</Text>

            <Text style={styles.labelText}>Phone Number:</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                onChangeText={(text) => setPhoneNumber(text.startsWith('254') ? text : `254${text}`)}
                value={phoneNumber}
            />

            <Text style={styles.labelText}>Slide to Select Payment Duration:</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                step={0.25}
                value={0}
                onValueChange={handleSliderChange}
            />
            <Text>Duration: {selectedDuration}</Text>

            <Text style={styles.labelText}>Payment Amount:</Text>
            <TextInput
                style={styles.input}
                editable={false}
                value={`Ksh ${paymentAmount}`}
            />

            <TouchableOpacity style={styles.mpesaButton} onPress={handlePaymentSubmission} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#ffffff" />
                ) : (
                    <Text style={styles.mpesaButtonText}>Pay via MPesa</Text>
                )}
            </TouchableOpacity>

            {!postActive && (
                <Text style={styles.postDeactivationText}>Your posts are currently deactivated. Please subscribe to reactivate them.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        paddingHorizontal: 20,
    },
    titleText: {
        paddingBottom: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },
    descriptionText: {
        marginBottom: 5,
        fontSize: 17,
    },
    labelText: {
        marginTop: 10,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 8,
        borderRadius: 5,
        marginBottom: 15,
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 15,
    },
    mpesaButton: {
        backgroundColor: '#0a85ed',
        padding: 10,
        borderRadius: 5,
    },
    mpesaButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    postDeactivationText: {
        marginTop: 20,
        color: 'red',
        fontWeight: 'bold',
    },
});

export default EarnScreen;



