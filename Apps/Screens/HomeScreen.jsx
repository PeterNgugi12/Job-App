import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import Header from '../../Components/HomeScreen/Header';
import Slider from '../../Components/HomeScreen/Slider';
import Categories from '../../Components/HomeScreen/Categories';
import JobItemList from '../../Components/HomeScreen/JobItemList';
import * as Location from 'expo-location';
import { collection, getFirestore, getDocs, orderBy, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

export default function App() {
  const db = getFirestore(app);
  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [jobItemList, setJobItemList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getLocationPermission();
  }, []);

  const getLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc);
    fetchData(loc);
  };

  const fetchData = async (loc) => {
    setRefreshing(true);
    await getSliders();
    await getCategoryList();
    if (loc) {
      await getJobItemList(loc);
    }
    setRefreshing(false);
  };

  const getSliders = async () => {
    setSliderList([]);
    const querySnapshot = await getDocs(collection(db, 'Sliders'));
    querySnapshot.forEach((doc) => {
      setSliderList((sliderList) => [...sliderList, doc.data()]);
    });
  };

  const getCategoryList = async () => {
    setCategoryList([]);
    const querySnapshot = await getDocs(collection(db, 'Category'));    
    querySnapshot.forEach((doc) => {
      setCategoryList((categoryList) => [...categoryList, doc.data()]);
    });
  };

  const getJobItemList = async (loc) => {
    setJobItemList([]);
    const userLocation = 'Muranga'; // Replace with logic to determine user location
    const querySnapshot = await getDocs(
      collection(db, 'UserPost'),
      where('location', '==', userLocation),
      orderBy('createdAt', 'desc')
    );
    querySnapshot.forEach((doc) => {
      setJobItemList((jobItemList) => [...jobItemList, doc.data()]);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header />
      </View>
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchData(location)} />
        }
      >
        <View style={styles.content}>
          <Slider sliderList={sliderList} />
        </View>
        <Categories categoryList={categoryList} />
        <JobItemList jobItemList={jobItemList} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'white',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
    elevation: 3,
    height: 100,
  },
  scrollView: {
    marginTop: 100,
  },
  content: {
    padding: 10,
  },
});

