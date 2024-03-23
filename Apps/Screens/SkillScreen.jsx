import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { getFirestore, getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { app } from '../../firebaseConfig';
import { Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

export default function SkillScreen() {
  const [posts, setPosts] = useState([]);
  const { user } = useUser();
  const db = getFirestore(app);
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    const querySnapshot = await getDocs(collection(db, 'UserPost'));
    const userPosts = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().userEmail === user.primaryEmailAddress.emailAddress) {
        userPosts.push({ id: doc.id, ...doc.data() });
      }
    });
    setPosts(userPosts);
  };

  const handleEditPost = (postId) => {
    navigation.navigate('EditPost', { postId });
  };

  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, 'UserPost', postId));
      setPosts(posts.filter(post => post.id !== postId));
      Alert.alert('Success', 'Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'Failed to delete post');
    }
  };

  const renderPostItem = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.title}>Job Title: {item.title}</Text>
      <Text style={styles.description}>Description: {item.desc}</Text>
      <Text style={styles.phoneNumber}>Phone Number: {item.phoneNumber}</Text>
      <FlatList
        data={item.images}
        horizontal
        renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} />}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={{height:10}}/>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: item.selectedLocation.latitude,
          longitude: item.selectedLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: item.selectedLocation.latitude,
            longitude: item.selectedLocation.longitude,
          }}
        />
      </MapView>
      <TouchableOpacity style={styles.button} onPress={() => handleEditPost(item.id)}>
        <Text>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handleDeletePost(item.id)}>
        <Text>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  postContainer: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    marginBottom: 5,
  },
  phoneNumber: {
    marginBottom: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
  map: {
    height: 200,
    marginBottom: 10,
  },
  button: {
    marginTop: 5,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});



