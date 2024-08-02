import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, ToastAndroid, Alert, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { getFirestore, getDocs, collection, addDoc, doc, getDoc } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from '../../firebaseConfig'
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker'
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useUser } from '@clerk/clerk-expo';
import * as Location from 'expo-location';
import * as ImageManipulator from 'expo-image-manipulator';
import { useNavigation } from '@react-navigation/native';

export default function AddPostScreen() {
  const navigation = useNavigation();
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
  const [counties, setCounties] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedSubCounty, setSelectedSubCounty] = useState('');
  const [subCounties, setSubCounties] = useState([]);
  const formikRef = useRef(null);

  useEffect(() => {
    getCategoryList()
    getCurrentLocation();
    getCounties(); // Call to populate counties
   // Call to handle county change
    loadUserPaymentData();
  }, [])

  const loadUserPaymentData = async () => {
    try {
      const paymentDoc = await getDoc(doc(db, 'UserPayments', user.id));
      if (paymentDoc.exists()) {
        const paymentData = paymentDoc.data();
        formikRef.current.setFieldValue('expiryDate', paymentData.expiryDate);
      }
    } catch (error) {
      console.error('Error loading user payment data:', error);
    }
  };

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

  const getCounties = async () => {
    // Kenya Counties
    const kenyaCounties = [
      "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo Marakwet", "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado",
      "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia",
      "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi",
      "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya", "Taita-Taveta", "Tana River",
      "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
    ];
    setCounties(kenyaCounties);
  };

  const getSubCounties = async (county) => {
    // Kenya Subcounties
    const kenyaSubCounties = {
      "Baringo": ["Baringo Central", "Baringo North", "Baringo South", "Eldama Ravine", "Mogotio", "Tiaty"],
      "Bomet": ["Bomet Central", "Bomet East", "Chepalungu", "Sotik"],
      "Bungoma": ["Bumula", "Bungoma Central", "Bungoma East", "Bungoma North", "Bungoma South", "Kimilili", "Mt. Elgon", "Sirisia", "Tongaren", "Webuye East", "Webuye West"],
      "Busia": ["Bunyala", "Butula", "Matayos", "Nambale", "Samia"],
      "Elgeyo Marakwet": ["Keiyo North", "Keiyo South", "Marakwet East", "Marakwet West"],
      "Embu": ["Manyatta", "Mbeere North", "Mbeere South", "Runyenjes"],
      "Garissa": ["Balambala", "Dadaab", "Fafi", "Garissa Township", "Ijara", "Lagdera"],
      "Homa Bay": ["Homa Bay Town", "Kabondo Kasipul", "Karachuonyo", "Kasipul", "Ndhiwa", "Rangwe", "Suba"],
      "Isiolo": ["Isiolo North", "Isiolo South"],
      "Kajiado": ["Kajiado Central", "Kajiado East", "Kajiado North", "Kajiado West", "Loitokitok", "Namanga"],
      "Kakamega": ["Butere", "Kakamega Central", "Kakamega East", "Kakamega North", "Kakamega South", "Lugari", "Malava", "Matungu", "Mumias East", "Mumias West"],
      "Kericho": ["Ainamoi", "Belgut", "Bureti", "Kipkelion East", "Kipkelion West", "Sigowet-Soin"],
      "Kiambu": ["Gatundu North", "Gatundu South", "Githunguri", "Juja", "Kabete", "Kiambaa", "Kikuyu", "Limuru", "Ruiru", "Thika Town"],
      "Kilifi": ["Ganze", "Kaloleni", "Kilifi North", "Kilifi South", "Malindi", "Magarini", "Rabai"],
      "Kirinyaga": ["Gichugu", "Kirinyaga Central", "Kirinyaga East", "Kirinyaga West", "Mwea East", "Mwea West"],
      "Kisii": ["Bobasi", "Bomachoge Borabu", "Bomachoge Chache", "Kisii Central", "Kisii South", "Kitutu Chache North", "Kitutu Chache South", "Nyamache"],
      "Kisumu": ["Kisumu Central", "Kisumu East", "Kisumu West", "Muhoroni", "Nyakach", "Nyando", "Seme", "Nyando", "Seme"],
      "Kitui": ["Kitui Central", "Kitui East", "Kitui Rural", "Kitui South", "Kitui West", "Mwingi Central", "Mwingi East", "Mwingi North"],
      "Kwale": ["Kinango", "Lunga Lunga", "Matuga", "Msambweni"],
      "Laikipia": ["Laikipia East", "Laikipia North", "Laikipia West", "Laikipia Central", "Laikipia West"],
      "Lamu": ["Lamu East", "Lamu West"],
      "Machakos": ["Athi River", "Kangundo", "Kathiani", "Machakos Town", "Masinga", "Matungulu", "Mavoko", "Mwala", "Yatta"],
      "Makueni": ["Kaiti", "Kibwezi East", "Kibwezi West", "Kilome", "Makueni", "Mbooni"],
      "Mandera": ["Banissa", "Lafey", "Mandera East", "Mandera North", "Mandera West", "Mandera South"],
      "Marsabit": ["Laisamis", "Marsabit Central", "Moyale", "North Horr", "Saku", "Turbi"],
      "Meru": ["Buuri", "Igembe Central", "Igembe North", "Igembe South", "Imenti Central", "Imenti North", "Imenti South", "Meru Central", "Tigania East", "Tigania West"],
      "Migori": ["Awendo", "Kuria East", "Kuria West", "Migori East", "Migori West", "Nyatike", "Rongo", "Suna East", "Suna West", "Uriri"],
      "Mombasa": ["Changamwe", "Jomvu", "Kisauni", "Likoni", "Mvita", "Nyali"],
      "Murang'a": ["Gatanga", "Gatundu South", "Kahuro", "Kandara", "Kangema", "Kigumo", "Maragua", "Mathioya"],
      "Nairobi": ["Dagoretti North", "Dagoretti South", "Embakasi Central", "Embakasi East", "Embakasi North", "Embakasi South", "Embakasi West", "Kamukunji", "Kasarani", "Lang'ata", "Makadara", "Mathare", "Nairobi Central", "Roysambu", "Ruaraka", "Starehe", "Westlands"],
      "Nakuru": ["Bahati", "Gilgil", "Kuresoi North", "Kuresoi South", "Molo", "Naivasha", "Nakuru East", "Nakuru West", "Njoro", "Rongai", "Subukia"],
      "Nandi": ["Aldai", "Chesumei", "Emgwen", "Mosop", "Nandi Central", "Nandi East", "Nandi North", "Tindiret"],
      "Narok": ["Emurua Dikirr", "Kilgoris", "Narok East", "Narok North", "Narok South", "Narok West"],
      "Nyamira": ["Borabu", "Manga", "Masaba North", "Nyamira North", "Nyamira South"],
      "Nyandarua": ["Kinangop", "Kipipiri", "Ndaragwa", "Ol Kalou"],
      "Nyeri": ["Kieni East", "Kieni West", "Mathira East", "Mathira West", "Mukurweini", "Nyeri South", "Tetu"],
      "Samburu": ["Samburu Central", "Samburu East", "Samburu North"],
      "Siaya": ["Alego Usonga", "Bondo", "Gem", "Rarieda", "Ugenya", "Ugunja"],
      "Taita-Taveta": ["Mwatate", "Taveta", "Voi"],
      "Tana River": ["Garsen", "Galole"],
      "Tharaka-Nithi": ["Chuka", "Igembe South", "Tharaka", "Tigania West"],
      "Trans Nzoia": ["Cherangany", "Endebess", "Kwanza", "Saboti"],
      "Turkana": ["Kacheliba", "Kakuma", "Kapenguria", "Katilu", "Kibish", "Lodwar", "Lokichar", "Lokitaung", "Lokori"],
      "Uasin Gishu": ["Ainabkoi", "Kapseret", "Kesses", "Moiben", "Soy", "Turbo"],
      "Vihiga": ["Emuhaya", "Hamisi", "Luanda", "Sabatia", "Vihiga"],
      "Wajir": ["Eldas", "Tarbaj", "Wajir East", "Wajir North", "Wajir South", "Wajir West"],
      "West Pokot": ["Chepareria", "Kacheliba", "Kapenguria", "Sigor"],
    };
    return kenyaSubCounties[county] || [];
  }
  const handleCountyChange = async (itemValue, setFieldValue) => {
    setSelectedCounty(itemValue);
    setFieldValue('county', itemValue);
    setSelectedSubCounty('');
    if (itemValue) {
      // Populate subcounties based on selected county
      const subCounties = await getSubCounties(itemValue); // Await for the result
      if (Array.isArray(subCounties)) {
        // Only update subCounties if it's an array
        setSubCounties(subCounties);
      } else {
        // If subCounties is not an array, set it to an empty array
        setSubCounties([]);
      }
    } else {
      // Clear subcounties if no county is selected
      setSubCounties([]);
    }
  };

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
    <KeyboardAvoidingView style={{ flex: 1, }}>
      <View style={styles.container}>
        <Text style={styles.title}>Add Your Work Profile</Text>
        <Text style={styles.subtitle}>Create New Post and Start Earning.</Text>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
          <Formik
            initialValues={{ title: '', desc: '', category: '', county: '', subcounty: '',  price: '', images: [],profileImage: '', userName: '', userEmail: '', userImage: '', phoneNumber: '',expiryDate: null, createdAt: Date.now() }}
            onSubmit={(values, actions) => onSubmitMethod(values, actions)}
            validate={(values) => {
              const errors = {}
              if (!values.title) {
                console.log("Job Specialization not Present")
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
                    <Text style={styles.imagePickerText}>Add Profile Image</Text>
                  )}
                </TouchableOpacity>
                <Text style={styles.label}>Job Specialization:*</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('title')}
                  onBlur={handleBlur('title')}
                  value={values.title}
                />
                <Text style={styles.label}>Description:*</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('desc')}
                  onBlur={handleBlur('desc')}
                  placeholder=""
                  value={values.desc}
                  multiline
                  numberOfLines={4}
                />
                 <Text style={styles.label}>Upload your Skill Images:*</Text>
                 <TouchableOpacity onPress={pickImage} style={[styles.imagePickerContainer, { marginRight: 10,marginTop:5 }]}>
                    <Text style={styles.imagePickerText}>Add Image</Text>
                  </TouchableOpacity>
                <Text style={styles.label}>Category:*</Text>
                <Picker
                  style={styles.picker}
                  selectedValue={values.category}
                  onValueChange={(itemValue, itemIndex) => setFieldValue('category', itemValue)}
                >
                  <Picker.Item label="Select Category" value="" />
                  {categoryList.map((category, index) => (
                    <Picker.Item key={index} label={category.name} value={category.name} />
                  ))}
                </Picker>
                <Text style={styles.label}>County:*</Text>
                <Picker
  style={styles.picker}
  selectedValue={selectedCounty}
  onValueChange={(itemValue) => handleCountyChange(itemValue, setFieldValue)} // Pass setFieldValue here
>

                  <Picker.Item label="Select County" value="" />
                  {counties.map((county, index) => (
                    <Picker.Item key={index} label={county} value={county} />
                  ))}
                </Picker>
                <Text style={styles.label}>Sub County:*</Text>
<Picker
  style={styles.picker}
  selectedValue={selectedSubCounty}
  onValueChange={(itemValue) => {
    setSelectedSubCounty(itemValue);
    setFieldValue('subcounty', itemValue);
  }}
>
  <Picker.Item label="Select Sub County" value="" />
  {subCounties.map((subCounty, index) => (
    <Picker.Item key={index} label={subCounty} value={subCounty} />
  ))}
</Picker>
                <Text style={styles.label}>Price:*</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('price')}
                  onBlur={handleBlur('price')}
                  value={values.price}
                  keyboardType="number-pad"
                />
               
                <Text style={styles.label}>Phone Number:*</Text>
                <View style={styles.phoneInputContainer}>
                  <TextInput
                    style={styles.phoneInput}
              
                    onChangeText={handleChange('phoneNumber')}
                    value={values?.phoneNumber}
                    keyboardType="phone-pad"
                    placeholder="Phone Number"
                  />
                 
                </View>
                
                <View style={{ flexDirection: 'row', marginTop: 2,justifyContent:'center',}}>
                 
                  <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.submitButtonText}>Submit</Text>
                      
                    )}

                  </TouchableOpacity>
                  
                </View>
                
                
              </>
            )}
          </Formik>
          <View style={{marginTop:50}}/>
        </ScrollView>
        
      </View>
     
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#0a85ed',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 5,
    marginBottom: 20,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#0a85ed',
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0a85ed',
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  countryCodePicker: {
    width: 100,
    height: '100%',
  },
  submitButton: {
    backgroundColor: '#0a85ed',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent:'center'
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  imagePickerContainer: {
    borderWidth: 1,
    borderColor: '#0a85ed',
    borderRadius: 5,
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePickerText: {
    fontSize: 16,
    color: '#555',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
});









