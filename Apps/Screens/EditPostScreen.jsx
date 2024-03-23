import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView, Alert, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { app } from '../../firebaseConfig';

export default function EditPostScreen() {
  const route = useRoute();
  const postId = route.params.postId;
  const [postData, setPostData] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const db = getFirestore(app);

  useEffect(() => {
    fetchPostData();
  }, []);

  const fetchPostData = async () => {
    try {
      const docRef = doc(db, 'UserPost', postId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        setPostData(docSnapshot.data());
      } else {
        console.error('No such document!');
      }
    } catch (error) {
      console.error('Error fetching post data:', error);
    }
  };

  const handleUpdatePost = async () => {
    try {
      const docRef = doc(db, 'UserPost', postId);
      await updateDoc(docRef, postData);
      Alert.alert('Success', 'Post updated successfully');
    } catch (error) {
      console.error('Error updating post:', error);
      Alert.alert('Error', 'Failed to update post');
    }
  };

  const handleUpdateLocation = (newLocation) => {
    setPostData({
      ...postData,
      selectedLocation: newLocation,
    });
  };

  const handleAddImages = () => {
    // Add functionality to add more images
  };

  if (!postData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Text>Job Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={postData.title}
        onChangeText={(text) => setPostData({ ...postData, title: text })}
      />
      <Text>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={postData.desc}
        onChangeText={(text) => setPostData({ ...postData, desc: text })}
      />
      <Text>phone No</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={postData.phoneNumber}
        onChangeText={(text) => setPostData({ ...postData, phoneNumber: text })}
      />
      <View style={styles.imageContainer}>
        <Text style={styles.label}>Images:</Text>
        {postData.images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.image} />
        ))}
        <Button title="Add Images" onPress={handleAddImages} />
      </View>
      <View style={styles.locationContainer}>
        <Text style={styles.label}>Selected Location:</Text>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: postData.selectedLocation.latitude,
            longitude: postData.selectedLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: postData.selectedLocation.latitude,
              longitude: postData.selectedLocation.longitude,
            }}
          />
        </MapView>
        <Button title="Update Location" onPress={() => handleUpdateLocation(postData.selectedLocation)} />
      </View>
      <Button title="Update Post" onPress={handleUpdatePost} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  input: {
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  imageContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  locationContainer: {
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
});

