import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore'
import JobItemList from '../../Components/HomeScreen/JobItemList'
import { app } from '../../firebaseConfig';
import JobList from './JobList';


export default function ExploreScreen() {

  const db=getFirestore(app)
 const[hireList,sethireList]=useState([])

  useEffect(()=>{
  getAllJobs()
  },[])
  //used to get all jobs
  const getAllJobs=async()=>{
    sethireList([])
    const q=query(collection(db,'UserPost'),orderBy('createdAt','desc'))

    const snapshot=await getDocs(q)

    snapshot.forEach((doc)=>{
      sethireList(hireList=>[...hireList,doc.data()])
    })

  }
  return (
    <ScrollView nestedScrollEnabled={true}style={{marginTop:20,padding:12,}}>
      <Text style={{fontSize:22,fontWeight:'bold'}}>Explore More</Text>
      <JobItemList jobItemList={hireList}/>
    </ScrollView>
  )
}