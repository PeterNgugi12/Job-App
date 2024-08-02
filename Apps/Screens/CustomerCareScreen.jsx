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
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = generateBotResponse(message.text);
        onReceive(botResponse);
      }, 1000); // Simulating bot typing time
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  const onReceive = (newMessages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
  };

  const generateBotResponse = (userMessage) => {
    // Define predefined responses based on user message
    const responses = {
      'hi': 'Hello! How can I assist you today?',
      'help': 'Sure, I can help you. Please provide more details.',
      'problem': 'I apologize for the inconvenience. Could you please describe the issue in detail?',
      'thank you': 'You\'re welcome! If you have any more questions, feel free to ask.',
      'bye': 'Goodbye! Have a great day!',
    };

    // Check if user message matches any predefined responses
    const botResponseText = responses[userMessage.toLowerCase()];
    if (botResponseText) {
      return [{
        _id: Math.round(Math.random() * 1000000).toString(),
        text: botResponseText,
        createdAt: new Date(),
        user: {
          _id: 2, // Bot's ID
          name: 'Customer Support',
        },
      }];
    } else {
      // If no predefined response, provide a default response with the user's message
      return [{
        _id: Math.round(Math.random() * 1000000).toString(),
        text: `I'm sorry, I didn't understand that. Could you please rephrase your question?\n\nYou said: ${userMessage}`,
        createdAt: new Date(),
        user: {
          _id: 2, // Bot's ID
          name: 'Customer Support',
        },
      }];
    }
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1, // User's ID
      }}
    />
  );
};

export default CustomerCareScreen;






