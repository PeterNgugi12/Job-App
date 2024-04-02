import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, ToastAndroid, Alert, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { getFirestore, getDocs, collection, addDoc } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from '../../firebaseConfig'
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker'
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useUser } from '@clerk/clerk-expo';
import * as Location from 'expo-location';
import * as ImageManipulator from 'expo-image-manipulator';

export default function AddPostScreen() {
  const [profileImage, setProfileImage] = useState(null);
  const [images, setImages] = useState([]);
  const db = getFirestore(app);
  const storage = getStorage();
  const [loading, setLoading] = useState(false)
  const [initialRegion, setInitialRegion] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const { user } = useUser()
  const [categoryList, setCategoryList] = useState([])
  const formikRef = useRef(null);

  useEffect(() => {
    getCategoryList()
    getCurrentLocation();
  }, [])

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setInitialRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  }

  const getCategoryList = async () => {
    const querySnapshot = await getDocs(collection(db, 'Category'));

    querySnapshot.forEach((doc) => {
      console.log("Docs:", doc.data())
      setCategoryList((prevList) => [...prevList, doc.data()]);
    })
  }

  const pickProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
  
    console.log("Profile Image Picker Result:", result);
  
    if (!result.cancelled) {
      // If only one image is selected, directly set it as the profile image
      if (Array.isArray(result.assets) && result.assets.length === 1) {
        setProfileImage(result.assets[0].uri);
      } else {
        // If multiple images are selected, take the first one as the profile image
        setProfileImage(result.uri);
      }
    } else {
      console.log("Profile image picking operation canceled.");
    }
  };
  
  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });
  
    console.log("Image Picker Result:", result);
  
    if (!result.cancelled) {
      const selectedImages = result.assets.map(asset => asset.uri);
      if (selectedImages.length === 1) {
        // If only one image is selected, directly set it as the images state
        setImages(selectedImages);
      } else {
        // If multiple images are selected, exclude the first image (profile image) and add the rest to the state
        const remainingImages = selectedImages.slice(1);
        setImages(prevImages => [...remainingImages, ...prevImages]);
      }
    } else {
      console.log("Image picking operation canceled.");
    }
  };
  

  const onSubmitMethod = async (values, { resetForm }) => {
    setLoading(true);
    values.images = images;
    console.log(values);
    navigation.navigate('view-profile', { profileImageURI: profileImage }) 
  
    try {
      // Upload profile image if available
let profileImageUrl = '';
if (profileImage) {
  try {
    const response = await fetch(profileImage);
    const blob = await response.blob();
    const profileImageRef = ref(storage, `profileImages/${user.uid}`);
    await uploadBytes(profileImageRef, blob);
    profileImageUrl = await getDownloadURL(profileImageRef);
    values.profileImage = profileImageUrl;
  } catch (error) {
    console.error('Error uploading profile image:', error);
  }
}

  
      // Upload other images
      const blobs = await Promise.all(
        images.map(async (imageUri) => {
          const resp = await fetch(imageUri);
          return await resp.blob();
        })
      );
  
      const downloadUrls = await Promise.all(
        blobs.map(async (blob, index) => {
          const storageRef = ref(storage, `jobPost/${Date.now()}_${index}.jpg`);
          await uploadBytes(storageRef, blob);
          return getDownloadURL(storageRef);
        })
      );
  
      console.log("Download URLs:", downloadUrls);
      values.images = downloadUrls;
      values.userName = user?.fullName || '';
      values.userEmail = user?.primaryEmailAddress?.emailAddress || '';
      values.userImage = user?.imageUrl || '';
      values.profileImage = profileImageUrl;
  
      const docRef = await addDoc(collection(db, 'UserPost'), values);
      if (docRef.id) {
        setLoading(false)
        console.log('Document Added!!')
        Alert.alert('Success!!!', 'Post Added Successful.')
        resetForm(); // Reset the form after successful submission
        setProfileImage(null); // Clear the profile image
        setImages([]); // Clear the selected images
        setInitialRegion(null); // Clear the initial region
        setPhoneNumber(''); // Clear the phone number
        setCountryCode(''); // Clear the country code
        formikRef.current.resetForm(); // Optionally, you can use Formik's resetForm() method
      }
      console.log("Images uploaded successfully");
    } catch (error) {
      console.error("Error uploading images:", error);
    }
    const { selectedLocation, ...otherValues } = values;
    otherValues.location = selectedLocation;
  };
  
  

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View className='p-5 flex-1'>
        <Text className="text-[27px] font-bold">Add New Post</Text>
        <Text className="text-[17px] text-gray-500 mb-7">Create New Post and Start Earning.</Text>
        <ScrollView showsVerticalScrollIndicator={false} className='p-10 flex-1'>
          <Formik
            initialValues={{ title: '', desc: '', category: '', address: '', price: '', images: [],profileImage: '', userName: '', userEmail: '', userImage: '', phoneNumber: '', createdAt: Date.now() }}
            onSubmit={(values, actions) => onSubmitMethod(values, actions)}
            validate={(values) => {
              const errors = {}
              if (!values.title) {
                console.log("Title not Present")
                ToastAndroid.show('Title must be There', ToastAndroid.SHORT)
                errors.name = "Title Must be there"
              }
              return errors
            }}
            innerRef={formikRef}
          >
            {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors }) => (
              <>
               <TouchableOpacity onPress={pickProfileImage} style={styles.imagePickerContainer}>
                  {profileImage && (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                  )}
                  {!profileImage && (
                    <Image source={require('./../../assets/images/placeholde.jpg')} style={styles.profileImage} />
                  )}
                  <Text style={styles.imagePickerText}>Add Profile Image</Text>
                </TouchableOpacity>

                {Array.isArray(images) && images.length > 0 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                    {images.map((image, index) => (
                      <Image key={index} source={{ uri: image }} style={styles.image} />
                    ))}
                  </ScrollView>
                )}
                <TouchableOpacity onPress={pickImage} style={styles.imagePickerContainer}>
                  <Image source={require('./../../assets/images/placeholde.jpg')} style={styles.image} />
                  <Text style={styles.imagePickerText}>Add Images</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.input} placeholder='Title' value={values?.title} onChangeText={handleChange('title')} />
                <TextInput
                  style={styles.input} placeholder='Description' value={values?.desc} numberOfLines={5} onChangeText={handleChange('desc')} />
                <TextInput
                  style={styles.input} placeholder='Price' value={values?.price} keyboardType='number-pad' onChangeText={handleChange('price')} />
                <TextInput
                  style={styles.input}
                  placeholder='Address'
                  value={values?.address}
                  onChangeText={handleChange('address')}
                />
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={values?.category} onValueChange={itemValue => setFieldValue('category', itemValue)}>
                    {categoryList && categoryList.length > 0 && categoryList.map((item, index) => (
                      <Picker.Item key={index} label={item?.name} value={item?.name} />
                    ))}
                  </Picker>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder='Phone Number'
                  value={values?.phoneNumber}
                  keyboardType='phone-pad'
                  onChangeText={handleChange('phoneNumber')}
                />
                <MapView
                  style={styles.map}
                  provider={PROVIDER_GOOGLE}
                  showsUserLocation
                  initialRegion={initialRegion}
                  onPress={(event) => {
                    const { latitude, longitude } = event.nativeEvent.coordinate;
                    setFieldValue('selectedLocation', { latitude, longitude });
                  }}
                >
                  {values.selectedLocation && (
                    <Marker
                      coordinate={{
                        latitude: values.selectedLocation.latitude,
                        longitude: values.selectedLocation.longitude,
                      }}
                    />
                  )}
                </MapView>
                <TouchableOpacity style={[styles.button, { backgroundColor: loading ? '#ccc' : 'blue' }]} onPress={handleSubmit} disabled={loading}>
                  {loading ?
                    <ActivityIndicator color='#fff' />
                    :
                    <Text style={styles.buttonText}>Submit</Text>
                  }
                </TouchableOpacity>
                <View style={{ height: 150 }} />
              </>
            )}
          </Formik>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 17,
    fontSize: 15,
    marginBottom: 5,
    marginTop: 10,
    textAlignVertical: "top",
    paddingTop: 15
  },
  imagePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginRight: 10,
  },
  imagePickerText: {
    padding: 5,
    fontSize: 16,
    color: 'gray',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginRight: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 15,
  },
  map: {
    flex: 1,
    height: 300,
    marginTop: 10,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
});






