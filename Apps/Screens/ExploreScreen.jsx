import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
import JobItemList from '../../Components/HomeScreen/JobItemList';
import { app } from '../../firebaseConfig';
import SearchByLocation from "../../Components/HomeScreen/Search/SearchByLocation";

export default function ExploreScreen() {
    const db = getFirestore(app);
    const [hireList, setHireList] = useState([]);
    const [refreshing, setRefreshing] = useState(false); // State to manage refreshing

    useEffect(() => {
        getAllJobs();
    }, []);

    const fetchData = async () => {
        setRefreshing(true); // Set refreshing to true when fetching new data
        await getAllJobs();
        setRefreshing(false); // Set refreshing to false after data is fetched
    };

    // Function to get all jobs
    const getAllJobs = async () => {
        setHireList([]);
        const q = query(collection(db, 'UserPost'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const jobsData = [];
        snapshot.forEach((doc) => {
            jobsData.push(doc.data());
        });
        setHireList(jobsData);
    };

    // Function to handle search by title
    const handleSearchByTitle = async (searchTitle) => {
        setRefreshing(true); // Set refreshing to true when fetching new data
        setHireList([]); // Clear the list before fetching new data
        const q = query(collection(db, 'UserPost'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const jobsData = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            // Check if the title contains the search string
            if (data.title.toLowerCase().includes(searchTitle.toLowerCase())) {
                jobsData.push(data);
            }
        });
        setHireList(jobsData);
        setRefreshing(false); // Set refreshing to false after data is fetched
    };

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={{ marginTop: 20, padding: 10 }}>
                <SearchByLocation onSearch={handleSearchByTitle} />
            </View>
            <ScrollView
                nestedScrollEnabled={true}
                style={{ padding: 12 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} />}
            >
                <JobItemList jobItemList={hireList} />
            </ScrollView>
        </ScrollView>
    );
}
