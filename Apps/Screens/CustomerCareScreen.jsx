import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const CustomerCareScreen = () => {
  const [messages, setMessages] = useState([]);
  const db = getFirestore(app);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedMessages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          _id: doc.id,
          text: data.text,
          createdAt: data.createdAt.toDate(),
          user: {
            _id: data.user._id,
            name: data.user.name,
          },
        };
      });
      setMessages(updatedMessages);
    });

    return () => unsubscribe();
  }, []);

  const onSend = async newMessages => {
    try {
      const message = newMessages[0];
      await addDoc(collection(db, 'messages'), {
        text: message.text,
        createdAt: new Date(),
        user: message.user,
      });
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1, // You can change this value to distinguish users
      }}
    />
  );
};

export default CustomerCareScreen;



