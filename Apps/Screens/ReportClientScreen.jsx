import React, { useState } from 'react';
import { View, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const db = getFirestore(app);

const ReportClientScreen = () => {
  const [reportText, setReportText] = useState('');

  const handleSubmit = async () => {
    try {
      // Create a new document in Firestore collection
      await addDoc(collection(db, 'reportclient'), {
        reportText,
        createdAt: Timestamp.now(),
      });

      console.log('Report submitted successfully.');

      // Reset the input field after submission
      setReportText('');
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        placeholder="Enter report"
        value={reportText}
        onChangeText={text => setReportText(text)}
        multiline
        style={styles.input}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 200,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    textAlignVertical: 'top', // Allow multiline text alignment from top
  },
});

export default ReportClientScreen;



