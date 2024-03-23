import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Header from '../../Components/HomeScreen/Header';
import Slider from '../../Components/HomeScreen/Slider';
import Categories from '../../Components/HomeScreen/Categories';
import { collection, getFirestore, getDocs, orderBy } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import JobItemList from '../../Components/HomeScreen/JobItemList';

export default function App() {
  const db = getFirestore(app);
  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [jobItemList, setJobItemList] = useState([]);

  useEffect(() => {
    getSliders();
    getCategoryList();
    getJobItemList();
  }, []);

 // Fetch sliders for home screen
  const getSliders = async () => {
    setSliderList([]);
    const querySnapshot = await getDocs(collection(db, 'Sliders'));
    querySnapshot.forEach((doc) => {
      setSliderList((sliderList) => [...sliderList, doc.data()]);
    });
  };

  // Fetch category list
  const getCategoryList = async () => {
    setCategoryList([]);
    const querySnapshot = await getDocs(collection(db, 'Category'));
    querySnapshot.forEach((doc) => {
      setCategoryList((categoryList) => [...categoryList, doc.data()]);
    });
  };

  // Fetch job item list
  const getJobItemList = async () => {
    setJobItemList([]);
    const querySnapshot = await getDocs(collection(db, 'UserPost'), orderBy('createdAt', 'desc'));
    querySnapshot.forEach((doc) => {
      setJobItemList((jobItemList) => [...jobItemList, doc.data()]);
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Header />
      </View>
      {/* Content */}
      <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.content}>
          {/* Slider */}
          <Slider sliderList={sliderList} />
          {/* Category list */}
          <Categories categoryList={categoryList} />
          {/* Job item list */}
          <JobItemList jobItemList={jobItemList} />
        </View>
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
    marginTop: 130, // Adjust this value according to your header height
  },
  content: {
    padding: 10,
  },
});